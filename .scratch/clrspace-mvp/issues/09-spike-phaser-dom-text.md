Type: prototype
Status: resolved

## Question

Does a real, selectable DOM `<input>`/`<textarea>` coexist cleanly when positioned over a running Phaser scene — no fighting over keyboard/mouse events, no unworkable coordinate drift as the camera moves? Build the smallest possible spike (one Phaser scene, one overlaid input) to find out, rather than trusting the research's untested guess (see ADR-0001).

Resolved when you've actually typed into and selected text from an overlaid input while a Phaser scene is running, with the camera moved at least once.

## Answer

**Yes, it coexists — with two specific, fixable gotchas to build in from day one, not discover later.** Verified with a real Chromium browser (Playwright), not just code inspection:

1. **Coordinate tracking works cleanly.** Repositioning the overlaid input every frame from `worldPos - camera.scroll` stayed perfectly in sync as the camera moved — no drift.
2. **Gotcha — Phaser eats keystrokes by default.** Typing "a b c" into the overlaid textarea produced `"abc"` — Phaser's global keyboard plugin captures and `preventDefault()`s common keys (Space, arrows, etc.) by default to stop page-scrolling, and this fires regardless of DOM focus. **Fix:** call `this.input.keyboard.disableGlobalCapture()` (or scope captures away) whenever a Scribble Spot is focused.
3. **Gotcha — clicking the canvas does not blur a focused input.** `<canvas>` isn't focus-stealing by default, so clicking a Consumption Spot while a Scribble Spot's textarea is focused leaves the textarea focused. **Fix:** explicitly call `document.activeElement.blur()` (or blur the specific Scribble input) on canvas pointerdown.
4. Text selection (select-all) worked normally once typing wasn't being eaten.

Neither gotcha is a reason to revisit ADR-0001 — both are two lines of code once known. Spike code (throwaway, not for production): branch `spike/phaser-dom-text`.
