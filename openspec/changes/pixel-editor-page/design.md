## Context

The project uses react-konva for canvas rendering (currently in `UnitSpriteEditor`) and Zustand for state management. PNG files are currently rendered as static `<img>` elements via `ImageWithSize`. The pixel editor needs to replace this with an interactive canvas-based editor that operates on raw pixel data (RGBA arrays), supporting multiple layers, drawing tools, undo/redo, and export back to PNG.

Key architectural constraints:
- Must work within the existing `EditorShell` panel layout (file explorer | editor | properties)
- Must integrate with the existing project filesystem (`ProjectFileSystem`) for read/write
- Must use react-konva for canvas (existing pattern)
- Must work on both desktop and mobile
- Must support large canvases (up to 512x512 or larger) without performance degradation

## Goals / Non-Goals

**Goals:**
- Replace `ImageWithSize` with an interactive pixel art editor for `.png` files
- Implement core drawing tools (pencil, eraser, fill bucket, line, shapes)
- Implement layer system with basic operations and blend modes
- Implement color system with palette management
- Implement region-snapshot-based undo/redo with history panel
- Implement zoom/pan navigation
- Implement selection tools and operations
- Implement export to PNG via project filesystem
- Phase implementation across multiple milestones

**Non-Goals:**
- Animations or timeline (future feature)
- Advanced image filters (blur, sharpen, etc.)
- Non-pixel-art editing modes (smooth anti-aliased brushes)
- Full Adobe Photoshop-level feature set
- Mindustry-specific sprite atlas packing

## Decisions

### Core Data Model: PixelDocument
- **PixelDocument** is the root model wrapping a `PixelCanvas`. It owns file path, document metadata, auto-save timer, version history, and a dirty flag.
- **PixelCanvas** contains the ordered layer list. Each layer holds a `Uint8ClampedArray` of RGBA pixel data (`width * height * 4`). Provides compositing, layer CRUD, and JSON serialization.
- **RegionSnapshot** stores before-state as a set of rectangles `{x, y, w, h, data}`. Used for undo/redo instead of command objects.

### State Management: Single Zustand Store with Slices
- One store (`usePixelEditorStore`) with logical slices: `editorSlice` (tool, colors, brush settings), `documentSlice` (PixelDocument ref, file path), `layerSlice` (layer CRUD actions), `historySlice` (undo/redo stacks, snapshot capture), `uiSlice` (view toggles, dialog visibility).
- Slices are organized via separate slice files that compose into the store with `StateCreator`. This avoids cross-store synchronization bugs and keeps the full state snapshotable for debugging.
- **Critical rule**: During active drawing (pointer down → move → up), pixel data is mutated *directly* on the `Uint8ClampedArray` buffer. Zustand `set()` is NOT called on every pointer event — only on pointer up, tool change, or non-drawing operations. This prevents thousands of React re-renders during a single drag stroke.

### Rendering Pipeline (Dirty-Region, RAF-Batched)
1. Hidden canvas and `Konva.Image` are created **once** and persisted for the lifetime of the editor session
2. On pointer events during a stroke: pixels are written to the layer's `Uint8ClampedArray` and the affected rectangle(s) are added to a `dirtyRects: Set<string>` (keyed by `"x,y,w,h"`)
3. A `requestAnimationFrame` callback checks for dirty rects. If any exist:
   a. Composite only the dirty regions from visible layers onto the persistent hidden canvas using `ctx.putImageData`
   b. Mark the Konva Image's `image` prop by calling `getCanvas()` (returns the same canvas element — no new object)
   c. Trigger a Konva layer batch update via `layer.batchDraw()`
   d. Clear the dirty rect set
4. If no dirty rects exist, the RAF callback is a no-op

### Performance Rules
- **Persistent objects**: Hidden canvas, its 2D context, and Konva.Image refs are created once and reused. Never `new ImageData()`, `document.createElement('canvas')`, or re-mount Konva nodes during drawing.
- **RAF batching**: Pointer events never render directly. They write pixels and mark dirty rects. A single RAF callback handles all rendering for that frame.
- **No workers for basic tools**: Pencil and eraser run on the main thread. Web workers are postponed until expensive operations exist (flood fill on 512² canvases, selection expansion, canvas resize) in later phases.
- **One undo entry per stroke**: `RegionSnapshot` is captured on pointer down. On pointer up, it's pushed as a single undo entry — regardless of how many intermediate pointer events occurred.
- **Image smoothing disabled everywhere**: `ctx.imageSmoothingEnabled = false` on all canvases. `Konva.Image` configured via `imageSmoothingEnabled={false}` on the Konva layer. Nearest-neighbor interpolation is the only acceptable mode for pixel art.

### Canvas via Konva (not raw canvas)
Existing project already uses react-konva. We'll render pixel data via a persistent hidden `<canvas>` whose `ImageData` is updated in dirty-region batches, displayed as a `Konva.Image` on the stage. Tools interact with the pixel buffer via direct `Uint8ClampedArray` manipulation.

### Undo/Redo: Region Snapshots (not Command Pattern)
- On pointer down → capture `RegionSnapshot` of the current layer's entire data (for simplicity; optimized to per-tool regions if profiling shows need)
- On pointer up → push snapshot + inverse snapshot into `historySlice`
- Undo → restore snapshot's pixel data onto the current layer, mark the snapshot's rects as dirty, schedule a RAF render
- Redo → capture current state as a new snapshot, restore the redo snapshot, mark dirty
- No command objects with `do()`/`undo()` methods — just data restoration

### Auto-save & Versioning
- Auto-save timer resets on each edit. After 1s of inactivity, `documentSlice.save()` is called, which composites layers to PNG and writes via `ProjectFileSystem.writeFile()`
- In-memory version history: each auto-save creates a `{timestamp, snapshot: RegionSnapshot}` entry in `PixelDocument.versions`. Users can revert within the current session.
- `useFile(path)` from `@project/core` provides read/write access matching the existing project file system pattern.

### Companion Metadata File (`.png.meta`)
A sidecar JSON file is written beside each `.png` to persist editor state that cannot be stored in the PNG format:

**File location**: `<png-path>.png.meta` (e.g., `sprites/units/spear.png` → `sprites/units/spear.png.png.meta`)

**Contents**:
- `layers[]`: Full layer data including base64-encoded pixel buffers, id, name, visible, opacity, blendMode, locked
- `history`: Undo/redo stacks with region snapshots (base64), truncated to 50 entries max on load
- `uiConfig`: Foreground/background color, active tool, brush settings, view toggles, current layer index

**Save flow**: Every PNG save (Ctrl+S, auto-save, Save As) also serializes and writes the companion file.

**Load flow**: On PNG open, the companion file is checked and loaded if present. If missing, the PNG is loaded as a single layer with default UI state and empty history.

**Pixel data encoding**: Each layer's `Uint8ClampedArray` is encoded as base64 using `btoa()` with a binary string conversion helper. This avoids JSON array bloat (~4 bytes per pixel vs ~1 byte per pixel with base64).

**Version field**: A `version` integer enables schema migration. On version mismatch, the loader attempts migration or falls back to default state.

**Rationale**: Without a companion file, switching between PNG files in the editor loses all layer structure, undo history, and toolbar state. This makes the pixel editor feel stateless and frustrating for users who frequently switch between files.

### Self-contained directory
Everything lives under `components/editor/pixel-editor/` with subdirectories (`components/`, `hooks/`, `store/`, `utils/`). No `workers/` directory is created until off-thread processing is implemented. No files are placed outside this tree since the pixel editor is an isolated feature.

### Mobile Interactions
- Touch events are mapped to the same pointer event handlers via Konva's built-in pointer event support
- Tool buttons use min 44×44px touch targets on touch devices
- Zoom slider for fine-grained zoom control without pinch gesture
- Panels collapse to bottom sheet on viewports < 640px
- Pixel-precise drawing uses tap-to-place with magnified cursor preview

### Testing Strategy
- **Unit tests for pure functions**: All pixel data manipulation (blend modes, flood fill, selection algorithms, color math, image encode/decode) are pure functions tested with vitest.
- **Component tests**: UI components (toolbar, dialogs, panels) tested with `@testing-library/react` in jsdom, mocks for Konva.
- **Test location**: Tests live in `__tests__/` subdirectories within `pixel-editor/`.
- **Per-phase testing**: Each implementation phase includes writing unit/component tests for the functions and components added in that phase.
- **What is NOT tested**: Konva canvas rendering, browser APIs (clipboard, OffscreenCanvas).

## Implementation Phases

The pixel editor is built in 4 phases, each producing a usable increment:

### Phase 1: Core Canvas & Drawing (pixel-editor-core, pixel-editor-drawing, pixel-editor-navigation)
- Canvas initialization from PNG data, create new canvas, save/export
- Companion metadata file (`.png.meta`) for persisting layers, history, and UI config alongside PNGs
- Pencil and eraser tools with continuous draw
- Zoom (scroll wheel, pinch) and pan (middle mouse, hand tool, spacebar)
- Region-snapshot undo/redo (one entry per stroke)
- Dirty-region, RAF-batched rendering pipeline
- Persistent hidden canvas / Konva.Image
- Image smoothing disabled

### Phase 2: Layers & Colors (pixel-editor-layers, pixel-editor-colors, pixel-editor-history)
- Full layer system with reordering, visibility, opacity, blend modes
- Color system with foreground/background, palette, RGB/HSV/HEX editors
- History panel with state browsing
- Fill bucket with tolerance
- Line tool with pixel-perfect mode
- Shape tools (rect, circle, ellipse)

### Phase 3a: Selection (pixel-editor-selection)
- All selection tools (rectangle, ellipse, magic wand, color select, lasso, polygon)
- Selection operations (move, duplicate, fill, invert, expand, shrink, feather)
- Clipboard operations (cut, copy, paste)
- Select All / Deselect / Reselect

### Phase 3b: Transform (pixel-editor-transform)
- Move tool
- Scale (nearest-neighbor, integer snap, free)
- Rotate (90°, arbitrary)
- Flip (horizontal, vertical)
- Transform handles and pivot point
- Auto-save

### Phase 4: Advanced Tools & Polish (pixel-editor-brushes, pixel-editor-symmetry, pixel-editor-view)
- Brush system with management and settings
- Curve tool, spray tool
- Symmetry modes
- View toggles (grid, rulers, onion skin, checkerboard)
- Pixel-perfect drawing
- Magic wand and color select tools
- Mobile responsiveness
- Performance optimization (workers for heavy ops if needed)

## Risks / Trade-offs

- **Performance with large canvases**: Pixel data on large canvases (512x512+) could be slow for undo snapshots. Mitigation: Region-based snapshots (only store changed pixel regions) and RAF-batched dirty-region rendering.
- **Memory usage with history**: Deep undo history can consume significant memory. Mitigation: Limit history to 50 states by default, configurable. Region snapshots store only changed areas when optimized.
- **Mobile touch support**: Pinch zoom and pixel-precise drawing on mobile is challenging. Mitigation: Add zoom slider, tap-to-place pixels with magnified preview, large touch targets, bottom sheet layout.
- **Canvas state vs file system**: Users might edit without saving. Mitigation: Auto-save on idle (1s debounce after last change), dirty state indicator, in-memory version history.
- **Integration with existing editor layout**: The pixel editor needs more vertical space than a text editor. Mitigation: Use the existing center panel full-height, collapse right panel when pixel editor is active.
- **RAF batching complexity**: Dirty-region tracking across layers with blend modes requires careful compositing. Mitigation: Start with full-canvas compositing in Phase 1, optimize to dirty regions in Phase 2 once layer compositing is implemented.
