import Phaser from 'phaser';
import { getColorTemp } from '../colorTempState.js';
import { playMatch, playMismatch, playSwap, playClear } from '../audio.js';

// Consumption Mechanic prototype (ticket 05): memory-match.
// Deliberately different in kind from bubble-burster (04) — turn-based
// matching against a hidden pattern, not real-time physical popping.
// 8 pairs of hidden tiles; reveal two, keep them if they match, flip them
// back if not. Once half the pairs are cleared, two remaining hidden tiles
// visibly swap places once, to break rote memorization. Clearing the board
// celebrates and reshuffles a fresh set.

// TUNABLES — fine-tune later, not decided now:
const COLS = 4;
const ROWS = 4; // 4x4 minimum — 3x2 played too easy
const TILE_SIZE = 28;
const GAP = 4;
const MISMATCH_FLIP_BACK_DELAY = 700;
const MATCH_CLEAR_DELAY = 350;
const FULL_CLEAR_RESHUFFLE_DELAY = 4000;
const SWAP_TWEEN_DURATION = 450;
// Not yet decided (fog, not this ticket): grid size beyond this 4x4 floor,
// a timer/streak scoring, what "success" means beyond a full clear, easter
// eggs, whether more than one swap should happen on larger boards, and a
// locked relationship between card count and color count — hue is
// currently just randomized within a temp band regardless of pair count,
// so at 8+ pairs some colors can end up too close to tell apart; needs an
// explicit minimum-hue-separation rule tied to pairCount.

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
  let halfSwapTriggered = false;

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
    halfSwapTriggered = false;
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
        } else if (!halfSwapTriggered && matchedCount === Math.floor(tiles.length / 4)) {
          halfSwapTriggered = true;
          triggerSwap();
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

  function triggerSwap() {
    const candidates = tiles.filter((t) => !t.matched && !t.revealed);
    if (candidates.length < 2) return;
    const i = Math.floor(Math.random() * candidates.length);
    let j = Math.floor(Math.random() * candidates.length);
    while (j === i) j = Math.floor(Math.random() * candidates.length);
    const tileA = candidates[i];
    const tileB = candidates[j];

    playSwap();
    const ax = tileA.rect.x;
    const ay = tileA.rect.y;
    const bx = tileB.rect.x;
    const by = tileB.rect.y;
    // Values/colors stay attached to their own rect, so physically swapping
    // screen position also swaps which pair-value lives at each grid slot.
    scene.tweens.add({ targets: tileA.rect, x: bx, y: by, duration: SWAP_TWEEN_DURATION, ease: 'Cubic.easeInOut' });
    scene.tweens.add({ targets: tileB.rect, x: ax, y: ay, duration: SWAP_TWEEN_DURATION, ease: 'Cubic.easeInOut' });
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
