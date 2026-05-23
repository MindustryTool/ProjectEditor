## 1. ProjectFileSystem: move snapshot ownership out

- [x] 1.1 Add `ProjectFileSystem` constructor options for `getTreeSnapshot(): FileEntry[]` and `onTreeSnapshotChange(snapshot: FileEntry[]): void`
- [x] 1.2 Remove the internal `treeSnapshot` field and update `listFiles()` to query the injected `getTreeSnapshot()` value
- [x] 1.3 Update `refreshTree()` to build and return a `FileEntry[]` snapshot (no internal mutation) and to invoke `onTreeSnapshotChange(snapshot)` when provided
- [x] 1.4 Ensure snapshot-affecting operations rebuild+emit the snapshot after successful completion (`mkdir`, `delete`, `rename`, `move`, `copy`, and file-creation via `writeFile`)
- [x] 1.5 Extend `createProjectFileSystem(projectInfo, options?)` to accept the new hooks and to emit the initial snapshot during construction

## 2. Project store: own treeSnapshot state

- [x] 2.1 Add `treeSnapshot: FileEntry[]` to `ProjectState` in `useProjectStore` (not persisted in `partialize`)
- [x] 2.2 Wire `createNewProject()` to create `ProjectFileSystem` with store hooks (`getTreeSnapshot` + `onTreeSnapshotChange`) and ensure initial snapshot is stored
- [x] 2.3 Clear `treeSnapshot` when closing a project (and when setting current project to null, if applicable)

## 3. App wiring: ensure all project opens use store-wired ProjectFileSystem

- [x] 3.1 Update `EditorPage.openProjectFromRecord()` to create `ProjectFileSystem` using the same store wiring hooks so the store snapshot stays authoritative
- [x] 3.2 Verify any other `createProjectFileSystem()` call sites are updated to provide the hooks (or are routed through a store action/helper)

## 4. Cleanup

- [x] 4.1 Remove any remaining references to `ProjectFileSystem.treeSnapshot` and ensure TypeScript types align across `@project/fs` and `@project/state`
