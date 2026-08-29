import Phaser from 'phaser';
import { getColorTemp } from '../colorTempState.js';
import { playPop, playClear } from '../audio.js';

// Consumption Mechanic prototype (ticket 04): bubble-burster.
// A handful of bubbles drift inside the Consumption Spot's bounds; clicking
// one pops it. Popping them all triggers a celebration and a longer pause
// before a fresh batch respawns together — popping just one respawns it
// quickly on its own, so the Spot never goes fully dead.

// TUNABLES — fine-tune later, not decided now:
const BUBBLE_COUNT = 6;
const BUBBLE_RADIUS_RANGE = [10, 20];
const DRIFT_SPEED = 0.9;
const PARTIAL_RESPAWN_DELAY_RANGE = [400, 1200]; // one bubble popped, others remain
const FULL_CLEAR_RESPAWN_DELAY = 7000; // all bubbles popped — the "win" pause
// Not yet decided (fog, not this ticket): overall Spot/game size, bubble
// count tuning, what "success" means beyond a full clear (a streak? a
// score?), easter eggs.

// Hue ranges (0-1 hue wheel) per color temperature — so bubble colors match
// the toggle by palette, not just by riding the CSS filter passively.
const HUE_RANGES = {
  neutral: () => Math.random(),
  warm: () => (Math.random() * 0.17 - 0.05 + 1) % 1, // reds through yellows
  cool: () => 0.45 + Math.random() * 0.3, // blues through purples
};

function randRange([min, max]) {
  return min + Math.random() * (max - min);
}

export function createBubbleBurster(scene, spot, spotSize) {
  const bounds = {
    minX: spot.x - spotSize / 2 + 15,
    maxX: spot.x + spotSize / 2 - 15,
    minY: spot.y - spotSize / 2 + 15,
    maxY: spot.y + spotSize / 2 - 15,
  };

  const bubbles = [];

  function spawnBubble() {
    const radius = randRange(BUBBLE_RADIUS_RANGE);
    const x = randRange([bounds.minX + radius, bounds.maxX - radius]);
    const y = randRange([bounds.minY + radius, bounds.maxY - radius]);
    const hue = (HUE_RANGES[getColorTemp()] || HUE_RANGES.neutral)();
    const hsv = Phaser.Display.Color.HSVToRGB(hue, 0.6, 1);
    const color = Phaser.Display.Color.GetColor(hsv.r, hsv.g, hsv.b);

    const circle = scene.add.circle(x, y, radius, color, 0.55);
    circle.setStrokeStyle(2, 0xffffff, 0.7);
    circle.setInteractive({ useHandCursor: true });
    circle.driftAngle = Math.random() * Math.PI * 2;
    circle.radius = radius;

    circle.on('pointerdown', () => pop(circle));
    bubbles.push(circle);
  }

  function spawnBatch() {
    for (let i = 0; i < BUBBLE_COUNT; i++) spawnBubble();
  }

  function celebrateClear() {
    playClear();
    const burst = scene.add.text(spot.x, spot.y, 'nice!', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#fff2b8',
    }).setOrigin(0.5);
    scene.tweens.add({
      targets: burst,
      y: burst.y - 30,
      alpha: 0,
      scale: 1.4,
      duration: 900,
      onComplete: () => burst.destroy(),
    });
  }

  let awaitingBatchRespawn = false;

  function pop(circle) {
    const index = bubbles.indexOf(circle);
    if (index === -1) return;
    bubbles.splice(index, 1);
    playPop();

    scene.tweens.add({
      targets: circle,
      scale: 1.6,
      alpha: 0,
      duration: 180,
      onComplete: () => {
        circle.destroy();
        // Checked here (not at pop-call-time) so a burst of near-simultaneous
        // pops all see the final post-splice count; awaitingBatchRespawn
        // ensures only the first one to notice a full clear acts on it.
        if (bubbles.length === 0) {
          if (!awaitingBatchRespawn) {
            awaitingBatchRespawn = true;
            celebrateClear();
            scene.time.delayedCall(FULL_CLEAR_RESPAWN_DELAY, () => {
              awaitingBatchRespawn = false;
              spawnBatch();
            });
          }
        } else {
          scene.time.delayedCall(randRange(PARTIAL_RESPAWN_DELAY_RANGE), spawnBubble);
        }
      },
    });
  }

  spawnBatch();

  function update() {
    for (const b of bubbles) {
      b.x += Math.cos(b.driftAngle) * DRIFT_SPEED;
      b.y += Math.sin(b.driftAngle) * DRIFT_SPEED;
      if (b.x < bounds.minX + b.radius || b.x > bounds.maxX - b.radius) b.driftAngle = Math.PI - b.driftAngle;
      if (b.y < bounds.minY + b.radius || b.y > bounds.maxY - b.radius) b.driftAngle = -b.driftAngle;
      b.x = Phaser.Math.Clamp(b.x, bounds.minX + b.radius, bounds.maxX - b.radius);
      b.y = Phaser.Math.Clamp(b.y, bounds.minY + b.radius, bounds.maxY - b.radius);
    }
  }

  return { update };
}
