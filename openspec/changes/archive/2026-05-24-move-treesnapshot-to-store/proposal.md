## Why

The project file tree snapshot is currently owned and mutated inside `ProjectFileSystem`, making it harder to keep UI state consistent and to reason about when the snapshot changes. Moving the snapshot into the project store centralizes state and enables consistent updates across the editor.

## What Changes

- Move `treeSnapshot` ownership from `ProjectFileSystem` into `useProjectStore`.
- Add a callback hook to `ProjectFileSystem` that is invoked whenever a `ProjectFileSystem` operation can change the effective tree snapshot.
- Use that callback to update the store-owned `treeSnapshot` state, so consumers observe a single source of truth.
- Keep `ProjectFileSystem` focused on file system operations and derivation of snapshot data rather than state ownership.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `project-file-tree-cache`: The cached tree snapshot becomes store-owned state; `ProjectFileSystem` no longer owns the snapshot directly and instead notifies the store to refresh/update it when snapshot-affecting operations occur.

## Impact

- State management: `useProjectStore` gains responsibility for storing and updating the tree snapshot.
- File system layer: `ProjectFileSystem` exposes a change callback API and invokes it from snapshot-mutating operations.
- UI/consumers: Any code reading the tree snapshot switches to reading from the store; any direct dependency on `ProjectFileSystem.treeSnapshot` is removed.
