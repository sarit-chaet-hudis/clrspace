Type: prototype
Status: resolved

## Question

What should the second Consumption Spot's Mechanic be, concretely? Build a cheap, rough version to react to. Must end up genuinely different from whatever tickets 04 and 06 land on.

## Progress

Built memory-match in `consumption-2`'s Spot: 3 pairs of hidden tiles (3x2 grid), reveal two at a time — match and they fade out, mismatch and they flip back after a short pause. Genuinely different in kind from bubble-burster (04): turn-based matching against a hidden pattern, not real-time physical popping — no per-frame drift at all. Reuses the same design language: tile hue matches the color-temperature toggle, a full clear triggers a "matched!" celebration + chime and a pause (4s, shorter than bubble-burster's 7s since solving takes longer than popping) before a fresh board shuffles in. Verified match, mismatch, and reveal all work correctly via Playwright. Code: `src/mechanics/memoryMatch.js`.

Bumped to a 4x4 (8-pair) floor after feedback that 3x2 played too easy, and added a mid-board twist: once half the pairs are matched, two remaining hidden tiles visibly swap places (a tween, with a swoosh cue) — since color/value stay attached to their own tile, the swap genuinely changes the puzzle, not just cosmetic movement.

Tunable knobs deliberately left open for later (see `TUNABLES` comment block): a locked relationship between card count and color count (right now hue is just randomized within a temp band regardless of grid size — at 8 pairs some colors can end up too close to distinguish, this needs an explicit minimum-hue-separation rule tied to pair count), a timer/streak scoring, what "success" means beyond a full clear, easter eggs, more general tweaks as they come up.

## Answer

**Memory-match**, locked in as `consumption-2`'s Mechanic, at the 4x4/8-pair floor with the mid-board swap. Color-distinctness-vs-card-count is flagged as a known follow-up, not blocking.
