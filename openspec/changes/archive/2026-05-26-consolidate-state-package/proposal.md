## Why

The `@project/state` package already depends on `@project/file-validation` (for validation-listener), but validation is dynamically imported, creating indirection and preventing tree-shaking. The two packages manage related state (file content + validation) that should live together. Additionally, `packages/state/src/` is flat (6 files in one directory) with no categorization, making it harder to navigate as it grows.

## What Changes

- **BREAKING**: Delete `packages/file-validation/` — its source files move into `packages/state/src/validation/`
- **BREAKING**: Remove `@project/file-validation` workspace package — all consumers import from `@project/state` instead
- Restructure `packages/state/src/` into sub-folders: `stores/`, `hooks/`, `validation/`, `services/`
- Remove dynamic `import("@project/file-validation")` from validation-listener — use direct imports
- Add `@project/validation` and `valibot` as dependencies of `@project/state`

## Capabilities

### New Capabilities
None (pure refactoring — no new features)

### Modified Capabilities
- `file-validation-core`: The validation logic (registry, runner, validators) moves from `@project/file-validation` to `@project/state/src/validation/`. Public API re-exports from `@project/state` unchanged.
- `file-validation-ui`: Imports change from `@project/file-validation` to `@project/state`. No behavioral changes.
- `file-content-store`: Renamed/moved within state package into `stores/` sub-folder.
- `file-content-validation-listener`: Replaces dynamic import with direct import. No behavioral changes.

## Impact

**Files removed:**
- `packages/file-validation/` — entire package directory (6 source files, package.json, tsconfig.json)

**Files moved/renamed (within state package):**
- `file-content-store.ts` → `stores/file-content.ts`
- `use-file-content.ts` → `hooks/use-file-content.ts`
- `file-version-map.ts` → `services/version-map.ts`
- `write-queue.ts` → `services/write-queue.ts`
- `validation-listener.ts` → `validation/listener.ts`
- New: `validation/index.ts` (re-exports validation types/store/registry/runner/validators)
- New: `validation/types.ts` (from file-validation)
- New: `validation/registry.ts` (from file-validation)
- New: `validation/runner.ts` (from file-validation)
- New: `validation/validators.ts` (from file-validation)
- New: `validation/store.ts` (from file-validation — zustand store for validation results)

**Files modified:**
- `packages/state/src/index.ts` — update all import paths to new sub-folders, add validation re-exports
- `packages/state/package.json` — add `@project/validation` and `valibot`, remove `@project/file-validation`
- `apps/web/src/components/editor/EditorContext.tsx` — import from `@project/state` instead of `@project/file-validation`
- `apps/web/src/components/editor/EditorShell.tsx` — same
- `apps/web/src/components/editor/ExportMenu.tsx` — same
- `apps/web/src/components/editor/left/FileExplorer.tsx` — same

**Dependencies added to `@project/state`:**
- `@project/validation` (for ModHjsonSchema used by validators.ts — though modHjsonValidator was removed, other validators may reference it)
- `valibot` (used by validators.ts)
