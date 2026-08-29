// Ambient Sound (mute/unmute, default muted) and the color-temperature Toggle.
// Both are plain DOM controls (Notes in map.md: Space-wide controls, not Spots).

const COLOR_TEMPS = [
  { label: 'neutral', filter: 'none' },
  { label: 'warm', filter: 'sepia(0.35) saturate(1.4) hue-rotate(-8deg)' },
  { label: 'cool', filter: 'hue-rotate(150deg) saturate(1.2) brightness(1.05)' },
];

export function setupColorTemperatureToggle({ container, button }) {
  let index = 0;
  button.textContent = `temp: ${COLOR_TEMPS[index].label}`;
  button.addEventListener('click', () => {
    index = (index + 1) % COLOR_TEMPS.length;
    container.style.filter = COLOR_TEMPS[index].filter;
    button.textContent = `temp: ${COLOR_TEMPS[index].label}`;
  });
}

export function setupAmbientSound({ button }) {
  let audioContext = null;
  let gainNode = null;
  let oscillator = null;
  let lfo = null;
  let muted = true;
  button.textContent = 'sound: off';

  function start() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.05;
    gainNode.connect(audioContext.destination);

    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 110;

    // Slow LFO on frequency for a gentle, non-static drone.
    lfo = audioContext.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 6;
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);

    oscillator.connect(gainNode);
    oscillator.start();
    lfo.start();
  }

  button.addEventListener('click', () => {
    if (!audioContext) start();
    if (audioContext.state === 'suspended') audioContext.resume();

    muted = !muted;
    gainNode.gain.setTargetAtTime(muted ? 0 : 0.05, audioContext.currentTime, 0.1);
    button.textContent = muted ? 'sound: off' : 'sound: on';
  });
}
