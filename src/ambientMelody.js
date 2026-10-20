import { getAudioContext } from './audio.js';
import { getColorTemp } from './colorTempState.js';

const SCALES = {
  cool: [0, 2, 3, 5, 7, 9, 10],
  neutral: [0, 2, 4, 5, 7, 9, 11],
  warm: [0, 2, 4, 6, 7, 9, 11],
};

const BPM = 52;
const BEAT = 60 / BPM;
const BAR = BEAT * 2;
const LOOKAHEAD = 0.5;
const TICK_MS = 120;
const MASTER_LEVEL = 0.6;

const D3 = 146.83;
const D4 = 293.66;
const D5 = 587.33;

const BASS_DEGREES = [0, 4, 5, 2, 3, 0, 3, 4];
const MELODY_DEGREES = [2, 1, 0, -1, -2, -3, -2, -1];

function degreeFreq(root, scale, degree) {
  const octave = Math.floor(degree / 7);
  const index = ((degree % 7) + 7) % 7;
  return root * 2 ** ((scale[index] + 12 * octave) / 12);
}

function buildOutput(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0;

  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 1800;

  const delay = ctx.createDelay(1);
  delay.delayTime.value = BEAT * 0.75;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.35;
  const echoTone = ctx.createBiquadFilter();
  echoTone.type = 'lowpass';
  echoTone.frequency.value = 1200;

  tone.connect(master);
  tone.connect(delay);
  delay.connect(echoTone);
  echoTone.connect(feedback);
  feedback.connect(delay);
  echoTone.connect(master);
  master.connect(ctx.destination);

  return { master, input: tone };
}

function playNote(ctx, destination, { freq, start, duration, type, peak, attack }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

export function createAmbientMelody() {
  let output = null;
  let timer = null;
  let nextBarTime = 0;
  let barIndex = 0;

  function scheduleBar(ctx, start) {
    const scale = SCALES[getColorTemp()] || SCALES.neutral;
    const step = barIndex % BASS_DEGREES.length;
    const pass = Math.floor(barIndex / BASS_DEGREES.length) % 3;
    const bass = BASS_DEGREES[step];
    const dest = output.input;

    playNote(ctx, dest, {
      freq: degreeFreq(D3, scale, bass),
      start,
      duration: BAR * 1.1,
      type: 'sine',
      peak: 0.22,
      attack: 0.12,
    });

    [0, 2, 4].forEach((offset) => {
      playNote(ctx, dest, {
        freq: degreeFreq(D4, scale, bass + offset),
        start,
        duration: BAR * 1.15,
        type: 'sine',
        peak: 0.05,
        attack: 0.4,
      });
    });

    const melody = MELODY_DEGREES[step];
    const octaveShift = pass === 2 ? 7 : 0;
    for (let beat = 0; beat < 2; beat++) {
      const degree = melody + octaveShift;
      const beatStart = start + beat * BEAT;
      if (pass === 1) {
        [degree, degree - 1].forEach((d, i) => {
          playNote(ctx, dest, {
            freq: degreeFreq(D5, scale, d),
            start: beatStart + i * (BEAT / 2),
            duration: BEAT * 0.9,
            type: 'triangle',
            peak: 0.1,
            attack: 0.03,
          });
        });
      } else {
        playNote(ctx, dest, {
          freq: degreeFreq(D5, scale, degree),
          start: beatStart,
          duration: BEAT * 1.6,
          type: 'triangle',
          peak: 0.11,
          attack: 0.05,
        });
      }
    }
  }

  function tick() {
    const ctx = getAudioContext();
    while (nextBarTime < ctx.currentTime + LOOKAHEAD) {
      scheduleBar(ctx, nextBarTime);
      nextBarTime += BAR;
      barIndex += 1;
    }
  }

  function setPlaying(playing) {
    const ctx = getAudioContext();
    if (!output) output = buildOutput(ctx);
    output.master.gain.setTargetAtTime(playing ? MASTER_LEVEL : 0, ctx.currentTime, 0.15);

    if (playing && !timer) {
      nextBarTime = ctx.currentTime + 0.1;
      tick();
      timer = setInterval(tick, TICK_MS);
    } else if (!playing && timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  return { setPlaying };
}
