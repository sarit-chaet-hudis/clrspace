// Ambient Sound (mute/unmute, default muted) and the color-temperature Toggle.
// Both are plain DOM controls (Notes in map.md: Space-wide controls, not Spots).

import { getAudioContext, isMuted, setMuted } from './audio.js';
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
  let gainNode = null;
  let started = false;
  button.textContent = 'sound: off';

  function start() {
    const ctx = getAudioContext();
    gainNode = ctx.createGain();
    gainNode.gain.value = 0.05;
    gainNode.connect(ctx.destination);

    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 110;

    // Slow LFO on frequency for a gentle, non-static drone.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 6;
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);

    oscillator.connect(gainNode);
    oscillator.start();
    lfo.start();
    started = true;
  }

  button.addEventListener('click', () => {
    if (!started) start();
    const nextMuted = !isMuted();
    setMuted(nextMuted);
    gainNode.gain.setTargetAtTime(nextMuted ? 0 : 0.05, getAudioContext().currentTime, 0.1);
    button.textContent = nextMuted ? 'sound: off' : 'sound: on';
  });
}
