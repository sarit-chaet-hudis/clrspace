Type: prototype
Status: resolved

## Question

What should the third Consumption Spot's Mechanic be, concretely? Build a cheap, rough version to react to. Must end up genuinely different from whatever tickets 04 and 05 land on.

## Progress

Built gravity-toy in `consumption-3`'s Spot: click inside the Spot to drop a ball; balls fall under gravity, bounce off the Spot's walls, and collide with each other (custom manual physics — position/velocity + collision resolution, not Phaser's Arcade plugin, to stay consistent with the rest of the codebase's manual per-frame style). Capped at 8 balls — dropping a 9th fades out the oldest. First Mechanic to actually use physics (gravity + collision), which the "game scape" direction (ADR-0001) wanted but neither bubble-burster nor memory-match used. Deliberately has **no win condition** — unlike the other two, it's a pure toy to poke at, not a clear-and-reshuffle cycle, for variety. Ball hue matches the color-temperature toggle, consistent with the other two Mechanics. A quiet "clink" sound plays on ball-ball collisions (throttled to avoid noise-spam). Verified drop, wall-bounce, inter-ball collision, and the 8-ball cap all work via Playwright. Code: `src/mechanics/gravityToy.js`.

Tunable knobs deliberately left open for later (see `TUNABLES` comment block): resting friction/settling behavior (balls keep a little bounce forever rather than settling fully still), whether this needs any win condition at all or should stay a pure toy, the same card/ball-count-vs-color-count follow-up flagged on ticket 05, easter eggs.

## Answer

**Gravity-toy**, locked in as `consumption-3`'s Mechanic — a pure physics toy with no win condition, deliberately distinct from bubble-burster (04) and memory-match (05).
