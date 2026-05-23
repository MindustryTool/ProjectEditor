## Context

`ProjectFileSystem` in `@project/fs` currently computes and stores an in-memory `treeSnapshot: FileEntry[]`, and `listFiles()` is implemented by filtering that snapshot. The snapshot is refreshed by calling `refreshTree()`, which mutates `ProjectFileSystem` internal state.

The editor already has a centralized project state container (`useProjectStore` in `@project/state`) that owns the active `ProjectContext` (project, fs, events). Having the file tree snapshot be a hidden mutable field inside `ProjectFileSystem` makes it difficult for UI code to reliably observe when the tree changes and forces consumers to treat `ProjectFileSystem` as both an IO layer and a state owner.

## Goals / Non-Goals

**Goals:**
- `treeSnapshot` becomes store-owned state in `useProjectStore` (single source of truth for UI/derived selectors).
- `ProjectFileSystem` no longer owns the snapshot; it only computes snapshots and notifies callers when snapshot-affecting operations occur.
- `ProjectFileSystem.listFiles()` continues to exist and continues to be served from the cached snapshot, but reads the snapshot via an injected getter instead of internal state.
- Store initialization sets the first snapshot when a project is opened/created.
- Any `ProjectFileSystem` method that can change the effective tree triggers a callback that updates the store snapshot.

**Non-Goals:**
- Incremental snapshot diffs (partial updates); this design uses full snapshot rebuilds for correctness.
- Cross-tab synchronization or background file watching; this is limited to changes initiated via `ProjectFileSystem` methods.
- Changing the public `VirtualFileSystem` interface.

## Decisions

1. **Inject snapshot access into ProjectFileSystem** — Replace the internal `treeSnapshot` field with:
   - `getTreeSnapshot(): FileEntry[]` (used by `listFiles()`), provided by the caller (the store).
   - `onTreeSnapshotChange(snapshot: FileEntry[]): void` callback, invoked when `ProjectFileSystem` rebuilds a fresh snapshot.

   Alternative considered: importing `useProjectStore` from `@project/state` inside `@project/fs`. Rejected due to package layering and circular dependency risk.

2. **Use full rebuilds on snapshot-affecting operations** — For `ProjectFileSystem` methods that can change the tree (e.g. `writeFile`, `delete`, `mkdir`, `rename`, `move`, `copy`), call the underlying VFS operation and then rebuild the snapshot (via `refreshTree()` returning `FileEntry[]`) and emit it through `onTreeSnapshotChange`.

   Alternative considered: emit an “invalidate” callback and let the store decide when to rebuild. Rejected because it complicates correctness (races, stale reads) and makes it easier to forget to refresh.

3. **Keep createProjectFileSystem as the snapshot bootstrap** — Extend `createProjectFileSystem(projectInfo, options?)` to accept the callbacks (getter + onChange). The factory:
   - constructs the `ProjectFileSystem` with the provided hooks
   - performs one initial snapshot rebuild
   - emits the initial snapshot through `onTreeSnapshotChange`

4. **Store owns snapshot state and wires hooks** — Add `treeSnapshot: FileEntry[]` to `useProjectStore` and wire the hooks when creating/opening a project:
   - `getTreeSnapshot` reads from the store state
   - `onTreeSnapshotChange` updates the store state

## Risks / Trade-offs

- **[Performance: frequent full-tree rebuild]** → Mitigation: keep the callback granularity correct first; consider incremental updates later if needed.
- **[Missed mutation method]** → Mitigation: define a clear “snapshot-affecting” list (write/delete/mkdir/rename/move/copy) and ensure each triggers a rebuild+emit.
- **[Ordering / concurrent mutations]** → Mitigation: snapshot rebuild happens after the awaited VFS mutation; callers should treat the emitted snapshot as authoritative for the completion of that method call.
