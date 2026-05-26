## 1. Add defaultProjectTree to ProjectFileSystem

- [x] 1.1 Add public readonly `defaultProjectTree` property of type `DefaultProjectFileTree` to `ProjectFileSystem` class
- [x] 1.2 Update `ProjectFileSystem` constructor to accept and store the `defaultProjectTree` parameter
- [x] 1.3 Update `createProjectFileSystem` to pass `jsonProjectTree` when constructing `ProjectFileSystem`
- [x] 1.4 Export `isDefaultPath` utility function that walks the tree and checks if a relative path matches a node

## 2. Hide action buttons for default tree items

- [x] 2.1 Import `isDefaultPath` from `@project/fs` in FileExplorer.tsx
- [x] 2.2 Add `isDefault` check derived from `context.fs.defaultProjectTree` and `currentPath` in TreeNodeItem
- [x] 2.3 Conditionally render the action buttons container: only show if `!isDefault`
- [x] 2.4 Verify that action buttons still appear on user-created files and folders
- [x] 2.5 Verify that default tree items have no rename or remove buttons
- [x] 2.6 Lint and type-check the modified files
