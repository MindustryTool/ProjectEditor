## 1. Guard recordFileAccess against folders

- [x] 1.1 In `RecentlyOpenedFilesBar.handleTabClick`, read `treeSnapshot` from `useProjectSession`
- [x] 1.2 Build a `Set<string>` of file paths from `treeSnapshot` entries where `kind === "file"`
- [x] 1.3 Before calling `recordFileAccess`, check if the path is in the file Set — skip if it's not
- [x] 1.4 Ensure `setPath` still fires for folder clicks (path query param updates regardless)
- [x] 1.5 Verify file clicks record correctly and folder clicks are silently skipped
