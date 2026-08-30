import Phaser from 'phaser';
import { getColorTemp } from '../colorTempState.js';
import { playClink } from '../audio.js';

// Consumption Mechanic prototype (ticket 06): gravity toy.
// Deliberately different in kind from both prior Mechanics: no win condition
// or clear-and-reshuffle cycle at all — bubble-burster (04) is real-time
// popping, memory-match (05) is turn-based logic, this is a physics toy you
// just poke at. Click inside the Spot to drop a ball; balls fall, bounce off
// the Spot's walls and each other. First Mechanic to actually use physics
// (gravity + collision), which the "game scape" direction (ADR-0001) wanted.

// TUNABLES — fine-tune later, not decided now:
const GRAVITY = 0.25;
const WALL_BOUNCE_DAMPING = 0.7;
const BALL_RADIUS_RANGE = [8, 14];
const MAX_BALLS = 8;
const CLINK_COOLDOWN_MS = 60; // avoid a noise-spam of clinks when many balls pile up
// Not yet decided (fog, not this ticket): resting friction/settling behavior
// (balls currently keep a little bounce forever rather than settling
// still), whether this needs any win condition at all or stays a pure toy,
// a locked relationship between ball count and color count (same follow-up
// flagged on ticket 05), easter eggs.

const HUE_RANGES = {
  neutral: () => Math.random(),
  warm: () => (Math.random() * 0.17 - 0.05 + 1) % 1,
  cool: () => 0.45 + Math.random() * 0.3,
};

function colorFor(temp) {
  const hue = (HUE_RANGES[temp] || HUE_RANGES.neutral)();
  const hsv = Phaser.Display.Color.HSVToRGB(hue, 0.6, 1);
  return Phaser.Display.Color.GetColor(hsv.r, hsv.g, hsv.b);
}

function randRange([min, max]) {
  return min + Math.random() * (max - min);
}

export function createGravityToy(scene, spot, spotSize) {
  const bounds = {
    minX: spot.x - spotSize / 2 + 8,
    maxX: spot.x + spotSize / 2 - 8,
    minY: spot.y - spotSize / 2 + 8,
    maxY: spot.y + spotSize / 2 - 8,
  };

  const balls = [];
  let lastClinkAt = 0;

  function spawnBall(x, y) {
    const radius = randRange(BALL_RADIUS_RANGE);
    const clampedX = Phaser.Math.Clamp(x, bounds.minX + radius, bounds.maxX - radius);
    const clampedY = Phaser.Math.Clamp(y, bounds.minY + radius, bounds.maxY - radius);
    const color = colorFor(getColorTemp());

    const circle = scene.add.circle(clampedX, clampedY, radius, color, 0.8);
    circle.setStrokeStyle(2, 0xffffff, 0.5);
    circle.radius = radius;
    circle.vx = randRange([-1, 1]);
    circle.vy = 0;

    balls.push(circle);
    if (balls.length > MAX_BALLS) {
      const oldest = balls.shift();
      scene.tweens.add({ targets: oldest, alpha: 0, duration: 250, onComplete: () => oldest.destroy() });
    }
  }

  const zone = scene.add.zone(spot.x, spot.y, spotSize, spotSize).setInteractive();
  zone.on('pointerdown', (pointer) => spawnBall(pointer.worldX, pointer.worldY));

  function resolveCollisions() {
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i];
        const b = balls[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.radius + b.radius;
        if (dist > 0 && dist < minDist) {
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;
          a.x -= (nx * overlap) / 2;
          a.y -= (ny * overlap) / 2;
          b.x += (nx * overlap) / 2;
          b.y += (ny * overlap) / 2;

          const relVel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (relVel > 0) {
            const restitution = 0.85;
            const impulse = relVel * restitution;
            a.vx -= impulse * nx;
            a.vy -= impulse * ny;
            b.vx += impulse * nx;
            b.vy += impulse * ny;

            const now = performance.now();
            if (now - lastClinkAt > CLINK_COOLDOWN_MS) {
              lastClinkAt = now;
              playClink(Math.min(2, relVel / 2));
            }
          }
        }
      }
    }
  }

  function update() {
    for (const b of balls) {
      b.vy += GRAVITY;
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < bounds.minX + b.radius) {
        b.x = bounds.minX + b.radius;
        b.vx = -b.vx * WALL_BOUNCE_DAMPING;
      } else if (b.x > bounds.maxX - b.radius) {
        b.x = bounds.maxX - b.radius;
        b.vx = -b.vx * WALL_BOUNCE_DAMPING;
      }
      if (b.y < bounds.minY + b.radius) {
        b.y = bounds.minY + b.radius;
        b.vy = -b.vy * WALL_BOUNCE_DAMPING;
      } else if (b.y > bounds.maxY - b.radius) {
        b.y = bounds.maxY - b.radius;
        b.vy = -b.vy * WALL_BOUNCE_DAMPING;
      }
    }
    resolveCollisions();
  }

  return { update };
}
