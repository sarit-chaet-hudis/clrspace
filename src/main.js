import Phaser from 'phaser';
import { WORLD_WIDTH, WORLD_HEIGHT, scribbleSpots, consumptionSpots, SPOT_SIZE } from './spots.js';
import { createScribbleOverlay } from './scribbleOverlay.js';
import { setupColorTemperatureToggle, setupAmbientSound } from './ui.js';

const container = document.getElementById('clrspace-container');

// Camera travel: continuous free-roam pan (arrow keys), speed eases toward a
// target rather than snapping instantly or carrying full inertia (ticket 03).
const MAX_SPEED = 4;
const ACCEL = 0.15;

class WorldScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.centerOn(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    this.cameras.main.roundPixels = true;

    this.drawBackground();
    this.drawConsumptionSpots();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.velocity = { x: 0, y: 0 };

    this.scribbleOverlay = createScribbleOverlay({
      container,
      scene: this,
      spots: scribbleSpots,
      spotSize: SPOT_SIZE,
    });
  }

  drawBackground() {
    const g = this.add.graphics();
    const tile = 80;
    g.lineStyle(1, 0x2a2a3a, 1);
    for (let x = 0; x <= WORLD_WIDTH; x += tile) g.lineBetween(x, 0, x, WORLD_HEIGHT);
    for (let y = 0; y <= WORLD_HEIGHT; y += tile) g.lineBetween(0, y, WORLD_WIDTH, y);
  }

  drawConsumptionSpots() {
    for (const spot of consumptionSpots) {
      const g = this.add.graphics();
      g.fillStyle(0x3a2a5a, 0.7);
      g.fillRoundedRect(spot.x - SPOT_SIZE / 2, spot.y - SPOT_SIZE / 2, SPOT_SIZE, SPOT_SIZE, 12);
      g.lineStyle(3, 0xb388ff, 1);
      g.strokeRoundedRect(spot.x - SPOT_SIZE / 2, spot.y - SPOT_SIZE / 2, SPOT_SIZE, SPOT_SIZE, 12);

      const text = this.add.text(spot.x, spot.y, spot.label, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#e0d4ff',
        align: 'center',
        wordWrap: { width: SPOT_SIZE - 20 },
      }).setOrigin(0.5);

      const hitZone = this.add.zone(spot.x, spot.y, SPOT_SIZE, SPOT_SIZE).setInteractive();
      hitZone.on('pointerdown', () => {
        console.log(`Consumption Spot "${spot.id}" clicked — ${spot.label}`);
      });
    }
  }

  update() {
    const target = { x: 0, y: 0 };
    if (this.cursors.left.isDown) target.x = -MAX_SPEED;
    if (this.cursors.right.isDown) target.x = MAX_SPEED;
    if (this.cursors.up.isDown) target.y = -MAX_SPEED;
    if (this.cursors.down.isDown) target.y = MAX_SPEED;

    this.velocity.x += (target.x - this.velocity.x) * ACCEL;
    this.velocity.y += (target.y - this.velocity.y) * ACCEL;

    this.cameras.main.scrollX += this.velocity.x;
    this.cameras.main.scrollY += this.velocity.y;

    this.scribbleOverlay.update(this.cameras.main);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'clrspace-container',
  backgroundColor: '#0b0b12',
  scene: WorldScene,
});

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

setupColorTemperatureToggle({ container, button: document.getElementById('color-toggle') });
setupAmbientSound({ button: document.getElementById('mute-toggle') });
