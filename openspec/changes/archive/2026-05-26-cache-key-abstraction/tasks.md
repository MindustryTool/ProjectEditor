## 1. Add helper functions

- [x] 1.1 Add `selectEntry(projectId, path)` export in `stores/file-content.ts`
- [x] 1.2 Add `selectIsSaving(projectId, path)` export in `stores/file-content.ts`
- [x] 1.3 Add `getEntry(projectId, path)` export in `stores/file-content.ts`

## 2. Update use-file-content.ts

- [x] 2.1 Import `selectEntry`, `selectIsSaving`, `getEntry` from store
- [x] 2.2 Replace compositeKey assignment + selector with `selectEntry` (line 22/24)
- [x] 2.3 Replace `s.savingPaths.includes(...)` with `selectIsSaving` (line 25)
- [x] 2.4 Replace `store.fileContents[`${}::${}`]` with `getEntry` (line 52)
- [x] 2.5 Replace `getState().fileContents[`${}::${}`]` with `getEntry` in then callback (line 59)
- [x] 2.6 Replace `getState().fileContents[`${}::${}`]` with `getEntry` in catch callback (line 65)

## 3. Update FileExplorer.tsx

- [x] 3.1 Import `selectEntry`, `selectIsSaving` from `@project/state`
- [x] 3.2 Replace compositeKey assignment + selector with `selectEntry` (line 123)
- [x] 3.3 Replace `s.savingPaths.includes(...)` with `selectIsSaving` (line 125)

## 4. Verify

- [x] 4.1 TypeScript: `tsc --noEmit` passes for `packages/state`
- [x] 4.2 TypeScript: `tsc --noEmit` passes for `apps/web`
