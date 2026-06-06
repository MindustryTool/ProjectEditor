## 1. Add context-menu state to FileExplorer

- [ ] 1.1 Add `useState<{path: string; x: number; y: number} | null>` to `FileExplorer` for dropdown position state
- [ ] 1.2 Create `handleContextMenu(path: string, rect: DOMRect)` handler that sets dropdown state from `rect.right` and `rect.top`
- [ ] 1.3 Add `handleCloseContextMenu` handler that sets state to `null`
- [ ] 1.4 Pass `onContextMenu` and `onCloseContextMenu` down to `TreeNodeChildren` via props (or a new context)

## 2. Render single floating DropdownMenu in FileExplorer

- [ ] 2.1 Import `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem` (not `DropdownMenuTrigger`) in `FileExplorer`
- [ ] 2.2 Render a single `<DropdownMenu open={...} onOpenChange={...}>` with `<DropdownMenuContent>` positioned using `style={{ position: "fixed", left, top }}` from state
- [ ] 2.3 Add Rename and Delete `<DropdownMenuItem>` entries inside the floating content
- [ ] 2.4 Wire Rename/Delete actions to call `handleRenameClick`/`handleDeleteClick` on the target node — requires storing a ref or callback map for the target path's handlers
- [ ] 2.5 Close dropdown on scroll of the file explorer container (add `onScroll` handler)

## 3. Refactor TreeNodeRow to remove DropdownMenu

- [ ] 3.1 Remove `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` imports from `TreeNodeRow`
- [ ] 3.2 Remove the entire `<DropdownMenu>` JSX block (lines 125–142), replace with a plain `<button>` that calls `onContextMenu(path, buttonRef.getBoundingClientRect())` via `onClick`
- [ ] 3.3 Add `onContextMenu` prop to `TreeNodeRowProps` and use it in the More Actions button click handler
- [ ] 3.4 Remove `handleRenameClick` and `handleDeleteClick` from `useTreeNodeActions` return (or keep them accessible via a forwarded mechanism)

## 4. Optimize zustand selectors in TreeNodeRow

- [ ] 4.1 Replace `useFileStore(isFolder ? () => false : (state) => isDirty(state.getEntry(projectId, currentPath)))` with `useFileStore(useShallow(selectEntry(projectId, currentPath)))` chained with `isDirty()` called on the result
- [ ] 4.2 Replace `useFileStore(isFolder ? () => false : selectIsSaving(projectId, currentPath))` with `useFileStore(useShallow(selectIsSaving(projectId, currentPath)))`
- [ ] 4.3 Keep `useFileStore((s) => s.loadFile)` — but extract it once at `FileExplorer` level and inject via context to avoid per-row selector calls
- [ ] 4.4 Ensure folder nodes short-circuit: when `isFolder`, return `false` without subscribing to the file store

## 5. Wire rename/delete for floating dropdown

- [ ] 5.1 Create a mechanism to look up the target node's rename/delete handlers by path — options: a `Map<string, {rename: () => void; delete: () => void}>` stored in a ref, or lifting handlers into context
- [ ] 5.2 When dropdown Rename is clicked, call the target path's rename handler
- [ ] 5.3 When dropdown Delete is clicked, call the target path's delete handler

## 6. Verify and cleanup

- [ ] 6.1 Verify the file explorer builds and renders without errors
- [ ] 6.2 Verify dropdown opens at correct position for rows at different depths
- [ ] 6.3 Verify Rename action in dropdown enters editing mode
- [ ] 6.4 Verify Delete action in dropdown opens confirmation dialog
- [ ] 6.5 Verify dropdown closes on outside click and scroll
- [ ] 6.6 Lint and typecheck (`npm run lint`, `npm run typecheck` in `apps/web`)
