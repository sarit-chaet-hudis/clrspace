Type: prototype
Status: resolved

## Question

What should the first Consumption Spot's Mechanic be, concretely? Build a cheap, rough version (candidates floated: bubble-burster, a small pattern-matching puzzle) to react to, rather than deciding from description alone. Must end up genuinely different from whatever tickets 05 and 06 land on.

## Progress

Built bubble-burster in `consumption-1`'s Spot: colored bubbles drift within its bounds, popping (scale+fade) on click. Verdict so far: **"overall good"**, with a feedback round already applied:
- Bubble hue now matches the color-temperature toggle (warm/cool/neutral bands), not just the passive CSS filter
- Popping one bubble respawns it quickly; popping *all* of them triggers a "nice!" celebration + chime, then a 7s pause before a fresh batch arrives together
- Synthesized pop/clear sounds (Web Audio, `src/audio.js`), sharing state with Ambient Sound's mute toggle
- Drift speed tuned: 0.3 → 0.9 → settled at 0.5

Tunable knobs deliberately left open for later (see `TUNABLES` comment block in `src/mechanics/bubbleBurster.js`): overall Spot/game size, bubble count, what "success" means beyond a full clear, easter eggs.

## Answer

**Bubble-burster**, locked in as `consumption-1`'s Mechanic. Confirmed working and feeling right after a feedback round (temp-matched colors, pop/clear sound, two-tier respawn pacing, drift speed settled at 0.5).
