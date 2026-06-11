## Why

The editor currently displays PNG files as a basic read-only image preview (`ImageWithSize`). Users working on pixel art for Mindustry mods (sprites, UI elements, maps) need a full-featured pixel art editor directly in the browser. Adding a dedicated pixel editor eliminates the manual edit-save-refresh cycle of using external tools, dramatically speeding up sprite authoring for mod creators.

## What Changes

- Replace the static `ImageWithSize` component with an interactive pixel art editor for `.png` files
- Add a full drawing toolset: pencil, eraser, fill bucket, line, shapes, curve, spray
- Add layer system with visibility, blending, groups, and reordering
- Add color system with palette management, RGB/HSV/HEX editors, and color wheel
- Add selection tools: rectangle, ellipse, magic wand, color select, lasso, polygon
- Add selection operations: move, duplicate, fill, invert, expand, shrink, feather
- Add transform capabilities: move, scale, rotate, flip with handles and pivot point
- Add undo/redo history system with region-snapshot storage and a panel for browsing/jumping to states
- Add navigation: zoom (scroll, pinch), pan (middle mouse, spacebar drag, hand tool)
- Add view toggles: grid, pixel grid, rulers, guides, layer bounds, onion skin, transparency checkerboard
- Add brush system: management (create/save/delete/duplicate), settings (size, opacity, flow, hardness, rotation), pixel brushes (square, circle, dither, pattern, custom)
- Add pixel-perfect drawing and symmetry modes (horizontal, vertical, radial)
- Add clipboard operations: cut, copy, paste, paste in place, paste as new layer
- Add new/open/save workflow: create canvas from preset/clipboard/image, open files, save/export PNG
- Add companion metadata file (`.png.meta`): persist layers, undo/redo history, and UI config state alongside each PNG; restore on open for seamless session recovery
- Add auto-save and versioning

## Architecture

### Core Data Model

- **PixelDocument**: Top-level root model wrapping a `PixelCanvas`. Owns canvas metadata (file path, width, height), auto-save state, and a lightweight version history. Serves as the single source of truth.
- **PixelCanvas**: Ordered list of layers, each with a `Uint8ClampedArray` of RGBA data (`width * height * 4`). Provides compositing, layer CRUD, and serialization.
- **RegionSnapshot**: Stores a set of `{x, y, width, height, data: Uint8ClampedArray}` rectangles capturing the pixel state before a modification. Used by undo/redo instead of command objects.

### State Management

- **Single Zustand store with logical slices**: One `usePixelEditorStore` combines document state, tool state, layer state, history, and UI state into a single store. Slices are logical groupings of state/actions (editor-slice, layer-slice, history-slice, ui-slice) for code organization. This avoids cross-store synchronisation bugs and keeps the full state snapshotable.
- **No state updates while drawing**: During a stroke, pixel data is mutated directly on the `Uint8ClampedArray` buffer. Zustand/React state is only committed when the stroke ends (pointer up), avoiding thousands of unnecessary re-renders per drag stroke.

### Rendering Pipeline

1. User draws → pixels are written directly to the layer's `Uint8ClampedArray`
2. Dirty rectangles are tracked in a `Set<`region-key`>` during the stroke
3. On `requestAnimationFrame`, dirty regions are composited onto a persistent hidden canvas using `ctx.putImageData` (only the dirty sub-regions, not the full canvas)
4. The same hidden canvas is used as the `image` for a persistent `Konva.Image` — no object recreation
5. The Konva stage re-renders (trivial cost — it's just a GPU texture upload)

### Performance Rules

- **Persistent objects**: Hidden canvas, `ImageData`, and `Konva.Image` are created once and reused. Never recreate during drawing.
- **RAF batching**: Pointer events only mark dirty rects and write pixels. A single `requestAnimationFrame` callback composites the dirty regions and triggers the Konva update. No per-event rendering.
- **No workers for basic tools**: pencil/eraser stay on the main thread. Web workers (via `@shopify/remote-ui` or `comlink`) are postponed until expensive operations exist (flood fill on large canvases, selection expansion, canvas resize).
- **One history entry per stroke**: A drag stroke (dozens/hundreds of pointer events) produces a single undo entry storing the region snapshots captured at the start of the stroke.
- **Image smoothing disabled everywhere**: `ctx.imageSmoothingEnabled = false` on all canvases. Konva `Image` configured with `imageSmoothingEnabled={false}`. Nearest-neighbor scaling so zoomed pixel art stays crisp.

### Undo/Redo: Region Snapshots

- On pointer down (start of stroke), capture `RegionSnapshot` of the current layer's data
- On pointer up, push the snapshot into the undo stack
- Undo: restore the snapshot's pixel regions onto the current layer data and trigger a RAF render
- Redo: capture current state as a new snapshot, restore the redo snapshot
- No command objects — just `{regions: Rect[], data: Uint8ClampedArray[]}` pairs

### Auto-save & Versioning

- Auto-save triggers after 1s of inactivity following any edit, writing the composited PNG to the project filesystem via `ProjectFileSystem.writeFile()`
- Lightweight version history: each auto-save stores a timestamped entry in the PixelDocument (in-memory only, not persisted). Users can revert to any version within the current session.
- `useFile(path)` from `@project/core` provides the read/write interface matching the existing project file system.

### Mobile Interactions

- Touch gestures: tap to place pixel, single-finger drag to draw, two-finger pinch to zoom
- Large touch targets: tool buttons are minimum 44×44px on touch devices
- Zoom slider for pinch-less zoom adjustment on small screens
- Tool panels collapse into bottom sheet / tab layout on narrow viewports

### PNG Import Flow

- Opening `.png`: `useFile(path)` returns `{data: ArrayBuffer}` → check for companion file `<path>.png.meta` → if exists, decode PNG + restore layers/history/UI from JSON; if missing, `decodePngToPixelData()` (Canvas API) → populate single-layer `PixelDocument` with defaults → render
- Import from local file: `<input type="file">` → `FileReader` → `decodePngToPixelData()` → new `PixelDocument` (no companion file)
- Import from clipboard: `navigator.clipboard.read()` → find image type → `decodePngToPixelData()` → new `PixelDocument` (no companion file)
- Export: composite layers → `encodePixelDataToPng()` → `Blob` → download or `write()`; also write companion `.png.meta` file with layers, history, and UI config

## Capabilities

### New Capabilities
- `pixel-editor-core`: Canvas initialization, new/open/save/export workflow, auto-save, versioning, `PixelDocument` root model, dirty-region rendering, RAF-batched compositing, persistent canvas/ImageData
- `pixel-editor-drawing`: Drawing tools — pencil, eraser, fill bucket, line, shapes, curve, spray; stroke buffering, direct buffer mutation
- `pixel-editor-colors`: Color system — foreground/background, palette management, RGB/HSV/HEX editors, color wheel, gradient picker
- `pixel-editor-layers`: Layer management — create/delete/duplicate/rename, visibility, opacity, blend modes, groups, reordering
- `pixel-editor-selection`: Selection tools — rectangle, ellipse, magic wand, color select, lasso, polygon; operations — move, duplicate, fill, invert, expand, shrink, feather
- `pixel-editor-transform`: Transform operations — move, scale (nearest-neighbor, integer, free), rotate (90°, arbitrary), flip (horizontal, vertical), transform handles, pivot point
- `pixel-editor-history`: Undo/redo — region-snapshot model, history panel with state browsing, clear history, 50-state limit
- `pixel-editor-navigation`: Zoom (scroll, pinch, fit, 100%, custom), pan (middle mouse, spacebar, hand tool)
- `pixel-editor-view`: View toggles — grid, pixel grid, rulers, guides, layer bounds, onion skin, transparency checkerboard
- `pixel-editor-brushes`: Brush system — management (create/save/delete/duplicate), settings (size, opacity, flow, hardness, rotation), pixel brushes (square, circle, dither, pattern, custom)
- `pixel-editor-symmetry`: Symmetry — horizontal, vertical, radial; pixel-perfect line and brush drawing
- `pixel-editor-clipboard`: Clipboard — cut, copy, paste, paste in place, paste as new layer

### Modified Capabilities
- `file-editor-panel`: Add pixel editor as a new editor type for `.png` files, replacing the current `ImageWithSize` route handler
- `editor-layout`: Pixel editor needs a full-height canvas with toolbars, which may require layout adjustments in `EditorShell`
- `project-filesystem`: Pixel editor reads/writes companion `.png.meta` files alongside PNGs for persisting editor state (layers, history, UI config)

## Impact

- `apps/web/src/components/editor/EditorShell.tsx` — Route `.png` files to pixel editor instead of `ImageWithSize`
- New directory: `apps/web/src/components/editor/pixel-editor/` — Self-contained pixel editor with subfolders (`components/`, `hooks/`, `store/`, `utils/`)
- Workers directory removed from initial structure; only created if/when flood-fill/selection/resize workloads justify off-thread processing
- Unit tests for all pure functions live alongside source in `pixel-editor/utils/__tests__/`, `pixel-editor/store/__tests__/`, etc.
- Companion file utility (`pixel-editor/utils/pixel-meta.ts`) for serializing/deserializing editor state to/from JSON sidecar files
