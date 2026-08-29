import Phaser from 'phaser';
import { getColorTemp } from '../colorTempState.js';
import { playMatch, playMismatch, playClear } from '../audio.js';

// Consumption Mechanic prototype (ticket 05): memory-match.
// Deliberately different in kind from bubble-burster (04) — turn-based
// matching against a hidden pattern, not real-time physical popping.
// 3 pairs of hidden tiles; reveal two, keep them if they match, flip them
// back if not. Clearing all 3 pairs celebrates and reshuffles a fresh set.

// TUNABLES — fine-tune later, not decided now:
const COLS = 3;
const ROWS = 2;
const TILE_SIZE = 34;
const GAP = 8;
const MISMATCH_FLIP_BACK_DELAY = 700;
const MATCH_CLEAR_DELAY = 350;
const FULL_CLEAR_RESHUFFLE_DELAY = 4000;
// Not yet decided (fog, not this ticket): grid size (more pairs = harder),
// a timer/streak scoring, what "success" means beyond a full clear, easter eggs.

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

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createMemoryMatch(scene, spot) {
  const totalWidth = COLS * TILE_SIZE + (COLS - 1) * GAP;
  const totalHeight = ROWS * TILE_SIZE + (ROWS - 1) * GAP;
  const startX = spot.x - totalWidth / 2 + TILE_SIZE / 2;
  const startY = spot.y - totalHeight / 2 + TILE_SIZE / 2;

  let tiles = [];
  let selected = [];
  let inputLocked = false;
  let matchedCount = 0;

  function buildBoard() {
    const pairCount = (COLS * ROWS) / 2;
    const values = shuffle([...Array(pairCount).keys(), ...Array(pairCount).keys()]);
    const colors = Array.from({ length: pairCount }, () => colorFor(getColorTemp()));

    tiles = values.map((value, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = startX + col * (TILE_SIZE + GAP);
      const y = startY + row * (TILE_SIZE + GAP);

      const rect = scene.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x1a1a2e, 0.9);
      rect.setStrokeStyle(2, 0x5a5a7a, 0.8);
      rect.setInteractive({ useHandCursor: true });

      const tile = { rect, value, color: colors[value], revealed: false, matched: false };
      rect.on('pointerdown', () => selectTile(tile));
      return tile;
    });

    matchedCount = 0;
    selected = [];
    inputLocked = false;
  }

  function reveal(tile) {
    tile.revealed = true;
    tile.rect.setFillStyle(tile.color, 0.85);
  }

  function hide(tile) {
    tile.revealed = false;
    tile.rect.setFillStyle(0x1a1a2e, 0.9);
  }

  function selectTile(tile) {
    if (inputLocked || tile.revealed || tile.matched) return;
    reveal(tile);
    selected.push(tile);
    if (selected.length < 2) return;

    inputLocked = true;
    const [a, b] = selected;
    if (a.value === b.value) {
      playMatch();
      scene.time.delayedCall(MATCH_CLEAR_DELAY, () => {
        a.matched = true;
        b.matched = true;
        a.rect.setAlpha(0.15);
        b.rect.setAlpha(0.15);
        selected = [];
        inputLocked = false;
        matchedCount++;
        if (matchedCount === tiles.length / 2) {
          celebrateClear();
        }
      });
    } else {
      playMismatch();
      scene.time.delayedCall(MISMATCH_FLIP_BACK_DELAY, () => {
        hide(a);
        hide(b);
        selected = [];
        inputLocked = false;
      });
    }
  }

  function celebrateClear() {
    playClear();
    inputLocked = true;
    const burst = scene.add.text(spot.x, spot.y, 'matched!', {
      fontFamily: 'monospace',
      fontSize: '16px',
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

    scene.time.delayedCall(FULL_CLEAR_RESHUFFLE_DELAY, () => {
      for (const tile of tiles) tile.rect.destroy();
      buildBoard();
    });
  }

  buildBoard();

  function update() {
    // No per-frame motion — matching is turn-based, unlike bubble-burster's drift.
  }

  return { update };
}
