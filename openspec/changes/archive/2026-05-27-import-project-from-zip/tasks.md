## 1. Core Importer

- [x] 1.1 Create `packages/core/src/importer.ts` with `importProject(zipData)` function — extract zip, find `mod.hjson`, determine root, parse name/language
- [x] 1.2 Export `ImporterResult` type and `importProject` from `packages/core/src/index.ts`

## 2. Import UI

- [x] 2.1 Add "Import Project" `DropdownMenuItem` in `ProjectMenu.tsx` that triggers a hidden `<input type="file" accept=".zip">`
- [x] 2.2 Wire up the import flow: read zip → call `importProject` → create project → write files → activate
- [x] 2.3 Add error handling: show toast if `mod.hjson` is missing or zip is corrupt

## 3. Verify

- [x] 3.1 Run `pnpm typecheck` across all packages
