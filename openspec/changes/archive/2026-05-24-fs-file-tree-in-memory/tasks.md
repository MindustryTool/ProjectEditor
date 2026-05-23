## 1. Shared Project Tree Source

- [x] 1.1 Move `TreeNode`, `DefaultProjectFileTree`, and the default tree data from `apps/web/src/components/editor/file-explorer-data.ts` into `packages/fs/src/index.ts` (or a new module re-exported by `index.ts`)
- [x] 1.2 Update web/editor imports to consume the moved exports from `@project/fs`
- [x] 1.3 Remove the old `file-explorer-data.ts` file after all imports are updated

## 2. FileEntry Type Change

- [x] 2.1 Update `FileEntry` type to include `path: string` (full VFS path) and adjust all TypeScript usages to the new shape
- [x] 2.2 Update `OPFSAdapter.readdir()` to populate `path` for every entry it returns
- [x] 2.3 Audit any other `FileEntry` producers/consumers to ensure `path` is consistently set and used

## 3. ProjectFileSystem In-Memory Tree Cache

- [x] 3.1 Add an internal project tree snapshot (`FileEntry[]`) to `ProjectFileSystem`
- [x] 3.2 Implement a project-root recursive walk that builds the snapshot with both directory and file entries using `readdir()`
- [x] 3.3 Change `ProjectFileSystem.listFiles()` to return `FileEntry[]` and filter snapshot results by `dir` and `{ recursive }`
- [x] 3.4 Ensure `ProjectFileSystem` path normalization/scoping is preserved and `FileEntry.path` includes the project root prefix

## 4. App Integration Updates

- [x] 4.1 Update file explorer and any other callers of `listFiles()` to handle `FileEntry[]` (and use `entry.path` / `entry.kind` instead of string paths)
- [x] 4.2 Update any code that assumes `FileEntry` is `{ name, kind }` to also handle `path`

## 5. Verification

- [x] 5.1 Run the repo’s TypeScript build/typecheck to confirm no API breakages remain
- [x] 5.2 Run the web app locally and confirm the file explorer still renders the expected default tree and navigation works (user will verify behavior)
