## 1. Implement buffer status indicators in FileExplorer

- [x] 1.1 Add `savingPaths` to file-content store state with `markSaving`/`clearSaving` actions
- [x] 1.2 Update `useFileContent` hook to use store-based saving tracking instead of local ref
- [x] 1.3 In `TreeNodeItem`, add selectors for `useFileContentStore` to get buffer state for each file using composite key `{projectId}::{currentPath}`
- [x] 1.4 Add white dot before filename when `isDirty === true`
- [x] 1.5 Add yellow dot before filename when `isSaving === true`, taking precedence over dirty dot
- [x] 1.6 Apply red text color to filename when `isError === true`
- [x] 1.7 Apply yellow text color to filename when validation warnings exist but no error
- [x] 1.8 Ensure no dot is shown for clean files (not dirty, not saving)

## 2. Verify

- [x] 2.1 TypeScript: `tsc --noEmit` passes for `packages/state`
- [x] 2.2 TypeScript: `tsc --noEmit` passes for `apps/web`
