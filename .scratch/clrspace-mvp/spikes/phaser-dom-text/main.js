// PROTOTYPE, throwaway — ticket 09-spike-phaser-dom-text
// Question: does a real DOM <input>/<textarea> coexist cleanly overlaid on a
// running Phaser scene (no keyboard fighting, no coordinate drift on camera move)?

import Phaser from 'phaser';

const WORLD_SIZE = 3000;
const TILE = 100;
// The Scribble Spot stand-in lives at a fixed WORLD position.
const SPOT_WORLD_X = 1500;
const SPOT_WORLD_Y = 1500;

const statusEl = document.getElementById('status');
const inputEl = document.getElementById('scribble-input');
let arrowsMovedCameraWhileFocused = false;
let cameraMoveCount = 0;

function log(lines) {
  statusEl.textContent = lines.join('\n');
}

class WorldScene extends Phaser.Scene {
  create() {
    const g = this.add.graphics();
    g.lineStyle(1, 0x444444, 1);
    for (let x = 0; x <= WORLD_SIZE; x += TILE) {
      g.lineBetween(x, 0, x, WORLD_SIZE);
    }
    for (let y = 0; y <= WORLD_SIZE; y += TILE) {
      g.lineBetween(0, y, WORLD_SIZE, y);
    }
    // Visible marker at the Scribble Spot's world position, so drift is obvious.
    const marker = this.add.rectangle(SPOT_WORLD_X, SPOT_WORLD_Y, TILE, TILE, 0xff6b6b, 0.3);
    marker.setStrokeStyle(2, 0xff6b6b);

    this.cameras.main.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE);
    this.cameras.main.centerOn(SPOT_WORLD_X - 300, SPOT_WORLD_Y);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 4;

    window.__spike = {
      getCamera: () => ({ scrollX: this.cameras.main.scrollX, scrollY: this.cameras.main.scrollY }),
    };
  }

  update() {
    const activeIsInput = document.activeElement === inputEl;
    const cam = this.cameras.main;

    let moved = false;
    if (!activeIsInput) {
      if (this.cursors.left.isDown) { cam.scrollX -= this.speed; moved = true; }
      if (this.cursors.right.isDown) { cam.scrollX += this.speed; moved = true; }
      if (this.cursors.up.isDown) { cam.scrollY -= this.speed; moved = true; }
      if (this.cursors.down.isDown) { cam.scrollY += this.speed; moved = true; }
    } else if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.down.isDown) {
      // Arrow key was pressed while the textarea had focus — did it still reach Phaser?
      arrowsMovedCameraWhileFocused = true;
    }
    if (moved) cameraMoveCount++;

    // Reposition the overlaid input to track the Scribble Spot's world position
    // as the camera moves — this is the "coordinate drift" check.
    const screenX = SPOT_WORLD_X - cam.scrollX;
    const screenY = SPOT_WORLD_Y - cam.scrollY;
    inputEl.style.left = `${screenX - 80}px`;
    inputEl.style.top = `${screenY - 30}px`;

    log([
      `camera scroll: ${cam.scrollX.toFixed(0)}, ${cam.scrollY.toFixed(0)}`,
      `camera move events so far: ${cameraMoveCount}`,
      `input focused: ${activeIsInput}`,
      `arrow key reached Phaser while input focused (BAD if true): ${arrowsMovedCameraWhileFocused}`,
      `input screen pos: ${screenX.toFixed(0)}, ${screenY.toFixed(0)}`,
    ]);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#111111',
  scene: WorldScene,
});
