// Shared color-temperature state so mechanics (e.g. bubble-burster) can
// pick temp-appropriate palettes, not just ride the CSS filter passively.

let current = 'neutral';
const listeners = [];

export function getColorTemp() {
  return current;
}

export function setColorTemp(value) {
  current = value;
  for (const fn of listeners) fn(value);
}

export function onColorTempChange(fn) {
  listeners.push(fn);
}
