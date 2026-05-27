## 1. Inline getOPFSRoot in @project/fs

- [x] 1.1 Add standalone `getOPFSRoot()` function to `packages/fs/src/index.ts` that calls `navigator.storage.getDirectory()` directly
- [x] 1.2 Remove `import { getOPFSRoot } from "@project/storage"` from `packages/fs/src/index.ts` (lines 2, 300, 540)

## 2. Expand useAppStore with project record CRUD

- [x] 2.1 Add `projectRecords: Record<string, ProjectRecord>` to `AppState` interface in `packages/state/src/stores/project.ts`
- [x] 2.2 Add `saveProject(record: ProjectRecord): Promise<void>` action to `useAppStore` that upserts into `projectRecords` and updates the `projects` array if needed
- [x] 2.3 Add `getProject(id: string): ProjectRecord | undefined` getter to `useAppStore` (can be a derived selector or inline in actions)
- [x] 2.4 Add `getAllProjects(): ProjectRecord[]` getter to `useAppStore`
- [x] 2.5 Add `deleteProject(id: string): Promise<void>` action that removes from `projectRecords` and `projects` arrays
- [x] 2.6 Update persist `partialize` to include `projectRecords`
- [x] 2.7 Update `createNewProject` action to call `saveProject` internally via the new action instead of importing from `@project/storage`

## 3. Export ProjectRecord from @project/state

- [x] 3.1 Move `ProjectRecord` type definition to `packages/state/src/stores/project.ts` (or a shared types file)
- [x] 3.2 Export `ProjectRecord` from `packages/state/src/index.ts`

## 4. Update web consumers

- [x] 4.1 `EditorPage.tsx` — replace `import { getProject } from "@project/storage"` with `useAppStore` equivalent
- [x] 4.2 `ProjectPickerScreen.tsx` — replace `getAllProjects`/`saveProject` from `@project/storage` with store actions; replace `ProjectRecord` import from `@project/state`
- [x] 4.3 `ProjectPickerDialog.tsx` — replace `getAllProjects` from `@project/storage` with store selector; replace `ProjectRecord` import from `@project/state`
- [x] 4.4 `ProjectMenu.tsx` — replace `saveProject` from `@project/storage` with store action; replace `ProjectRecord` import from `@project/state`
- [x] 4.5 `ProjectSettingsDialog.tsx` — replace `deleteProject`/`getProject`/`saveProject` from `@project/storage` with store actions; replace `ProjectRecord` import from `@project/state`
- [x] 4.6 `useProjectActions.ts` — replace `ProjectRecord` import from `@project/storage` with `@project/state`

## 5. Remove @project/storage package

- [x] 5.1 Delete `packages/storage/` directory
- [x] 5.2 Remove `@project/storage` from `packages/fs/package.json` dependencies
- [x] 5.3 Remove `@project/storage` from `packages/state/package.json` dependencies
- [x] 5.4 Remove `@project/storage` from `apps/web/package.json` dependencies
- [x] 5.5 Remove `@project/storage` from `apps/app/package.json` dependencies
- [x] 5.6 Regenerate lockfile (`pnpm install`)
- [x] 5.7 Update `turbo.json` if `@project/storage` is listed as a pipeline dependency

## 6. Remove obsolete specs

- [x] 6.1 Delete `openspec/specs/storage-interface/` directory
- [x] 6.2 Delete `openspec/specs/local-storage-adapter/` directory

## 7. Verification

- [x] 7.1 Run `pnpm typecheck` across the workspace to confirm no type errors
- [x] 7.2 Run `pnpm lint` to confirm no lint issues (only pre-existing `@app/app` missing eslint config)
- [x] 7.3 Verify `apps/web` builds successfully
