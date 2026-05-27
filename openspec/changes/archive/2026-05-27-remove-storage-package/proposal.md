## Why

The `@project/storage` package is a thin wrapper over `localStorage` that duplicates the persistence layer already owned by the zustand persist middleware in `@project/state`. This creates an unnecessary abstraction boundary: all storage consumers (5 web components, 1 state store) must route through `@project/storage` even though the app's primary state management (zustand) already handles hydration, serialization, and persistence. Removing this layer simplifies the dependency graph, eliminates a workspace package, and moves all project metadata persistence into the existing store where it belongs.

## What Changes

- **Delete** `packages/storage/` — remove the `@project/storage` package entirely
- **Move** `getOPFSRoot()` into `@project/fs` — it is only consumed by `@project/fs` (used in `createOPFSAdapter` and `deleteProjectFiles`). Implement it directly with `navigator.storage.getDirectory()` and remove the `StorageBackend` interface method.
- **Expand `useAppStore`** — replace `projects: ProjectInfo[]` + `projectRecords` map with unified `projects: Record<string, ProjectRecord>`; add CRUD actions:
  - `saveProject(record)` → new store action
  - `getProject(id)` → new store action
  - `getAllProjects()` → new store action
  - `deleteProject(id)` → new store action
- **Move `ProjectRecord` type** to `@project/state` — drop the unused `data: string` field (always `""`); `ProjectInfo` import no longer needed in the store
- **Delete** `openspec/specs/storage-interface/` and `openspec/specs/local-storage-adapter/` — these specs describe a layer that no longer exists
- **Remove** `@project/storage` from all `package.json` dependencies (`apps/web`, `apps/app`, `packages/state`, `packages/fs`)

## Capabilities

### New Capabilities
- `project-store-refactor`: Expanded zustand store in `@project/state` that owns all project metadata CRUD (replaces the storage layer). Provides `saveProject`, `getProject`, `getAllProjects`, `deleteProject` as store actions accessible via `useAppStore`.

### Modified Capabilities
- `storage-interface`: **REMOVED** — no longer exists as a spec since the storage package is deleted
- `local-storage-adapter`: **REMOVED** — no longer exists as a spec since the storage package is deleted  

## Impact

- `packages/storage/` — **DELETE** the entire package
- `packages/state/src/stores/project.ts` — expand `AppState` with project CRUD actions; replace `projects: ProjectInfo[]` with `projects: Record<string, ProjectRecord>`; remove `ProjectInfo` import
- `packages/fs/src/index.ts` — inline `getOPFSRoot()` as a local function; remove import from `@project/storage`
- `apps/web/src/components/editor/EditorPage.tsx` — replace `getProject(id)` with store equivalent
- `apps/web/src/components/editor/ProjectPickerScreen.tsx` — replace `getAllProjects()` / `saveProject()` with store equivalents
- `apps/web/src/components/editor/toolbar/ProjectMenu.tsx` — replace `saveProject()` with store action
- `apps/web/src/components/editor/toolbar/ProjectSettingsDialog.tsx` — replace `deleteProject()`, `getProject()`, `saveProject()` with store actions
- `apps/web/src/components/editor/ProjectPickerDialog.tsx` — replace `getAllProjects()` with store selector
- `apps/web/src/components/editor/useProjectActions.ts` — update `ProjectRecord` import source
- `apps/web/package.json`, `apps/app/package.json`, `packages/state/package.json`, `packages/fs/package.json` — remove `@project/storage` workspace dependency
- `pnpm-lock.yaml` — regenerated after dependency removal
- `turbo.json` — remove `@project/storage` from pipeline if referenced
