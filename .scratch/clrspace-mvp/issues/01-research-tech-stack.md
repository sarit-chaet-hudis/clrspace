Type: research
Status: resolved

## Question

What web tech (rendering approach + libraries) fits an MVP that needs: a small hand-placed 2D Space navigated via slow arrow-key/scroll movement with a deliberate low-res pixel feel, several visually-distinct text-entry Scribble Spots (real DOM text, needs to stay selectable), and 3 Consumption Spots each running a small, different minigame Mechanic (candidates so far: bubble-burster, pattern-matching puzzle)?

Survey candidates (at least): plain Canvas 2D API, PixiJS, Phaser, p5.js, or a DOM/CSS-only approach (no canvas at all). For each, note: fit for pixel-art low-res rendering, fit for mixing real selectable DOM text (Scribble Spots) with a canvas/game layer (Consumption Spots), and rough learning-curve/setup cost for a solo personal project.

No prior tech-stack discussion has happened yet — this is greenfield.

## Answer

**Recommendation: Canvas 2D API + DOM Overlay**

Canvas 2D offers native pixel-perfect rendering via `imageSmoothingEnabled = false`, critical for the low-res pixel-art feel. DOM text inputs overlay cleanly above the canvas, keeping Scribble Spots selectable. No framework overhead, no bloat, full architectural control. Setup is moderate (need an animation loop), but trade-offs favor pixel-art fidelity and DOM interop over framework convenience.

**Alternative:** p5.js if learning curve is prioritized over pixel-art optimization.

**Not recommended:** Phaser (overkill), PixiJS (poor pixel-art fit), DOM/CSS-only (insufficient for minigames).

Full findings and detailed trade-offs: [tech-stack-findings.md](../research/tech-stack-findings.md)
