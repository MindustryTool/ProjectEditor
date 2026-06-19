## Why

Users currently have no way to undo or redo file content changes in the text editor. Accidental edits or formatting operations cannot be reverted, leading to frustration and lost work. Adding undo/redo with a bounded history stack (max 50 entries, VS Code-style behavior) solves this fundamental UX gap.

## What Changes

- Add a zustand `UndoRedoStore` in `@project/core` that captures file data snapshots on every `write` call
- Limit history to 50 entries; when exceeded, drop oldest entries (FIFO)
- New edit after undo clears the redo stack (VS Code branch-discard behavior)
- Add Undo and Redo buttons to `EditMenuContent` with translations
- Register global keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)
- Wire undo/redo into the `useFile()` / `useFileString()` write pipeline

## Capabilities

### New Capabilities
- `file-undo-redo`: Undo/redo for file content changes with bounded history stack

### Modified Capabilities
None

## Impact

- `packages/core/src/file/` — new `undo-redo-store.ts` (zustand store)
- `apps/web/src/components/editor/toolbar/EditMenuContent.tsx` — add undo/redo menu items
- `apps/web/src/components/editor/toolbar/use-edit-menu.ts` — add undo/redo handlers
- `apps/web/src/i18n/locales/en/common.ts` — add translation keys
- Global keyboard shortcut registration in `apps/web`
