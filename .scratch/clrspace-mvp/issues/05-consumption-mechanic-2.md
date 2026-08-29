Type: prototype
Status: claimed

## Question

What should the second Consumption Spot's Mechanic be, concretely? Build a cheap, rough version to react to. Must end up genuinely different from whatever tickets 04 and 06 land on.

## Progress

Built memory-match in `consumption-2`'s Spot: 3 pairs of hidden tiles (3x2 grid), reveal two at a time — match and they fade out, mismatch and they flip back after a short pause. Genuinely different in kind from bubble-burster (04): turn-based matching against a hidden pattern, not real-time physical popping — no per-frame drift at all. Reuses the same design language: tile hue matches the color-temperature toggle, a full clear triggers a "matched!" celebration + chime and a pause (4s, shorter than bubble-burster's 7s since solving takes longer than popping) before a fresh board shuffles in. Verified match, mismatch, and reveal all work correctly via Playwright. Code: `src/mechanics/memoryMatch.js`.

Tunable knobs deliberately left open for later (see `TUNABLES` comment block): grid size (more pairs = harder), a timer/streak scoring, what "success" means beyond a full clear, easter eggs.

**Not yet resolved** — still a "how should it feel" question (prototype ticket, HITL). Try it and confirm whether memory-match is the one to keep here, or if it should change.
