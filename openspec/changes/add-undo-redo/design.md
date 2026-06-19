## Context

The codebase has a `FileStore` (zustand) in `@project/core` that manages per-file state including `data` (ArrayBuffer), version counters, and loading/saving flags. The `useFile()` hook wraps this store and exposes a `write(content)` function that calls `writeBuffer` on the store. Currently there is no undo/redo for file content changes — only the pixel editor has its own isolated undo/redo system.

The Edit menu already exists in the toolbar with a "Format" action. We need to add Undo/Redo items to this menu and wire them to the global keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z).

## Goals / Non-Goals

**Goals:**
- Provide undo/redo for all file content changes made via `useFile().write()`
- Bounded history: max 50 entries per file, oldest dropped when exceeded
- VS Code branch-discard behavior: new edit after undo clears the redo stack
- Expose `canUndo` / `canRedo` derived state for UI button enabling
- Add Undo/Redo buttons to the Edit menu with keyboard shortcut hints
- Register global Ctrl+Z and Ctrl+Shift+Z keyboard shortcuts
- Translations for all new UI strings

**Non-Goals:**
- Undo/redo for pixel editor (already has its own isolated system)
- Undo/redo for file system operations (create, rename, delete)
- Undo/redo across project boundaries (history is per-project)
- History persistence across sessions

## Decisions

1. **Separate zustand store (`UndoRedoStore`) rather than extending FileStore**
   - Keeps concerns separated: FileStore handles current state + persistence; UndoRedoStore handles history stack
   - FileStore is large and complex (318 lines) — adding undo/redo logic there would increase coupling
   - Alternative considered: extending FileStore directly — rejected to avoid bloat and maintain single responsibility

2. **Snapshot interception at `useFile()` hook level, not inside `writeBuffer`**
   - Before calling `store.writeBuffer()`, the hook reads current `data` and pushes it as a snapshot
   - Alternative considered: subscribing to FileStore changes — rejected because we need the *previous* state before the write, not the new state
   - Alternative considered: modifying `writeBuffer` in FileStore — rejected because it would require FileStore to depend on UndoRedoStore, creating unwanted coupling

3. **History keyed by `projectId::path` string**
   - Same key format as FileStore's internal cache keys
   - Ensures isolation between different files and different projects

4. **ArrayBuffer snapshots stored durably in memory (weak refs not needed)**
   - Max 50 entries × typical file sizes (1-100KB) = negligible memory usage
   - No need for compression or weak references

5. **Global keyboard shortcuts via `useEffect` in a hook**
   - Pattern already used in pixel editor (`PixelEditor.tsx` line 260)
   - Will create a dedicated `use-global-shortcuts.ts` hook or add to `use-edit-menu.ts`
   - Prevents event on input/textarea elements to avoid interfering with text editing

6. **Store exported from `@project/core` index and consumed by `@app/web`**
   - Follows the existing architecture where FileStore is in core and consumed by web
   - UndoRedoStore will be re-exported from `@project/core`'s public API

## Risks / Trade-offs

- [ArrayBuffer cloning] → Snapshots share the same underlying buffer. Mitigation: only reference the data that's about to be replaced; after writeBuffer creates a new ArrayBuffer, the old one is ours exclusively.
- [Perf on large files] → Pushing a 1MB snapshot 50 times = 50MB worst case. Mitigation: max 50 limit bounds this; average Mindustry JSON files are <100KB.
- [Undo during save] → Undoing while a save is in flight could cause confusion. Mitigation: undo only affects the in-memory buffer, not the disk state; save will still complete to the previous version, which is fine (user can redo or edit again).
