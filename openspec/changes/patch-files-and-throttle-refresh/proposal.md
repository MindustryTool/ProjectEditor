## Why

Importing a project currently writes files one-by-one in a sequential `for` loop, each calling `refreshTree()` individually. With dozens of files, this causes N tree rebuilds and N UI re-renders. Adding a batch write method and throttling `refreshTree()` eliminates redundant refreshes and speeds up import.

## What Changes

- Add `ProjectFileSystem.writeFiles()` method that accepts an array of `{ name, data }` entries, creates parent directories, writes all files, and refreshes the tree once at the end
- Throttle `refreshTree()` in `ProjectFileSystem` to coalesce rapid successive calls into a single refresh
- Update the import flow in `ProjectMenu.tsx` to use `writeFiles()` instead of the sequential `for` loop

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `virtual-file-system`: Add batch file write method to `ProjectFileSystem`; throttle `refreshTree()` to debounce rapid calls

## Impact

- **Modified**: `packages/fs/src/index.ts` (add `writeFiles()` method, throttle `refreshTree()`)
- **Modified**: `apps/web/src/components/editor/toolbar/ProjectMenu.tsx` (use `writeFiles()` in import flow)
