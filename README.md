# clrspace

A personal browser space for shifting from a scatterbrained, intuitive state into a resourceful, creating-and-doing one. You wander a single pixel-flavored world made of hand-placed spots. Some invite a thought, and some offer something small to play with.

Built with [Phaser](https://phaser.io/) and [Vite](https://vitejs.dev/). See `index.md` for the vision and `CONTEXT.md` for the vocabulary.

## Run it

You need Node.js 18 or newer.

```sh
npm install
npm run dev
```

Vite prints a local URL, usually http://localhost:5173. Open it in a browser.

Other scripts:

```sh
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Using the space

- **Move:** hold the arrow keys, or scroll with the mouse wheel or trackpad. Movement is deliberately slow and eased.
- **Scribble Spots:** click one and type. The text is plain and selectable, so copying it out is the export.
- **Consumption Spots:** click to play. There are three: bubble-burster, memory-match, and a gravity toy.
- **Color temperature:** a toggle that shifts the whole space between color temperatures.
- **Ambient sound:** a slow looping melody (after Pachelbel's Canon in D) that changes scale with the color temperature: cool is Dorian, neutral is major, warm is Lydian. It starts muted, so use the music control to turn it on.
- **Sound effects:** pops, clinks and match sounds from the Consumption Spots have their own control, separate from the music. They also start muted.

Nothing is saved between sessions yet.

## Layout

```
index.html           page shell
src/main.js          Phaser scene, camera travel
src/spots.js         spot layout
src/scribbleOverlay.js  DOM textareas over the canvas
src/mechanics/       the three Consumption Spot mechanics
src/ui.js            toggles and sound control
src/ambientMelody.js    the looping ambient melody
docs/adr/            architecture decisions
.scratch/clrspace-mvp/  MVP plan and tickets
```
