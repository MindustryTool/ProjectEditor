## 1. Undo/Redo Zustand Store

- [x] 1.1 Create `packages/core/src/file/undo-redo-store.ts` with a new zustand store (`useUndoRedoStore`)
- [x] 1.2 Define `UndoRedoEntry` type: `{ data: ArrayBuffer; name?: string }`
- [x] 1.3 Store state: `history: Map<string, UndoRedoEntry[]>` and `currentIndex: Map<string, number>`, keyed by `projectId::path`
- [x] 1.4 Implement `pushSnapshot(projectId, path, data)` — push snapshot, advance index, clear redo stack on new edit after undo, enforce max 50 (drop oldest)
- [x] 1.5 Implement `undo(projectId, path)` — decrement index, return snapshot data; no-op if at start
- [x] 1.6 Implement `redo(projectId, path)` — increment index, return snapshot data; no-op if at end
- [x] 1.7 Implement `canUndo(projectId, path)` and `canRedo(projectId, path)` selectors
- [x] 1.8 Re-export `useUndoRedoStore` from `packages/core/src/index.ts`

## 2. Wire Snapshot Capture into useFile Hook

- [x] 2.1 In `packages/core/src/file/use-file-content.ts`, import `useUndoRedoStore`
- [x] 2.2 Before `store.writeBuffer()` in the `write` callback, call `useUndoRedoStore.getState().pushSnapshot(projectId, path, existingData)`
- [x] 2.3 Ensure snapshot captures the current file data *before* the write mutates it

## 3. Edit Menu UI

- [x] 3.1 Add translation keys to `apps/web/src/i18n/locales/en/common.ts`: `edit-menu.undo`, `edit-menu.redo`
- [x] 3.2 Add translation keys to `apps/web/src/i18n/locales/vi/common.ts`: `edit-menu.undo`, `edit-menu.redo`
- [x] 3.3 Update `use-edit-menu.ts` — add `handleUndo`, `handleRedo`, `canUndo`, `canRedo` using `useUndoRedoStore`
- [x] 3.4 Update `EditMenuContent.tsx` — add Undo/Redo `DropdownMenuItem` with shortcut hints (`DropdownMenuShortcut`) above the Format item, with separator
- [x] 3.5 Update `EditMenuListContent.tsx` — add Undo/Redo buttons in the mobile list view

## 4. Global Keyboard Shortcuts

- [x] 4.1 Add `useEffect` in `use-edit-menu.ts` (or a new `use-global-shortcuts.ts` hook) to listen for `keydown` events
- [x] 4.2 Handle `Ctrl+Z` → call `undo()`; `Ctrl+Shift+Z` → call `redo()`
- [x] 4.3 Skip shortcut when focus is on `input`, `textarea`, or `select` elements
- [x] 4.4 Call `e.preventDefault()` to prevent browser default

## 5. Verify

- [x] 5.1 Run `pnpm typecheck` — fix any type errors
- [x] 5.2 Run `pnpm lint` — fix any lint errors
- [ ] 5.3 Manually test undo/redo via menu clicks and keyboard shortcuts in the editor
