## Why

`cacheKey` is private in `stores/file-content.ts`, so consumers in `hooks/use-file-content.ts` and `FileExplorer.tsx` manually construct `${projectId}::${path}` in 7 places, duplicating the key format. This creates a maintenance risk.

## What Changes

- Add exported selector/accessor functions in `stores/file-content.ts` that use `cacheKey` internally:
  - `selectEntry(projectId, path)` — reactive zustand selector for an entry
  - `selectIsSaving(projectId, path)` — reactive zustand selector for saving status
  - `getEntry(projectId, path)` — non-reactive direct access via `getState()`
- Replace all 7 manual composite key constructions in consumers with these functions

## Capabilities

### New Capabilities
- `file-content-store`: Expose `selectEntry`, `selectIsSaving`, `getEntry` as public API

### Modified Capabilities
- (none)

## Impact

- `packages/state/src/stores/file-content.ts` — add 3 exported helper functions
- `packages/state/src/hooks/use-file-content.ts` — replace 4 manual key constructions
- `apps/web/src/components/editor/left/FileExplorer.tsx` — replace 3 manual key constructions
