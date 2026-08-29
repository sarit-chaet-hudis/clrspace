// Parallax starfield + nebula. Uses Phaser's native scrollFactor (not a
// custom system) — each layer moves at a fraction of the camera's scroll,
// giving depth. Colors shift automatically with the color-temperature
// toggle, since that applies a CSS filter to the whole canvas container.

const STAR_LAYERS = [
  { scrollFactor: 0.12, count: 220, sizeRange: [1, 1.5], colors: [0x334466, 0x445577], alpha: 0.6 },
  { scrollFactor: 0.30, count: 160, sizeRange: [1, 2], colors: [0x88aadd, 0xaaccff, 0xffffff], alpha: 0.8 },
  { scrollFactor: 0.55, count: 90, sizeRange: [1.5, 3], colors: [0xffffff, 0xffe9c4, 0xbdd7ff], alpha: 0.9 },
];

const NEBULA = {
  scrollFactor: 0.05,
  centerX: 1800,
  centerY: 300,
  radius: 520,
  count: 260,
  colors: [0xaa66cc, 0xcc77ee, 0x8855bb, 0x9966dd],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randRange([min, max]) {
  return min + Math.random() * (max - min);
}

export function createParallaxBackground(scene, { worldWidth, worldHeight }) {
  const margin = 1200; // buffer so low-scrollFactor layers never run out of dots at world edges

  // Nebula first (deepest, lowest scrollFactor, drawn behind everything else).
  const nebulaGfx = scene.add.graphics();
  for (let i = 0; i < NEBULA.count; i++) {
    // Points cluster toward the center (sqrt bias) with alpha fading toward the edge — a soft edge, not a hard circle.
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * NEBULA.radius;
    const x = NEBULA.centerX + Math.cos(angle) * dist;
    const y = NEBULA.centerY + Math.sin(angle) * dist;
    const edgeFalloff = 1 - dist / NEBULA.radius;
    const alpha = Math.max(0, edgeFalloff) * randRange([0.15, 0.4]);
    nebulaGfx.fillStyle(pick(NEBULA.colors), alpha);
    nebulaGfx.fillCircle(x, y, randRange([2, 5]));
  }
  nebulaGfx.setScrollFactor(NEBULA.scrollFactor);

  // Star layers, far to near.
  for (const layer of STAR_LAYERS) {
    const gfx = scene.add.graphics();
    for (let i = 0; i < layer.count; i++) {
      const x = -margin + Math.random() * (worldWidth + margin * 2);
      const y = -margin + Math.random() * (worldHeight + margin * 2);
      gfx.fillStyle(pick(layer.colors), layer.alpha);
      gfx.fillCircle(x, y, randRange(layer.sizeRange));
    }
    gfx.setScrollFactor(layer.scrollFactor);
  }
}
