Type: grilling
Status: resolved
Blocked by: 01

## Question

Given the findings from "What web tech fits an MVP..." (ticket 01), which rendering approach + libraries should clrspace's MVP actually use? Lock the choice: rendering layer for the Space/Consumption Spots, how Scribble Spots' real DOM text coexists with it, and any base tooling (bundler/framework) needed to start a repo.

## Answer

**Phaser**, overriding the research's Canvas 2D recommendation. Reasoning: clrspace's better long-term mental model is a "game scape," and physics (travel/animation between Spots, not just minigames), sprites, and collisions are all wanted — Phaser ships these tested, Canvas 2D would mean hand-building them. Phaser is built on Canvas 2D/WebGL, so this is a dev-speed/tested-behavior trade-off, not a capability ceiling; extensibility for unrelated concerns (auth, backend, integrations) is a non-issue for either option, since neither touches that layer.

Architecture: **one continuous Phaser World scene with camera-based travel** between Spots (not one scene per Spot), so the rest of the Space stays visible while at a Spot. Scribble Spots remain real DOM elements overlaid on the Phaser canvas — this is the one unverified risk, being de-risked by a dedicated spike (ticket 09) before `07-build-mvp-base`.

Full reasoning: [ADR-0001](../../../docs/adr/0001-phaser-for-rendering.md)
