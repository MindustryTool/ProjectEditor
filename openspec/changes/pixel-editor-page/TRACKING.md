# Pixel Editor — Implementation Tracking

## Progress Overview

| Phase | Status | Capabilities |
|-------|--------|-------------|
| **Phase 1: Core Canvas & Drawing** | ✅ Completed | core, drawing, navigation, region-snapshot undo, dirty-region rendering |
| **Phase 2: Layers & Colors** | ⬜ Not Started | layers, colors, history, fill, line, shapes |
| **Phase 3a: Selection** | ⬜ Not Started | selection tools, operations, clipboard |
| **Phase 3b: Transform** | ⬜ Not Started | move, scale, rotate, flip, auto-save |
| **Phase 4: Advanced Tools & Polish** | ⬜ Not Started | brushes, symmetry, view, mobile, workers |

## Architecture Summary

- **Single Zustand store** with logical slices (`editorSlice`, `documentSlice`, `layerSlice`, `historySlice`, `uiSlice`)
- **PixelDocument** root model wrapping PixelCanvas, owning file path, metadata, auto-save timer, version history
- **Direct buffer mutation** during strokes — no Zustand/React updates until pointer up
- **Persistent hidden canvas + ImageData + Konva.Image** — created once, reused across entire session
- **Dirty-region + RAF-batched rendering** — track dirty rects, composite only changed areas in requestAnimationFrame
- **Region-snapshot undo** — capture before-state as pixel regions on pointer down, restore on undo
- **Image smoothing disabled everywhere** — `imageSmoothingEnabled = false`, nearest-neighbor scaling
- **No workers directory** — postponed until expensive operations justify off-thread processing
- **Companion metadata file (`.png.meta`)** — JSON sidecar beside each PNG storing layers (base64 pixel data), undo/redo history, and UI config state; loaded on open for seamless session recovery

## Next Steps

1. Finish companion metadata file: implement save/load round-trip with base64 encoding, version migration, missing-file fallback
2. Start Phase 2 — layer panel UI, layer CRUD, blend modes
3. Color system with palette, editors, color wheel
4. Fill bucket, line, and shape tools

## Legend

- ⬜ Not Started
- 🔄 In Progress
- ✅ Completed
- ❌ Blocked
