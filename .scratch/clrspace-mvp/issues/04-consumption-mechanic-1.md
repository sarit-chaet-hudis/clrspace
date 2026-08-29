Type: prototype
Status: claimed

## Question

What should the first Consumption Spot's Mechanic be, concretely? Build a cheap, rough version (candidates floated: bubble-burster, a small pattern-matching puzzle) to react to, rather than deciding from description alone. Must end up genuinely different from whatever tickets 05 and 06 land on.

## Progress

Built bubble-burster in `consumption-1`'s Spot: a handful of colored bubbles drift within its bounds, popping (scale+fade) on click and respawning after a short delay. Verified working via Playwright (click → pop → respawn cycle confirmed across multiple bubbles). Code: `src/mechanics/bubbleBurster.js`.

**Not yet resolved** — this is a "how should it feel" question (prototype ticket, HITL), so it needs your actual reaction, not just automated verification that it runs. Try it (run `npm run dev`, pan to the first purple Consumption Spot) and tell me if bubble-burster is the one to keep here, or if it should change.
