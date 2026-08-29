# clrspace MVP Tech Stack Research

**Project Scope:** 2D space rendered with pixel-art low-res feel, navigated via arrow keys/scroll, with text-entry Scribble Spots (selectable DOM text) and 3 Consumption Spots with minigames.

**Evaluation Criteria:**
1. Pixel-art low-res rendering fit
2. DOM text interoperability (Scribble Spots must remain real DOM)
3. Learning curve & setup cost for solo project

---

## 1. Plain Canvas 2D API

### Pixel-Art Rendering Fit: **STRONG**

**Pixel-Perfect Control:**
- Canvas provides direct pixel-level manipulation via `ImageData` object and `getImageData()` / `putImageData()` methods
- Critical property for retro graphics: `imageSmoothingEnabled = false` disables bilinear interpolation, preserving crisp pixel edges
- Uint8ClampedArray interface enables byte-level pixel access with RGBA format: 4 bytes per pixel (Red, Green, Blue, Alpha)

**Source:** MDN Web Docs — [Canvas API Tutorial: Pixel manipulation with canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas)

**Handling Retro Effects:**
```javascript
// Ensures pixelated rendering at any scale
ctx.imageSmoothingEnabled = false;
```

This is the **lowest-level approach** for pixel-perfect 2D graphics on the web. Full control over rendering pipeline.

### DOM Text Interoperability: **MODERATE FRICTION**

**Architecture Challenge:**
Canvas is a **single rendered element** — text drawn on canvas is not selectable/editable DOM text. To support Scribble Spots:
- Place `<input>` or `<textarea>` DOM elements **above or beside** the canvas using absolute positioning and CSS z-index
- Keep canvas for Consumption Spots and static background
- Overlay DOM text input fields for Scribble Spots with transparent backgrounds

**Friction Points:**
- Coordinate system alignment between canvas and DOM layers requires manual tracking
- Mouse event handling must route clicks to correct layer (canvas vs. DOM inputs)
- Text input styling must be coordinated with canvas pixel-art aesthetic

**Source:** Standard web architecture pattern (MDN Web Docs — [Canvas API Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial))

### Learning Curve & Setup: **MODERATE**

**Setup:**
- No build tool required; works directly with `<canvas>` tag in HTML
- Requires understanding of 2D context API, coordinate systems, and drawing operations

**Learning Path:**
- Basic usage: Creating canvas, getting 2D context
- Drawing: Shapes, paths, text, images
- Transformations: Translate, scale, rotate
- Animation: RequestAnimationFrame loop
- Pixel manipulation: ImageData for retro effects

**Time to First Result:** 30 minutes (basic animation loop)  
**Time to Minigame Mechanics:** 2-3 hours (custom drawing + input handling)

**Advantages:**
- No dependencies
- Massive ecosystem of tutorials and examples
- Full control over rendering

**Disadvantages:**
- Must implement rendering loop, sprite management, collision detection manually
- More boilerplate for simple operations than game frameworks

---

## 2. PixiJS

### Pixel-Art Rendering Fit: **WEAK**

**Design Philosophy:**
PixiJS is optimized for **high-performance 2D graphics via WebGL/WebGPU**, not pixel-art aesthetics. The library emphasizes "fastest, most lightweight 2D library available for the web" with focus on smooth, hardware-accelerated rendering.

**Pixel-Art Support:**
- No built-in pixel-art filters or crisp-edge rendering modes documented
- High-DPI display handling defaults to smooth interpolation
- Designed for modern graphics, not retro aesthetics

**Source:** GitHub PixiJS README — [pixijs/pixijs](https://github.com/pixijs/pixijs)

The library can technically render low-res graphics by using small-scale sprites and scaling up the canvas, but this is a **workaround**, not native support.

### DOM Text Interoperability: **NO NATIVE SUPPORT**

**Architecture:**
PixiJS creates a WebGL/WebGPU canvas that replaces traditional DOM rendering. No built-in mechanism for interleaving selectable DOM text with canvas content.

**Workaround Required:**
- Overlay DOM text inputs above the PixiJS canvas (same friction as Canvas 2D API approach)
- PixiJS provides no help for coordinate system alignment

**Source:** PixiJS GitHub and API documentation emphasize graphics rendering only, with no mention of DOM integration.

### Learning Curve & Setup: **EASY**

**Setup:**
```bash
npm create pixi.js@latest  # Official CLI scaffolds a project
# or
npm install pixi.js
```

**Developer Experience:**
- Clean, intuitive API for creating sprites, textures, and animations
- Asset loader built-in for managing resources
- Mouse/touch support natively available
- Good documentation and examples

**Time to First Result:** 15 minutes (sprite on screen)  
**Time to Minigame Mechanics:** 1-2 hours (sprite interactions, basic physics)

**Advantages:**
- Faster rendering than Canvas 2D for complex scenes
- Simpler sprite/texture management than raw Canvas
- Modern browser support (WebGL 2+)

**Disadvantages:**
- Not optimized for pixel-art aesthetic
- Oversized for a simple 2D space with minigames
- No pixel-perfect rendering mode

---

## 3. Phaser

### Pixel-Art Rendering Fit: **EXCELLENT**

**Explicit Pixel-Art Support:**
Phaser 4 includes filters specifically designed for retro games:
- **Blocky filter** — described as "pixel-art-friendly pixelation"
- **Quantize filter** — creates "retro dithered palettes"
- Scene rendering supports both Canvas 2D and WebGL backends

**Source:** GitHub Phaser README — [photonstorm/phaser](https://github.com/photonstorm/phaser), mentions pixel-art filters and support for 40+ front-end frameworks

The framework is **explicitly designed for game development**, including classic pixel-art games with low-res aesthetics.

### DOM Text Interoperability: **NOT DOCUMENTED / LIKELY FRICTION**

**Architecture:**
Phaser runs in a managed canvas/WebGL context for all rendering. No built-in integration with DOM elements or text inputs.

**Workaround Required:**
- Overlay DOM text inputs above Phaser canvas (standard pattern)
- Phaser scene management and DOM coordination would require custom glue code

**Friction:**
- Phaser's scene lifecycle and input system may conflict with DOM event handling
- Would need careful event routing to prevent double-handling of keyboard/mouse

**Source:** Phaser documentation emphasizes scene management and canvas rendering; no mention of DOM interop patterns.

### Learning Curve & Setup: **EASY**

**Setup:**
```bash
npm create phaser-game  # Official CLI with template selection
# or
npm install phaser
```

**Developer Experience:**
- Scene-based architecture (familiar to game developers)
- Built-in physics engines (Arcade, Matter.js) for collision/movement
- Animation system, tweens, particle effects included
- Over 2000 code examples available
- Developer-friendly API with clear, consistent patterns
- Supports React, Vue, Angular (easy framework integration)

**Time to First Result:** 20 minutes (hello-world scene)  
**Time to Minigame Mechanics:** 1-2 hours (prefab scene with input handling, physics, animations)

**Advantages:**
- Purpose-built for games (especially pixel-art games)
- Mature ecosystem with extensive examples
- Pixel-art rendering explicitly supported
- Rich feature set reduces custom code

**Disadvantages:**
- Overkill feature set for a simple 2D space
- DOM interop requires custom integration
- Larger bundle size than minimal Canvas 2D

---

## 4. p5.js

### Pixel-Art Rendering Fit: **MODERATE**

**General-Purpose 2D Drawing:**
p5.js is a "friendly tool for learning to code and make art" that includes "a full set of tools to draw" with support for WebGL (3D) alongside 2D graphics.

**Pixel-Art Capabilities:**
- Provides basic 2D drawing primitives (rectangles, circles, lines, paths)
- No built-in pixel-art filters or crisp-edge modes
- Can achieve low-res aesthetic by drawing to a smaller canvas and scaling with CSS `image-rendering: pixelated`
- Supports image manipulation via pixel arrays (similar to Canvas API)

**Source:** GitHub p5.js README and MDN Web Docs — [Canvas API Pixel manipulation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas)

p5.js is built on the Canvas 2D API, so pixel-art support requires the same workarounds as raw Canvas.

### DOM Text Interoperability: **GOOD**

**Design Philosophy:**
"p5.js enables thinking of a web page as your sketch" — the library is explicitly designed to integrate with web pages and work alongside DOM elements.

**Integration Model:**
- p5.js creates a canvas in the DOM (can be positioned like any element)
- Existing DOM elements and text inputs remain fully functional
- Both coexist in the same page context with standard CSS positioning

**Coordinate System:**
- p5.js handles its own coordinate system within its canvas
- DOM text fields use standard browser text rendering
- No automatic coordinate translation required; they operate independently

**Source:** GitHub p5.js README emphasizes "web page as your sketch" and shows examples of p5.js integrated into broader web pages

This is the **closest to native DOM integration** among canvas-based options.

### Learning Curve & Setup: **VERY EASY**

**Setup:**
1. Include p5.js from CDN or npm
2. Write `setup()` and `draw()` functions (Processing-style paradigm)
3. Uses a familiar "sketch" model popular in creative coding

**Learning Path:**
- Introductory tutorials: setup, variables, conditionals, loops
- Intermediate: drawing shapes, colors, transformations, images
- Specialized: WebGL 3D, sound, machine learning, accessibility
- Interactive web editor (p5.js Web Editor) for learning without local setup

**Time to First Result:** 5 minutes (p5.js Web Editor, draw a circle)  
**Time to Minigame Mechanics:** 2-3 hours (custom interactions, image handling, state management)

**Advantages:**
- Extremely beginner-friendly; designed for artists and educators
- Excellent documentation and tutorials
- Web Editor for zero-setup experimentation
- Natural DOM integration
- Large supportive community (Processing ecosystem)

**Disadvantages:**
- Not optimized for games (no physics engines, scene management, etc.)
- Smaller ecosystem compared to Phaser for game-specific features
- May require more custom code for minigame mechanics

---

## 5. DOM/CSS-Only

### Pixel-Art Rendering Fit: **WEAK TO MODERATE**

**CSS `image-rendering` Property:**
The primary tool for retro graphics using only DOM:
```css
image-rendering: pixelated;  /* Nearest-neighbor scaling, sharp pixels */
image-rendering: crisp-edges; /* Alternative for crisp rendering */
```

**Capabilities:**
- Works only on **scaled images** — images whose rendered size differs from natural dimensions
- Cannot create dynamic pixel-based graphics directly (unlike Canvas)
- No animated pixel effects without canvas/SVG

**Pixel-Art Approach:**
- Draw sprites as small PNG/SVG files, scale them with CSS `image-rendering: pixelated`
- For dynamic effects (animations, movement): use CSS transforms and transitions
- Possible to create retro aesthetic for static or keyframe-animated graphics

**Source:** MDN Web Docs — [`image-rendering` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering)

**Limitations:**
- No procedural pixel graphics generation
- No real-time rendering of game state changes
- Limited to pre-made sprite assets and CSS animations

### DOM Text Interoperability: **PERFECT**

**Architecture:**
Everything is native DOM — text inputs, labels, and visual elements all use standard HTML/CSS.

**Integration:**
```html
<div class="game-space">
  <textarea class="scribble-spot">Editable text</textarea>
  <div class="consumption-spot">Game content</div>
</div>
```

**Advantages:**
- Text is inherently selectable, copyable, autocompleted
- No coordinate system mismatch
- Accessibility features built-in (screen readers, keyboard navigation)
- Standard DOM event handling

**Disadvantages:**
- Very limited visual richness compared to canvas
- Difficult to create smooth animations or real-time interactions
- Not suitable for game mechanics requiring per-pixel control

### Learning Curve & Setup: **MINIMAL**

**Setup:**
- No build tools or libraries required
- Just HTML, CSS, and JavaScript
- Works in any browser without compilation

**Development:**
- Familiar to web developers
- CSS for styling, HTML for structure, vanilla JS for interactivity
- Can add simple interactions with CSS transitions and JavaScript event listeners

**Time to First Result:** 5 minutes (HTML structure with styled divs)  
**Time to Minigame Mechanics:** 3-4 hours (custom JavaScript, complex state management, animation workarounds)

**Advantages:**
- Zero dependencies
- Maximum accessibility for text elements
- Standard web technologies
- Easiest for mixing real DOM text with graphics

**Disadvantages:**
- Severely limited visual capabilities for minigames
- No built-in collision detection, physics, or animation systems
- Minigame mechanics would require heavy custom JavaScript
- Not suitable for smooth, real-time 2D graphics

---

## Recommendation Matrix

| Criterion | Canvas 2D | PixiJS | Phaser | p5.js | DOM/CSS |
|-----------|-----------|--------|--------|-------|---------|
| Pixel-Art Fit | **Strong** | Weak | **Excellent** | Moderate | Weak |
| DOM Interop | Moderate | Weak | Weak | **Good** | **Perfect** |
| Setup Friction | Moderate | Easy | Easy | **Very Easy** | Minimal |
| Minigame Dev | Moderate | Moderate | **Easy** | Moderate | Hard |
| Community/Examples | **Large** | **Large** | **Largest** | **Large** | Standard |
| Learning Curve | Moderate | Easy | Easy | Very Easy | Minimal |

---

## Decision Framework for clrspace MVP

### **Recommended: Canvas 2D API + DOM Overlay**

**Best for:** Pixel-art aesthetic + real selectable DOM text

**Why:**
1. **Pixel-art rendering:** Explicit control via `imageSmoothingEnabled = false` + ImageData pixel manipulation
2. **Scribble Spot integration:** Clean separation — canvas for Consumption Spots, positioned DOM elements for Scribble Spots
3. **Minimal overhead:** No framework assumptions; total control
4. **Setup:** Single `<canvas>` tag, no build tool required

**Architecture:**
```
<div class="clrspace-container">
  <canvas id="game-canvas"></canvas>
  
  <!-- Positioned absolutely above canvas -->
  <input class="scribble-spot" type="text">
  <input class="scribble-spot" type="text">
  <input class="scribble-spot" type="text">
</div>
```

**Implementation Path:**
1. Establish pixel-art rendering in Canvas (draw grid, sprites with no smoothing)
2. Implement navigation loop (arrow key handling, viewport updates)
3. Overlay Scribble Spot inputs with CSS positioning
4. Add Consumption Spot minigames (bubble-burster: detect click + animate; pattern-matching: DOM click handlers + Canvas rendering)

### **Alternative: p5.js + DOM Overlay**

**Best for:** Simpler learning curve + native DOM integration

**Why:**
- p5.js explicitly designed for DOM integration ("web page as your sketch")
- Significantly easier ramp-up time
- Still achieves pixel-art aesthetic (via Canvas 2D API underneath + CSS scaling)
- Strong tutorial ecosystem

**Trade-offs:**
- Less explicit pixel-art optimization than Phaser
- Smaller ecosystem compared to Phaser for game-specific features
- More custom code for minigame mechanics

### **Not Recommended:**

- **PixiJS:** Pixel-art aesthetic isn't a priority; DOM interop requires same overlay as Canvas
- **Phaser:** Overkill for scope (2000+ examples, physics engines, scene management); pixel-art support excellent but feature set overshoots requirements
- **DOM/CSS-Only:** Insufficient visual capabilities for minigame mechanics; not worth the interactivity constraints

---

## Source Citations

1. **MDN Web Docs — Canvas API Tutorial: Pixel manipulation with canvas**  
   https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

2. **MDN Web Docs — Canvas API Tutorial**  
   https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial

3. **MDN Web Docs — CSS `image-rendering` Property**  
   https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering

4. **MDN Web Docs — CSS `transform` Property**  
   https://developer.mozilla.org/en-US/docs/Web/CSS/transform

5. **GitHub — PixiJS (pixijs/pixijs) README**  
   https://github.com/pixijs/pixijs

6. **GitHub — Phaser (photonstorm/phaser) README**  
   https://github.com/photonstorm/phaser

7. **GitHub — p5.js (processing/p5.js) README**  
   https://github.com/processing/p5.js

8. **p5.js Official Site**  
   https://p5js.org/

9. **PixiJS Official Site**  
   https://pixijs.com/

10. **Processing Foundation — p5.js Tutorials**  
    https://p5js.org/tutorials/

---

## Final Notes

**Canvas 2D API stands out** for this specific project because:
1. It's the only option with **built-in pixel-perfect rendering** without workarounds or overengineering
2. Scribble Spot integration (real selectable DOM text) is straightforward via CSS positioning overlays
3. No framework lock-in; you own the rendering loop and architecture
4. Minigames (bubble-burster, pattern-matching) are directly implementable with canvas drawing + JavaScript event handling

The trade-off is moderate setup friction (rendering loop, coordinate management), but for a solo project prioritizing pixel-art aesthetic and text interoperability, this is the right call.
