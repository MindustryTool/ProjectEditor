## 1. Snapshot-Backed Tree Model

- [x] 1.1 Locate the project file-tree snapshot source in `@project/state` and decide the selector API to consume it from the web app
- [x] 1.2 Implement a `FileEntry[] -> TreeNode[]` builder (folder/file nodes, stable sorting, path join rules)
- [x] 1.3 Memoize tree building to avoid rebuilding on unrelated renders (e.g., based on snapshot identity)

## 2. FileExplorer Wiring

- [x] 2.1 Update `FileExplorer.tsx` to consume the current project snapshot instead of `jsonProjectTree`
- [x] 2.2 Remove static tree imports/usages and ensure the component handles empty snapshots gracefully

## 3. Folder Click Semantics

- [x] 3.1 Change `TreeNodeItem` click behavior so folder clicks only toggle expand/collapse
- [x] 3.2 Change `TreeNodeItem` click behavior so file clicks set `?path=` via `useQueryState("path")`
- [x] 3.3 Ensure selection highlight remains driven by `?path=` and does not change when clicking folders
