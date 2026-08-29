Type: task
Status: open
Blocked by: 02, 03, 09

## Question

Not a decision — the map's one execution ticket (see map.md Notes). Build the base MVP: the Space as one continuous Phaser World scene, its Spots per the layout from ticket 03, camera-based arrow-key/scroll travel between Spots, the color-temperature Toggle, and Ambient Sound with its mute control — per the stack/architecture locked in ticket 02 (ADR-0001). Consumption Spots can hold placeholder Mechanics until tickets 04-06 resolve; Scribble Spots (real overlaid DOM inputs, per the spike in ticket 09) should be real from the start.

Resolved when the base Space is buildable/running and has actually been used across at least a couple of Sessions — ticket 08 (persistence) depends on that lived experience, not just the code existing.

**Build in from day one (per ticket 09's spike):** disable Phaser's default global key capture while a Scribble Spot is focused (otherwise it eats keystrokes like Space), and explicitly blur a focused Scribble Spot on canvas pointerdown (clicking the canvas doesn't do this automatically).
