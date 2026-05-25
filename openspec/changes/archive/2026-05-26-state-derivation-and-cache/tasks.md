## 1. Update FileContentEntry type

- [x] 1.1 Replace `status: FileStatus` with `currentVersion: number`, `savedVersion: number`, `loading: boolean` in `FileContentEntry`
- [x] 1.2 Remove `FileStatus` type export (`idle | dirty | saving | error | loading`)
- [x] 1.3 Add derived state helpers (`isDirty`, `isSaving`, `isLoading`, `isError` getters)

## 2. Rewrite store actions

- [x] 2.1 Add `writeBuffer(path, content)` — sets `data`, increments `currentVersion`, clears `error`, sets `loading = false`
- [x] 2.2 Add `markPersisted(path)` — syncs `savedVersion = currentVersion`, updates `savedAt`
- [x] 2.3 Add `setBufferError(path, error)` — sets `error` without touching versions
- [x] 2.4 Remove `setFileDirty`, `setFileSaving`, `setFileSaved`, `setFileLoading`, `setFileError` actions
- [x] 2.5 Update `readFile` — remove `expectedVersion` param; capture `currentVersion` at start for stale-read detection; do NOT reset version to 0; set `savedVersion = currentVersion` on success; use `loading` flag

## 3. Implement per-project cache with LRU

- [x] 3.1 Key `fileContents` by `{projectId}::{path}` composite key
- [x] 3.2 Add `maxEntries` config (default 100) to store creation
- [x] 3.3 Wrap internal fileContents map with LRU eviction logic (Map insertion order)
- [x] 3.4 On `writeBuffer` / `readFile`, bump entry to end of Map; evict oldest if over limit
- [x] 3.5 Update `clearAllFileContents` to support per-project clearing

## 4. Update useFileContent hook

- [x] 4.1 Change return type: `{ data, currentVersion, savedVersion, savedAt, error, isDirty, isSaving, isLoading, isError, update }`
- [x] 4.2 Replace `setFileDirty` + `setFileSaving` + `setFileSaved` calls with `writeBuffer` + `markPersisted`
- [x] 4.3 Replace `setFileError` call with `setBufferError`
- [x] 4.4 Track `isSaving` locally via a `savingPaths` ref (set on enqueue, clear on resolve/reject)
- [x] 4.5 Remove `clearAllFileContents()` and `versions.clear()` on project switch
- [x] 4.6 Update `readFile` call site: remove `expectedVersion` param, use default

## 5. Update validation listener

- [x] 5.1 Change subscribe callback: compare `currentVersion` between curr/prev instead of checking `status === "dirty"`
- [x] 5.2 Ensure validation runs against in-memory `data` (already the case)
- [x] 5.3 Remove status-based guard — version change is the trigger

## 6. Update app consumers

- [x] 6.1 `EditorContext.tsx` — update marker logic to use derived booleans (if needed)
- [x] 6.2 `EditorShell.tsx` — update validation summary usage
- [x] 6.3 `ExportMenu.tsx` — update version field references (`version` → `currentVersion`)
- [x] 6.4 `FileExplorer.tsx` — update validation result access

## 7. Cleanup obsolete code

- [x] 7.1 Remove `packages/state/src/services/version-map.ts` and `getFileVersionMap` (replaced by store fields)
- [x] 7.2 Remove `FileVersionMap` references from `index.ts` exports
- [x] 7.3 Remove old spec file `file-states` if it exists as main spec

## 8. Verify

- [x] 8.1 TypeScript: `tsc --noEmit` passes for `packages/state`
- [x] 8.2 TypeScript: `tsc --noEmit` passes for `apps/web`
