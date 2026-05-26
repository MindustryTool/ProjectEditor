## 1. FileExplorer UI — Action Buttons

- [x] 1.1 Import `Pencil` and `Trash2` icons from lucide-react in FileExplorer.tsx
- [x] 1.2 Add action buttons container (flex row, right-aligned) inside each TreeNodeItem row, after the filename span
- [x] 1.3 Style buttons to be hidden by default, visible on `group-hover` (desktop) or when row is selected (touch)
- [x] 1.4 Add touch detection via `@media (hover: none)` or `useMediaQuery` to keep buttons visible on selected row
- [x] 1.5 Prevent action button clicks from triggering file selection or folder expand/collapse (stopPropagation)
- [x] 1.6 Ensure buttons have adequate touch target size (min 32x32px) for mobile

## 2. Inline Rename Implementation

- [x] 2.1 Add `editingPath` state to track which row is in rename mode
- [x] 2.2 Render an `<input>` element instead of filename text when row is in rename mode, pre-filled with current name (strip extension for files)
- [x] 2.3 Handle Enter key to confirm: call `context.fs.rename(oldPath, newPath)` with re-appended extension
- [x] 2.4 Handle blur event to confirm rename (same as Enter)
- [x] 2.5 Handle Escape key to cancel and restore original filename
- [x] 2.6 If renamed file is currently selected, update `?path=` to new path via `onSelect`
- [x] 2.7 Handle rename errors (e.g., target exists) with toast notification

## 3. Remove with Confirmation

- [x] 3.1 Import `AlertDialog` components from the existing UI library
- [x] 3.2 Add `deleteTargetPath` state to track which item is pending deletion
- [x] 3.3 Wire remove button click to set `deleteTargetPath` and show AlertDialog
- [x] 3.4 Render AlertDialog with filename display and "Delete" / "Cancel" buttons
- [x] 3.5 On confirm: call `context.fs.delete(path)` then clear `deleteTargetPath`
- [x] 3.6 Handle delete errors with toast notification

## 4. Tree Refresh & Edge Cases

- [x] 4.1 Verify that rename/delete triggers `file:changed` event which updates `treeSnapshot` and re-renders the tree
- [x] 4.2 Verify that deleting the currently open file does not crash the editor (editor shows fallback)
- [ ] 4.3 Test on mobile viewport: action buttons visible on selected row, interactive via touch
- [ ] 4.4 Test folder rename and recursive folder delete

## 5. Cleanup

- [x] 5.1 Lint and type-check the modified file
- [ ] 5.2 Manual smoke test: create, rename, delete files/folders in the explorer
