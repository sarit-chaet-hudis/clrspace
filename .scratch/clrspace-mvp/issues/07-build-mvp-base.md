Type: task
Status: claimed
Blocked by: 02, 03, 09

## Question

Not a decision — the map's one execution ticket (see map.md Notes). Build the base MVP: the Space as one continuous Phaser World scene, its Spots per the layout from ticket 03, camera-based arrow-key/scroll travel between Spots, the color-temperature Toggle, and Ambient Sound with its mute control — per the stack/architecture locked in ticket 02 (ADR-0001). Consumption Spots can hold placeholder Mechanics until tickets 04-06 resolve; Scribble Spots (real overlaid DOM inputs, per the spike in ticket 09) should be real from the start.

Resolved when the base Space is buildable/running and has actually been used across at least a couple of Sessions — ticket 08 (persistence) depends on that lived experience, not just the code existing.

**Build in from day one (per ticket 09's spike):** disable Phaser's default global key capture while a Scribble Spot is focused (otherwise it eats keystrokes like Space), and explicitly blur a focused Scribble Spot on canvas pointerdown (clicking the canvas doesn't do this automatically).

## Progress

Built and verified working (Playwright, real Chromium): one continuous Phaser World scene (2400×1600, hard edges), 5 Scribble Spots (real DOM textareas, style randomized once per Spot from the curated set, key-capture-disable-on-focus and blur-on-canvas-click both confirmed working, typing including spaces confirmed intact), 3 Consumption Spot placeholders with click stubs, camera eases toward a target speed on arrow-key hold (not instant, not full inertia), color-temperature toggle (3 states) and ambient-sound toggle (Web Audio drone, muted by default) both wired and confirmed. Code: `index.html`, `src/main.js`, `src/spots.js`, `src/scribbleOverlay.js`, `src/ui.js` on branch `feat/mvp-base`.

**Not yet resolved** — this ticket's resolution condition is explicit: it needs to have "actually been used across at least a couple of Sessions" by you, not just pass automated verification. Run `npm install && npm run dev` and live with it a bit; tell me when to mark this resolved and open `08-persistence`.
