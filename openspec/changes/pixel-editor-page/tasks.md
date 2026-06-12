## 1. Phase 1: Core Canvas & Drawing

- [x] 1.1 Create pixel editor directory structure (`components/editor/pixel-editor/` with `components/`, `hooks/`, `store/`, `utils/` subdirectories; no `workers/` until needed)
- [x] 1.2 Implement pixel data model: `PixelCanvas` class with `Uint8ClampedArray` per layer, width/height, layer CRUD; `PixelDocument` root model wrapping canvas with metadata, file path, version history
- [x] 1.3 Create single Zustand store with logical slices (`editorSlice`, `documentSlice`, `layerSlice`, `historySlice`, `uiSlice`) combining all pixel editor state
- [x] 1.3b Build `PixelDocument` integration: auto-save timer, dirty flag, in-memory version history on auto-save
- [x] 1.4 Build `PixelStage` component using react-konva: renders pixel data as a persistent `Konva.Image` from a persistent hidden canvas
- [x] 1.4b Implement dirty-region rendering: track dirty rects during stroke, RAF-batched compositing of only dirty regions, `Konva.Layer.batchDraw()`
- [x] 1.4c Implement persistent canvas/ImageData: create hidden canvas and `ImageData` once, reuse across entire session
- [x] 1.4d Disable image smoothing: `ctx.imageSmoothingEnabled = false` on hidden canvas, `imageSmoothingEnabled={false}` on Konva.Image
- [x] 1.5 Implement PNG decode: read `.png` from project filesystem via `useFile`, decode to RGBA `Uint8ClampedArray`
- [x] 1.6 Implement PNG encode: composite visible layers, encode to PNG blob, write via `useFile(path).write()`
- [x] 1.7 Implement new canvas dialog: preset sizes (16/32/64/128/256/512), custom dimensions, create from clipboard, create from image file
- [x] 1.8 Implement Save (Ctrl+S), Save As, Export PNG functionality
- [x] 1.9 Implement pencil tool: click-to-place pixel, drag-to-draw continuous line with Bresenham interpolation; direct buffer mutation (no Zustand updates during stroke)
- [x] 1.10 Implement eraser tool: sets pixels to transparent on click/drag; direct buffer mutation
- [x] 1.11 Implement zoom: scroll wheel zoom centered on cursor, pinch zoom, fit to screen, 100% zoom, custom zoom input
- [x] 1.12 Implement pan: middle mouse drag, spacebar+drag, hand tool mode
- [x] 1.13 Implement region-snapshot undo/redo: capture snapshot on pointer down, commit single entry on pointer up, Ctrl+Z/Ctrl+Shift+Z, restore snapshot data on undo
- [x] 1.14 Integrate into `EditorShell`: replace `ImageWithSize` route for `.png` files with `PixelEditor` component, update `matchEditorRoute` if needed
- [x] 1.15 Add pixel editor toolbar UI shell with tool selection buttons
- [x] 1.16 Write unit tests for Phase 1 functions: pixel data model, PNG encode/decode, Bresenham line, region-snapshot undo, zoom clamping
- [x] 1.17 Implement companion metadata file save: serialize layers (base64-encoded pixel data), undo/redo history snapshots, UI config state (tool, colors, brush settings, view toggles) to JSON; write as `<path>.png.meta` sidecar alongside PNG on every save (Ctrl+S, auto-save, Save As)
- [x] 1.18 Implement companion metadata file load: on PNG open, check for `<path>.png.meta`; if exists, restore layers, history, and UI config; if missing, fall back to single layer from PNG + defaults; version migration for schema changes
- [x] 1.19 Write unit tests for companion file: serialize/deserialize round-trip, base64 pixel data encoding, version migration, missing file fallback, history stack truncation

## 2. Phase 2: Layers & Colors

- [x] 2.1 Build layer panel UI: list layers with thumbnails, name, visibility toggle, lock toggle
- [x] 2.2 Implement layer CRUD: create, delete, duplicate, rename layers via panel buttons
- [x] 2.3 Implement layer reordering: drag-to-reorder in panel, move up/down/top/bottom buttons
- [x] 2.4 Implement layer opacity slider and blend mode selector (Normal, Multiply, Screen, Overlay, Darken, Lighten, Difference, Additive)
- [x] 2.5 Implement layer groups: create group, collapse/expand, nest layers
- [x] 2.6 Build foreground/background color swatches with swap (X key) and reset (D key)
- [x] 2.7 Build palette panel: color swatch grid, add/remove/reorder/lock colors
- [x] 2.8 Implement palette import/export: GPL format, hex list; generate palette from image; sort by hue/saturation/brightness
- [x] 2.9 Build color editors: RGB sliders, HSV sliders, HEX input (with validation), alpha slider
- [x] 2.10 Build color wheel and gradient picker components for visual color selection
- [x] 2.11 Implement fill bucket tool: flood fill (contiguous), fill all matching colors (Shift+click), tolerance slider
- [x] 2.12 Implement line tool: click-drag to draw straight line, pixel-perfect mode toggle
- [x] 2.13 Implement shape tools: outlined and filled rectangle, circle, ellipse
- [x] 2.14 Build history panel UI: list of actions, click to jump to state, clear history button
- [x] 2.15 Implement history state browsing: jump to any state, maintain redo stack
- [x] 2.16 Write unit tests for Phase 2 functions: blend mode math, flood fill algorithm, line/shape drawing algorithms, palette import/export parsing, color space conversions (RGB↔HSV, hex parsing)

## 3. Phase 3a: Selection

- [x] 3a.1 Implement rectangle selection tool: drag to create rectangular selection marquee
- [x] 3a.2 Implement ellipse selection tool: drag to create elliptical selection
- [x] 3a.3 Implement magic wand: click to select contiguous similar-color pixels with tolerance
- [x] 3a.4 Implement color select: click to select all similar-color pixels on layer (not just contiguous)
- [x] 3a.5 Implement lasso selection: freehand path enclosure
- [x] 3a.6 Implement polygon selection: click-to-place vertices, double-click/Enter to close
- [x] 3a.7 Implement selection modes: add to selection (Shift), remove from selection (Alt), intersect (Shift+Alt)
- [x] 3a.8 Implement selection operations: move selection marquee, move selection content, duplicate selection
- [x] 3a.9 Implement delete/fill/invert/expand/shrink/feather selection operations
- [x] 3a.10 Implement Select All, Deselect, Reselect
- [x] 3a.11 Implement clipboard: cut (Ctrl+X), copy (Ctrl+C), paste (Ctrl+V), paste in place, paste as new layer
- [x] 3a.12 Write unit tests for Phase 3a functions: selection algorithms (magic wand, color select, expand/shrink/feather), clipboard buffer operations

## 4. Phase 3b: Transform

- [x] 3b.1 Implement move tool: drag to translate layer or selection content
- [x] 3b.2 Implement scale: nearest-neighbor, integer factor snap, free scale; transform handles at corners/edges
- [x] 3b.3 Implement rotate: 90° CW/CCW, arbitrary angle input, rotation handle; pivot point with draggable indicator
- [x] 3b.4 Implement flip: horizontal and vertical
- [x] 3b.5 Implement auto-save: debounced save on idle (1s after last change), dirty state indicator, in-memory version history
- [x] 3b.6 Write unit tests for Phase 3b functions: transform math (scale, rotate, flip)

## 5. Phase 4: Advanced Tools & Polish

- [x] 4.1 Build brush management UI: brush list, create from selection, save, delete, duplicate
- [x] 4.2 Implement brush settings: size slider, opacity slider, flow slider, hardness slider, rotation slider
- [x] 4.3 Implement pixel brush stamps: square, circle, dither, pattern, custom (from saved patterns)
- [x] 4.4 Implement curve (Bezier) tool: click to place control points, render pixel-perfect Bezier curve
- [x] 4.5 Implement spray tool: random pixel scattering with radius and density controls
- [x] 4.6 Implement symmetry: horizontal (mirror across vertical axis), vertical (mirror across horizontal axis), radial (repeat around center with configurable segments)
- [x] 4.7 Implement pixel-perfect mode: constrain pencil and brush to pixel boundaries, prevent sub-pixel rendering
- [x] 4.8 Implement view toggles: grid overlay, pixel grid, rulers with cursor tracking, draggable guides
- [x] 4.9 Implement onion skin: show layers below active layer at reduced opacity
- [x] 4.10 Implement transparency checkerboard pattern for transparent areas (was already done)
- [x] 4.11 Implement layer bounds toggle: dashed outline around non-empty content on active layer
- [x] 4.12 Add translation keys for all pixel editor UI strings to `en` and `vi` locales
- [x] 4.13 Mobile responsiveness: ensure tool panels work in sheet/tab layout, touch-friendly tool buttons (min 44×44px), zoom slider for pinch-less zoom, magnified cursor preview
- [x] 4.14 Performance optimization: offload flood fill, selection expansion, and resize to web workers if profiling shows main-thread slowdown; region-based undo snapshots (store only changed areas instead of full layer)
- [x] 4.15 Write unit tests for Phase 4 functions: Bezier curve algorithm, brush stamp generation, symmetry mirroring, symmetry math

## 6. Phase 5: Polish & Refine

- [x] 6.1 Redo UI with frontend-design skill, make sure UI work on mobile devices, make sure destructive action require confirmation, Make sure component are small, self-contained and have it own file dedicated to it, state are moved down to where its used, avoid rerender with useMemo, useCallback, logic should be extracted into testable unit
+ Organize code by feature, not by file type.
+ Keep data, logic, rendering, and side effects separated, and only rerender React when the UI actually needs to change.
+ Keep components small and focused on one responsibility.
+ Separate UI state from business/domain state.
+ Use store selectors to avoid unnecessary rerenders.
+ Don't store derived data; compute it from source state.
+ Use React.memo only for components that rerender frequently.
+ Use useMemo only for expensive computations or stable references.
+ Use useCallback only when reference stability actually matters.
+ Use useEffect only to synchronize with external systems.
+ Move reusable logic into custom hooks.
+ Keep high-frequency updates out of React state.
+ Treat React as the UI layer, not the rendering engine.
+ Use useRef for mutable values that shouldn't trigger rerenders.
+ Prefer unknown over any.
+ Use discriminated unions instead of stringly-typed objects.
+ Use clear names that describe intent, not implementation.
+ Virtualize large lists instead of rendering everything.
+ Batch expensive updates and use requestAnimationFrame for animations.
+ Move CPU-intensive work to Web Workers.
+ Avoid giant components, giant stores, and giant hooks.
- [x] 6.2 Remove any unused code
- [x] 6.3 Run test lint typecheck and fix any errors, warnings
