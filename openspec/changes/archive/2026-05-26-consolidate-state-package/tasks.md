## 1. Setup dependencies

- [x] 1.1 Add `@project/validation` and `valibot` to `packages/state/package.json` dependencies
- [x] 1.2 Remove `@project/file-validation` from `packages/state/package.json` dependencies
- [x] 1.3 Run `pnpm install`

## 2. Create folder structure and move files

- [x] 2.1 Create `stores/`, `hooks/`, `validation/`, `services/` dirs under `packages/state/src/`
- [x] 2.2 Move `file-content-store.ts` → `stores/file-content.ts` (update internal imports)
- [x] 2.3 Move `use-file-content.ts` → `hooks/use-file-content.ts` (update imports from `../stores/file-content`)
- [x] 2.4 Move `file-version-map.ts` → `services/version-map.ts`
- [x] 2.5 Move `write-queue.ts` → `services/write-queue.ts`
- [x] 2.6 Copy `types.ts` from `packages/file-validation/src/` → `validation/types.ts`
- [x] 2.7 Copy `registry.ts` from `packages/file-validation/src/` → `validation/registry.ts`
- [x] 2.8 Copy `runner.ts` from `packages/file-validation/src/` → `validation/runner.ts`
- [x] 2.9 Copy `validators.ts` from `packages/file-validation/src/` → `validation/validators.ts`
- [x] 2.10 Copy `store.ts` from `packages/file-validation/src/` → `validation/store.ts`

## 3. Rewrite validation-listener with direct imports

- [x] 3.1 Rename `validation-listener.ts` → `validation/listener.ts`
- [x] 3.2 Replace `import("@project/file-validation")` with direct imports from `./store`, `./validators`, `./runner`
- [x] 3.3 Remove the async/await pattern — use synchronous imports instead
- [x] 3.4 Update `registerValidationListener` export

## 4. Update state package index.ts

- [x] 4.1 Add re-exports for validation types, store, registry, runner, validators (matching what `@project/file-validation` used to export)
- [x] 4.2 Update all file paths: `./file-content-store` → `./stores/file-content`, `./use-file-content` → `./hooks/use-file-content`, etc.
- [x] 4.3 Update `registerValidationListener` import path to `./validation/listener`

## 5. Update app consumers

- [x] 5.1 Update `EditorContext.tsx` — import `useValidationStore`, `Severity` from `@project/state` instead of `@project/file-validation`
- [x] 5.2 Update `EditorShell.tsx` — import `useValidationStore` from `@project/state`
- [x] 5.3 Update `ExportMenu.tsx` — import `useValidationStore` from `@project/state`
- [x] 5.4 Update `FileExplorer.tsx` — import `useValidationStore` from `@project/state`

## 6. Delete old validation package

- [x] 6.1 Delete `packages/file-validation/` directory
- [x] 6.2 Verify no remaining references to `@project/file-validation` in source code

## 7. Verify

- [x] 7.1 TypeScript: `tsc --noEmit` passes for `packages/state`
- [x] 7.2 TypeScript: `tsc --noEmit` passes for `apps/web`
- [x] 7.3 Run `pnpm install` after deletion to update lockfile
