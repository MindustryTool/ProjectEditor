## 1. Rework ProjectFileSystem

- [x] 1.1 Change `ProjectFileSystem` constructor to accept `(projectInfo: ProjectInfo, vfs: VirtualFileSystem)` and compute project-root path from `projectInfo.id`
- [x] 1.2 Add `scopePath(relativePath)` private method that prepends `/projects/<id>/` and strips any existing prefix (idempotent)
- [x] 1.3 Delegate all `VirtualFileSystem` methods (readFile, writeFile, delete, mkdir, readdir, stat, exists, rename, move, copy, watch) through `scopePath` so ProjectFileSystem can fully replace the interface
- [x] 1.4 Keep text/JSON convenience methods (`readTextFile`, `writeTextFile`, `readJsonFile`, `writeJsonFile`, `copyFile`, `exists`) — they now use delegated VFS methods internally
- [x] 1.5 Export `createProjectFileSystem(projectInfo: ProjectInfo): Promise<ProjectFileSystem>` factory that calls `createOPFSAdapter` internally

## 2. Update ProjectContext type

- [x] 2.1 In `packages/state/src/index.ts`, change `import { type VirtualFileSystem }` to `import { ProjectFileSystem, createProjectFileSystem }`
- [x] 2.2 Change `ProjectContext.fs` field type from `VirtualFileSystem` to `ProjectFileSystem`
- [x] 2.3 Update `createNewProject` store action to use `createProjectFileSystem(project)` instead of raw `createOPFSAdapter()`

## 3. Update EditorPage usage

- [x] 3.1 In `EditorPage.tsx`, update `openProjectFromRecord` to construct context with `ProjectFileSystem` via `createProjectFileSystem`
- [x] 3.2 Remove direct `import { createOPFSAdapter }` from `EditorPage.tsx` since that's now handled by `createProjectFileSystem`

## 4. Verify

- [x] 4.1 Run `pnpm run typecheck` to verify no type errors
- [x] 4.2 Run `pnpm run build` to verify clean production build
