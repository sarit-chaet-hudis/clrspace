// Ambient Sound and Sound Effects (separate mute/unmute, both default muted)
// and the color-temperature Toggle. All are plain DOM controls (Notes in map.md: Space-wide controls, not Spots).

import { isSfxMuted, setSfxMuted } from './audio.js';
import { createAmbientMelody } from './ambientMelody.js';
import { setColorTemp } from './colorTempState.js';

const COLOR_TEMPS = [
  { label: 'neutral', filter: 'none' },
  { label: 'warm', filter: 'sepia(0.35) saturate(1.4) hue-rotate(-8deg)' },
  // No hue-rotate here: the rest of the palette (grid, borders, stars) is
  // already cool-leaning by default, and a big rotate would fight the
  // explicit cool-hue selection bubble-burster (and future mechanics) use.
  { label: 'cool', filter: 'saturate(1.3) brightness(1.08) contrast(1.05)' },
];

export function setupColorTemperatureToggle({ container, button }) {
  let index = 0;
  button.textContent = `temp: ${COLOR_TEMPS[index].label}`;
  setColorTemp(COLOR_TEMPS[index].label);
  button.addEventListener('click', () => {
    index = (index + 1) % COLOR_TEMPS.length;
    container.style.filter = COLOR_TEMPS[index].filter;
    button.textContent = `temp: ${COLOR_TEMPS[index].label}`;
    setColorTemp(COLOR_TEMPS[index].label);
  });
}

export function setupAmbientSound({ button }) {
  const melody = createAmbientMelody();
  let playing = false;
  button.textContent = 'music: off';

  button.addEventListener('click', () => {
    playing = !playing;
    melody.setPlaying(playing);
    button.textContent = playing ? 'music: on' : 'music: off';
  });
}

export function setupSoundEffects({ button }) {
  button.textContent = 'sfx: off';

  button.addEventListener('click', () => {
    const nextMuted = !isSfxMuted();
    setSfxMuted(nextMuted);
    button.textContent = nextMuted ? 'sfx: off' : 'sfx: on';
  });
}
