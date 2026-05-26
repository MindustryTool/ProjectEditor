## Context

The file explorer currently renders a read-only tree. The `@project/fs` package already provides `rename()` and `delete()` methods on `ProjectFileSystem`, but there is no store action or UI binding. The existing `ContextMenu` and `AlertDialog` components are available.

## Goals / Non-Goals

**Goals:**
- Rename button (Pencil icon) on each tree row, visible on hover (desktop) or on the selected row (mobile/touch)
- Remove button (Trash2 icon) on each tree row, same visibility rules
- Inline rename: clicking rename replaces the filename text with an `<input>`, confirm on Enter/blur, cancel on Escape
- Remove confirmation via AlertDialog before executing delete
- Folder delete is recursive through `ProjectFileSystem.delete()`
- Error feedback via toast or inline state for failures
- Works on mobile (touch-friendly hit targets, always-visible actions on selected item)

**Non-Goals:**
- Drag-and-drop reordering (future)
- Copy/paste files (future)
- Multi-file selection (future)
- Context menu (not needed — buttons are directly on the row)

## Decisions

1. **Inline rename over modal/prompt** — VS Code-style inline rename is more fluid. The filename text is replaced by an `<input>` on the same row. This avoids a separate dialog and keeps the interaction local.
2. **Direct `project.fs` call over store action** — The `ProjectFileSystem` is already accessible via `useCurrentProject()`. Adding a Zustand action just to wrap `project.fs.rename()` adds indirection without benefit. Call it directly from the component after user confirmation.
3. **Hover/focus + touch strategy** — Use CSS `group-hover` for desktop. For touch devices, detect `'ontouchstart' in window` or use `@media (hover: none)` to keep action buttons permanently visible on the selected row.
4. **AlertDialog for delete** — Reuse the existing `AlertDialog` component (already used in `ProjectSettingsDialog`). Consistent UX, no new dependency.
5. **No optimistic updates** — Wait for `rename()`/`delete()` to resolve before updating the tree. The tree refreshes via the existing `file:changed` event mechanism, which triggers a `treeSnapshot` update. If an error occurs, show a toast.
6. **Renaming open file** — If the renamed file is currently selected (matches `?path=`), update the URL query param to the new path after rename succeeds.

## Risks / Trade-offs

- **Risk: Deleting the currently open file** → The `file:changed` delete event already triggers `clearFileContent` in `FileContentStore`. The `?path=` will point to a non-existent file — the editor panel should handle this gracefully (show "file not found").
- **Risk: File conflict on rename** → `ProjectFileSystem.rename()` will throw if the target path already exists. Catch the error and show a toast message.
- **Risk: Accidental delete** → Mitigated by the AlertDialog confirmation with the filename displayed.
- **Trade-off: No undo** — Delete is permanent (OPFS has no recycle bin). The confirmation dialog is the only guard. Future work could add a "recently deleted" area.
