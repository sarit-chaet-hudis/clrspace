// Shared AudioContext + mute state, so Ambient Sound and one-off SFX
// (bubble pops, etc.) don't each manage their own context.

let audioContext = null;
let muted = true;

export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
}

// A short percussive "pop" — sine oscillator with a fast pitch drop and decay.
export function playPop() {
  if (muted) return;
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(700, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}

// A short rising two-note chime — positive reinforcement for clearing a Consumption Mechanic.
export function playClear() {
  if (muted) return;
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  [523, 784].forEach((freq, i) => {
    const start = now + i * 0.09;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.3);
  });
}
