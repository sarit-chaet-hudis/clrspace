// Scribble Spots: real DOM textareas overlaid on the Phaser canvas.
// Style is randomized once per Spot from a small curated set (ticket 03),
// stable for the Session (re-randomizes on reload — cross-Session style
// persistence is ticket 08's call, not this one's).
//
// Two gotchas found by ticket 09's spike, handled here:
// - Phaser's default key capture eats keystrokes (e.g. Space) while a
//   Scribble Spot is focused, unless global capture is disabled.
// - Clicking the canvas does not blur a focused Scribble Spot by default.

const FONTS = ['"Courier New", monospace', 'Georgia, serif', '"Comic Sans MS", cursive', '"Trebuchet MS", sans-serif'];
const SIZES = [12, 14, 18, 22];
const FRAMES = [
  { border: '2px dashed #ffb703', background: 'rgba(255,255,255,0.9)', color: '#222' },
  { border: '3px solid #8ecae6', background: 'rgba(20,20,30,0.85)', color: '#f5f5f5' },
  { border: '1px dotted #fb8500', background: 'rgba(255,240,220,0.92)', color: '#222' },
  { border: '4px double #219ebc', background: 'rgba(255,255,255,0.95)', color: '#222' },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createScribbleOverlay({ container, scene, spots, spotSize }) {
  const elements = spots.map((spot) => {
    const el = document.createElement('textarea');
    el.className = 'scribble-input';
    el.placeholder = 'scribble something...';
    el.style.width = `${spotSize}px`;
    el.style.height = `${spotSize * 0.6}px`;
    el.style.fontFamily = pick(FONTS);
    el.style.fontSize = `${pick(SIZES)}px`;
    const frame = pick(FRAMES);
    el.style.border = frame.border;
    el.style.background = frame.background;
    el.style.color = frame.color;

    el.addEventListener('focus', () => {
      scene.input.keyboard.disableGlobalCapture();
    });
    el.addEventListener('blur', () => {
      scene.input.keyboard.enableGlobalCapture();
    });

    container.appendChild(el);
    return { spot, el };
  });

  // Clicking the canvas doesn't blur a focused textarea by default (ticket 09) — force it.
  scene.input.on('pointerdown', () => {
    const active = document.activeElement;
    if (active && active.classList && active.classList.contains('scribble-input')) {
      active.blur();
    }
  });

  function update(camera) {
    for (const { spot, el } of elements) {
      const screenX = spot.x - camera.scrollX;
      const screenY = spot.y - camera.scrollY;
      el.style.left = `${screenX - spotSize / 2}px`;
      el.style.top = `${screenY - (spotSize * 0.6) / 2}px`;
      // Off-screen Spots don't need to render as live inputs.
      const onScreen = screenX > -spotSize && screenX < camera.width + spotSize
        && screenY > -spotSize && screenY < camera.height + spotSize;
      el.style.display = onScreen ? 'block' : 'none';
    }
  }

  return { update };
}
