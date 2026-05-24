## Why

`ProjectFileSystem.listFiles()` currently relies on a cached project tree snapshot, which can become stale when the underlying VFS changes outside the snapshot refresh paths. This causes file listings to lag behind the real project state and adds snapshot plumbing to `ProjectFileSystem` that duplicates state management.

## What Changes

- Remove tree snapshot plumbing from `ProjectFileSystem` (the `getTreeSnapshot` and `onTreeSnapshotChange` fields).
- Change `ProjectFileSystem.listFiles()` to query the underlying VFS on each call so results reflect realtime data.
- Keep tree caching (if still needed for UI performance) as an internal concern of the project store / explorer, not as a `ProjectFileSystem` contract.

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `project-file-tree-cache`: `ProjectFileSystem.listFiles()` will no longer be required to be served from the cached snapshot; it must reflect the current VFS state.

## Impact

- `packages/fs`: `ProjectFileSystem` implementation and any helpers used by `listFiles`.
- `project-file-tree-cache` usage in stores/UI: consumers that assumed snapshot-backed consistency may need to adapt to realtime results.
- Performance considerations: repeated `listFiles()` calls may become more expensive; any caching should move outside `ProjectFileSystem`.
