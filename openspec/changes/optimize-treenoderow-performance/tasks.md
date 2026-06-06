## 1. Add context-menu state to FileExplorer

- [x] 1.1 Add `useState<{path: string; x: number; y: number} | null>` to `FileExplorer` for dropdown position state
- [x] 1.2 Create `handleContextMenu(path: string, rect: DOMRect)` handler that sets dropdown state from `rect.right` and `rect.top`
- [x] 1.3 Add `handleCloseContextMenu` handler that sets state to `null`
- [x] 1.4 Pass `onContextMenu` and `onCloseContextMenu` down to `TreeNodeChildren` via props (or a new context)

## 2. Render single floating DropdownMenu in FileExplorer

- [x] 2.1 Import `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem` (not `DropdownMenuTrigger`) in `FileExplorer`
- [x] 2.2 Render a single `<DropdownMenu open={...} onOpenChange={...}>` with `<DropdownMenuContent>` positioned using `style={{ position: "fixed", left, top }}` from state
- [x] 2.3 Add Rename and Delete `<DropdownMenuItem>` entries inside the floating content
- [x] 2.4 Wire Rename/Delete actions to call `setEditingPath`/`setDeleteTargetPath` on the target path from context menu state directly
- [x] 2.5 Close dropdown on scroll of the file explorer container (add `useEffect` scroll listener)

## 3. Refactor TreeNodeRow to remove DropdownMenu

- [x] 3.1 Remove `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` imports from `TreeNodeRow`
- [x] 3.2 Remove the entire `<DropdownMenu>` JSX block, replace with a plain `<button>` that calls `onContextMenu(path, e.currentTarget.getBoundingClientRect())` via `onClick`
- [x] 3.3 Add `onContextMenu` prop to `TreeNodeRowProps` and use it in the More Actions button click handler
- [x] 3.4 Remove `handleRenameClick` and `handleDeleteClick` from `useTreeNodeActions` return

## 4. Optimize zustand selectors in TreeNodeRow

- [x] 4.1 Replace inline selector with `useFileStore(useShallow(selectEntry(projectId, currentPath)))` + `isDirty()` call
- [x] 4.2 Replace inline selector with `useFileStore(useShallow(selectIsSaving(projectId, currentPath)))`
- [ ] 4.3 Keep `useFileStore((s) => s.loadFile)` — but extract it once at `FileExplorer` level and inject via context to avoid per-row selector calls
- [x] 4.4 Ensure folder nodes short-circuit: `fileEntry` is `undefined` for folders (not in file store), `isItemDirty` defaults to `false`

## 5. Wire rename/delete for floating dropdown

- [x] 5.1 Use store actions directly — the floating dropdown in `FileExplorer` calls `setEditingPath(contextMenu.path)` and `setDeleteTargetPath(contextMenu.path)` using the target path from context menu state
- [x] 5.2 When dropdown Rename is clicked, call `setEditingPath(contextMenu.path)`
- [x] 5.3 When dropdown Delete is clicked, call `setDeleteTargetPath(contextMenu.path)`

## 6. Verify and cleanup

- [x] 6.1 Verify the file explorer builds and renders without errors (typecheck clean, no new errors)
- [x] 6.2 Verify dropdown opens at correct position for rows at different depths
- [x] 6.3 Verify Rename action in dropdown enters editing mode
- [x] 6.4 Verify Delete action in dropdown opens confirmation dialog
- [x] 6.5 Verify dropdown closes on outside click and scroll
- [x] 6.6 Typecheck (`npm run typecheck` in `apps/web` — passes, 0 new errors)
