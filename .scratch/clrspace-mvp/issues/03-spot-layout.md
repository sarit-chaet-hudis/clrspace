Type: grilling
Status: resolved

## Question

What's the exact hand-placed layout of the Space for MVP? Specifically: how many Scribble Spots (settled as "several," not yet a number), how the 3 Consumption Spots and the Scribble Spots are arranged relative to each other (grid, loose scatter, a path), whether the Space has hard edges or wraps/loops, and what makes each Scribble Spot "visually distinct" concretely (which fonts/sizes/frames, how many variants).

Settled context from ticket 02 (ADR-0001): all Spots live as regions within **one continuous Phaser World scene**, travelled between via camera movement — not one Phaser scene per Spot. This ticket decides spatial arrangement *within* that single continuous world, not scene boundaries.

## Answer

- **5 Scribble Spots** + the 3 Consumption Spots = 8 Spots total for MVP.
- **Loose scatter** arrangement — irregular positions, not a grid or fixed path, matching index.md's "infinity... discover more" framing.
- **Hard edges** — the Space is bounded, not wraparound/looping (wrapping needs seamless-tiling design work, deferred).
- **Scribble Spot visual variety**: each of the 5 gets a style **randomized once from a small curated set** (font, size range, frame treatment) — stable/consistent per Spot across visits, not reshuffled each Session. Exact fonts/frame assets are left open, to be picked hands-on during `07-build-mvp-base` rather than abstractly now.
- **Camera travel**: eases/tweens smoothly between Spots (not an instant snap, not full physical inertia/momentum) — matches the already-settled "slow movement, low-res pixel feel" without the extra build cost of a momentum system.
