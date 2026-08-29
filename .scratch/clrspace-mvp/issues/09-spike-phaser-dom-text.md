Type: prototype
Status: open

## Question

Does a real, selectable DOM `<input>`/`<textarea>` coexist cleanly when positioned over a running Phaser scene — no fighting over keyboard/mouse events, no unworkable coordinate drift as the camera moves? Build the smallest possible spike (one Phaser scene, one overlaid input) to find out, rather than trusting the research's untested guess (see ADR-0001).

Resolved when you've actually typed into and selected text from an overlaid input while a Phaser scene is running, with the camera moved at least once.
