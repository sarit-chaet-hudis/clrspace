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

## Notes

- Domain vocabulary: `CONTEXT.md` (Space, Spot, Scribble Spot, Consumption Spot, Mechanic, Toggle, Ambient Sound, Session)
- **Exception to "plan, don't do":** the `build-mvp-base` ticket carries real execution (building the base Space), because the persistence ticket can't be judged until it's been lived with. Every other ticket stays planning-only.
- When resolving a `grilling`-type ticket below, call the Skill tool for `grilling` (and `domain-modeling` if new vocabulary shows up).

## Decisions so far

- [What web tech fits an MVP...](.scratch/clrspace-mvp/issues/01-research-tech-stack.md): Canvas 2D API + DOM overlay for pixel-perfect rendering with selectable text Spots

## Not yet specified

- Anything downstream of tech-stack choice (build tooling, deployment target, file/module layout) — will follow naturally once `pick-tech-stack` resolves.
- Fine visual grammar for Scribble Spot variety (which fonts/frames, how many is "several") — expected to graduate out of `spot-layout` once that ticket resolves.

## Out of scope

- Canvas/drawing tool, color-picker tool as expression tools (only Scribble Spot is in for this MVP)
- Video capture/export; any export mechanism beyond selectable text
- A rule-based sound-generation system beyond the single Ambient Sound loop
- Sharing, multi-user, accounts
