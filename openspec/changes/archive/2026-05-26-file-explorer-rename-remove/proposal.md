## Why

Users currently cannot rename or delete files/folders from the file explorer. They must rely on the underlying filesystem API directly. Adding inline rename and remove buttons on hover/focus provides an intuitive, discoverable way to manage project files without leaving the editor.

## What Changes

- Add a rename button (pencil icon) to each file/folder row in the file explorer, visible on hover (desktop) or always visible on the selected row (mobile/touch)
- Add a remove button (trash icon) to each file/folder row, visible on hover (desktop) or always visible on the selected row (mobile/touch)
- Rename triggers an inline text input replacing the filename, with confirm on Enter or blur, cancel on Escape
- Remove shows a confirmation dialog before deleting
- Both operations call the existing filesystem `rename()` / `delete()` methods through a new store action or directly via the project context
- Folder remove is recursive; delete all children
- Error handling with toast or inline feedback for failures (e.g., rename conflict, permission denied)

## Capabilities

### New Capabilities
- `file-rename-remove`: File rename and remove operations with inline rename UI and confirmation dialog for deletes

### Modified Capabilities
- `file-explorer`: Add rename and remove action buttons on hover/focus, update selected-path behavior for inline rename

## Impact

- `apps/web/src/components/editor/left/FileExplorer.tsx` — primary change target
- `@project/state` — may need a thin store action wrapping `project.fs.rename()` / `project.fs.delete()`
- `apps/web/src/components/ui/` — may reuse existing `AlertDialog` for delete confirmation
- No new dependencies required (lucide icons already available, `Pencil` and `Trash2` can be imported)
