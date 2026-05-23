## 1. Update @project/validation

- [x] 1.1 Remove `ProjectFileSchema` from validation schema
- [x] 1.2 Remove `files` field from `ProjectSchema` and rename to `ProjectInfoSchema`
- [x] 1.3 Add `ProjectInfoSchema` export with id, name, createdAt, updatedAt only

## 2. Update @project/core

- [x] 2.1 Remove `ProjectFile` interface
- [x] 2.2 Rename `Project` → `ProjectInfo`; remove `files` field
- [x] 2.3 Add deprecated type alias `Project = ProjectInfo`
- [x] 2.4 Update `createProject` → `createProjectInfo` (no files param)
- [x] 2.5 Add `EventBus` type and `createEventBus()` factory with typed event map support
- [x] 2.6 Add `ProjectEventMap` type with `file:changed`, `project:saved`, `project:opened` events

## 3. Update @project/fs

- [x] 3.1 Add `FileEntry`, `FileStat`, `FileWatchCallback`, `Unsubscribe` types
- [x] 3.2 Replace `FileSystemAdapter` with `VirtualFileSystem` interface (readFile, writeFile, delete, mkdir, readdir, stat, exists, rename, move, copy, watch)
- [x] 3.3 Update `ProjectFileSystem` to accept `VirtualFileSystem` instead of `FileSystemAdapter`
- [x] 3.4 Create `OPFSAdapter` class implementing `VirtualFileSystem` using `FileSystemDirectoryHandle`
- [x] 3.5 Export all new types and classes from package index

## 4. Update @project/state

- [x] 4.1 Add `@project/fs` dependency to package.json
- [x] 4.2 Add `ProjectContext` interface (`{ project: ProjectInfo; fs: VirtualFileSystem; events: EventBus }`)
- [x] 4.3 Remove deprecated type alias `Project = ProjectInfo` from @project/core (after update)
- [x] 4.4 Refactor Zustand store: replace `currentProject: Project | null` with `projectContext: ProjectContext | null`
- [x] 4.5 Update `createNewProject` action to initialize `ProjectContext` with `OPFSAdapter` and `createEventBus()`
- [x] 4.6 Add `closeProject` action to clean up context

## 5. Update consumers

- [x] 5.1 Update `apps/app/src/app.tsx` to use `projectContext` from store instead of `currentProject`
- [x] 5.2 Run `pnpm install` to update lockfile
- [x] 5.3 Run `pnpm typecheck` — 11/11 packages passed ✓
- [x] 5.4 Run `pnpm build` — @app/app and @app/web build clean ✓
