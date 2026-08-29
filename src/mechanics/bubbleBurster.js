import Phaser from 'phaser';

// Consumption Mechanic prototype (ticket 04): bubble-burster.
// A handful of bubbles drift inside the Consumption Spot's bounds; clicking
// one pops it (scale/fade out), and a replacement spawns after a short delay.
// No scoring — just a tactile, ongoing thing to poke at.

const BUBBLE_COUNT = 6;
const BUBBLE_RADIUS_RANGE = [10, 20];
const DRIFT_SPEED = 0.3;
const RESPAWN_DELAY_RANGE = [400, 1200];

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
    const hsv = Phaser.Display.Color.HSVToRGB(Math.random(), 0.6, 1);
    const color = Phaser.Display.Color.GetColor(hsv.r, hsv.g, hsv.b);

    const circle = scene.add.circle(x, y, radius, color, 0.55);
    circle.setStrokeStyle(2, 0xffffff, 0.7);
    circle.setInteractive({ useHandCursor: true });
    circle.driftAngle = Math.random() * Math.PI * 2;
    circle.radius = radius;

    circle.on('pointerdown', () => pop(circle));
    bubbles.push(circle);
  }

  function pop(circle) {
    const index = bubbles.indexOf(circle);
    if (index === -1) return;
    bubbles.splice(index, 1);
    scene.tweens.add({
      targets: circle,
      scale: 1.6,
      alpha: 0,
      duration: 180,
      onComplete: () => {
        circle.destroy();
        scene.time.delayedCall(randRange(RESPAWN_DELAY_RANGE), spawnBubble);
      },
    });
  }

  for (let i = 0; i < BUBBLE_COUNT; i++) spawnBubble();

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
