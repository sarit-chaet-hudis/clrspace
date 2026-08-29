Type: prototype
Status: claimed

## Question

What should the first Consumption Spot's Mechanic be, concretely? Build a cheap, rough version (candidates floated: bubble-burster, a small pattern-matching puzzle) to react to, rather than deciding from description alone. Must end up genuinely different from whatever tickets 05 and 06 land on.

## Progress

Built bubble-burster in `consumption-1`'s Spot: colored bubbles drift within its bounds, popping (scale+fade) on click. Verdict so far: **"overall good"**, with a feedback round already applied:
- Bubble hue now matches the color-temperature toggle (warm/cool/neutral bands), not just the passive CSS filter
- Popping one bubble respawns it quickly; popping *all* of them triggers a "nice!" celebration + chime, then a 7s pause before a fresh batch arrives together
- Synthesized pop/clear sounds (Web Audio, `src/audio.js`), sharing state with Ambient Sound's mute toggle
- Faster drift (0.3 → 0.9)

Tunable knobs deliberately left open for later (see `TUNABLES` comment block in `src/mechanics/bubbleBurster.js`): overall Spot/game size, bubble count, what "success" means beyond a full clear, easter eggs.

**Not yet resolved** — still a "how should it feel" question (prototype ticket, HITL). Try the latest build and confirm whether this is ready to lock in as `consumption-1`'s Mechanic.
