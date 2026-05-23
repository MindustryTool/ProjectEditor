## 1. ProjectFileSystem Cleanup

- [x] 1.1 Remove `private getTreeSnapshot?: TreeSnapshotGetter;` from `ProjectFileSystem`
- [x] 1.2 Keep snapshot emission via `onTreeSnapshotChange` and `createProjectFileSystem()` localSnapshot wiring

## 2. Realtime listFiles Implementation

- [x] 2.1 Re-implement `ProjectFileSystem.listFiles()` to query `VirtualFileSystem.readdir()` for realtime data (non-recursive)
- [x] 2.2 Add recursive directory walk for `listFiles(..., { recursive: true })`
- [x] 2.3 Ensure tree-mutation operations refresh the snapshot via `refreshTree()` (snapshot is for UI; listFiles remains VFS-backed)

## 3. Call Site Updates

- [x] 3.1 Update `@project/state` and `@app/web` usage to match the updated FS behavior/signature

## 4. Verification

- [x] 4.1 Run TypeScript typecheck to ensure the updated FS API compiles across the workspace
