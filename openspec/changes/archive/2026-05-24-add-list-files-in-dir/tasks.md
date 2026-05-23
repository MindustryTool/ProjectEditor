## 1. ProjectFileSystem API

- [x] 1.1 Add `ProjectFileSystem.listFiles(dir, { recursive? })` to `packages/fs/src/index.ts`
- [x] 1.2 Ensure path normalization and output formatting match the spec (project-relative, no leading `/`)
- [x] 1.3 Update any relevant type exports or public API surface if required

## 2. Adopt Helper (Optional)

- [x] 2.1 Refactor `packages/core/src/json-exporter.ts` to use `fs.listFiles(..., { recursive: true })` to reduce duplicated traversal logic

## 3. Verification

- [x] 3.1 Run the workspace typecheck/build and fix any TypeScript errors (no new test files)
