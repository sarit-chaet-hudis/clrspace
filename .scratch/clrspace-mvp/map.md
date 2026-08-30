# Map: clrspace-mvp

## Destination

A built, feelable MVP-sized first slice of clrspace — small enough to start building next session, true enough to index.md's vision to tell you whether the "headspace" actually works.

## Settled MVP scope

(Locked via grilling before this map was charted — not tickets, just the spec every ticket below builds on. See `CONTEXT.md` for the vocabulary used here.)

- Web app, personal use, no auth/accounts
- A Space made of a small, hand-placed (not procedural) set of Spots, moved between via arrow-keys/scroll, deliberately slow movement for a low-res pixel feel
- Several Scribble Spots, each visually distinct (font, size, frame) — plain selectable text is the entire "export" story, no button needed
- 3 Consumption Spots, each with a genuinely different Mechanic (candidates floated: mini puzzle, bubble-burster) — exact Mechanic per Spot is open (see tickets)
- One Toggle: color temperature (heat/coolness of the Space's colors)
- Ambient Sound: one looping background track + mute/unmute control, defaulting to muted
- No persistence across Sessions is *assumed* for MVP, but this is explicitly re-opened as a ticket below — you asked to decide it from lived experience, not upfront
- Rendering/engine: **Phaser**, as one continuous World scene with camera-based travel between Spots — see `docs/adr/0001-phaser-for-rendering.md`. clrspace is now understood as a "game scape": physics (including travel/animation between Spots), sprites, and collisions in Consumption Mechanics are all in scope going forward, not just MVP-minimal rendering.

## Notes

- Domain vocabulary: `CONTEXT.md` (Space, Spot, Scribble Spot, Consumption Spot, Mechanic, Toggle, Ambient Sound, Session)
- Architecture decisions: `docs/adr/` (currently: `0001-phaser-for-rendering.md`)
- **Exception to "plan, don't do":** the `build-mvp-base` ticket carries real execution (building the base Space), because the persistence ticket can't be judged until it's been lived with. Every other ticket stays planning-only.
- When resolving a `grilling`-type ticket below, call the Skill tool for `grilling` (and `domain-modeling` if new vocabulary shows up).

## Decisions so far

- [What web tech fits an MVP...](.scratch/clrspace-mvp/issues/01-research-tech-stack.md): researched Canvas 2D API + DOM overlay as the fit (superseded by ticket 02)
- [Which rendering approach + libraries should clrspace's MVP actually use?](.scratch/clrspace-mvp/issues/02-pick-tech-stack.md): **Phaser**, overriding the research recommendation — clrspace's better long-term model is a "game scape" (physics/sprites/collisions), one continuous World scene with camera travel between Spots. See ADR-0001.
- [What's the exact hand-placed layout of the Space for MVP?](.scratch/clrspace-mvp/issues/03-spot-layout.md): 5 Scribble Spots + 3 Consumption Spots, loose scatter, hard edges, Scribble Spot style randomized once per Spot from a curated set (exact fonts TBD), camera eases/tweens between Spots.
- [Does a real DOM input coexist cleanly overlaid on a Phaser scene?](.scratch/clrspace-mvp/issues/09-spike-phaser-dom-text.md): Yes, verified live — coordinate tracking is clean; two fixable gotchas found (Phaser's default key capture eats keystrokes like Space unless disabled while a Scribble Spot is focused; clicking the canvas doesn't auto-blur a focused input, needs an explicit blur call). Neither reopens ADR-0001.
- [What should Consumption Spot 1's Mechanic be?](.scratch/clrspace-mvp/issues/04-consumption-mechanic-1.md): **Bubble-burster** — bubbles drift and pop on click, hue matches the color-temperature toggle, popping one respawns it quickly but popping all triggers a celebration + 7s pause before a fresh batch. Drift speed settled at 0.5.
- [What should Consumption Spot 2's Mechanic be?](.scratch/clrspace-mvp/issues/05-consumption-mechanic-2.md): **Memory-match** — 4x4/8-pair grid (bumped up after 3x2 played too easy), reveal-two-tiles turn-based matching, a mid-board tile swap once half the pairs clear. Color-distinctness-vs-card-count flagged as a follow-up, not blocking.
- [What should Consumption Spot 3's Mechanic be?](.scratch/clrspace-mvp/issues/06-consumption-mechanic-3.md): **Gravity-toy** — click to drop a ball, gravity + wall/ball collision (manual physics, capped at 8 balls), deliberately no win condition, unlike the other two. First Mechanic to actually use physics. All 3 Consumption Mechanics are now resolved.

## Not yet specified

- Anything downstream of the Phaser choice not yet pinned (build tooling/bundler, deployment target, file/module layout) — will follow naturally once `build-mvp-base` starts.
- Exact font/size/frame assets for the Scribble Spot style palette — deferred to `build-mvp-base`, a hands-on asset choice rather than an abstract one.
- A locked relationship between card/bubble count and color count for Consumption Mechanics, so colors stay distinguishable as counts scale (surfaced by memory-match's 4x4 bump; applies to bubble-burster and gravity-toy too).
- Gravity-toy's resting friction/settling behavior, and whether it should ever get a win condition.

## Out of scope

- Canvas/drawing tool, color-picker tool as expression tools (only Scribble Spot is in for this MVP)
- Video capture/export; any export mechanism beyond selectable text
- A rule-based sound-generation system beyond the single Ambient Sound loop
- Sharing, multi-user, accounts
