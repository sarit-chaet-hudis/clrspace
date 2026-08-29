# Use Phaser for rendering and interaction, not raw Canvas 2D

Status: accepted

Research (`.scratch/clrspace-mvp/research/tech-stack-findings.md`) initially recommended plain Canvas 2D over Phaser, mainly because Phaser's DOM-text interop (needed for Scribble Spots) was undocumented/untested, and its game-engine feature set looked like overkill for MVP scope. We reconsidered: clrspace's better long-term mental model is a "game scape," and we specifically want physics (used for travel/animation between Spots, not just Consumption Spot minigames), a sprite/animation system, and collision handling in minigames — capabilities Phaser ships tested and ready, that raw Canvas 2D would require building from scratch. Phaser is built on Canvas 2D/WebGL, so it doesn't unlock anything Canvas fundamentally couldn't do; the trade-off is dev-speed and tested behavior vs. total manual control, not a capability ceiling.

## Considered Options

- **Canvas 2D API** (research's original recommendation): no framework overhead, but physics/sprites/collision would all be hand-built.
- **PixiJS**: rejected — no pixel-art-specific support, no DOM interop.
- **p5.js**: rejected — best DOM interop of the canvas-based options, but no game-engine features (physics, scenes); would still mean hand-building the game-scape mechanics.
- **DOM/CSS-only**: rejected — insufficient for real-time minigames.

## Consequences

- Spots are modelled as regions within **one continuous Phaser World scene with camera-based travel**, not one Phaser scene per Spot — chosen so the rest of the Space stays visible/spatially implied while visiting a Spot, rather than feeling like a fullscreen scene swap. Additional scenes may still run in parallel for persistent UI overlays (e.g. mute/color-temperature toggles).
- Scribble Spots (real, selectable DOM `<input>`/`<textarea>` elements) must be layered over the Phaser canvas — this is the one real, unverified risk of this choice, and is being de-risked via a dedicated spike ticket before `07-build-mvp-base` starts.
