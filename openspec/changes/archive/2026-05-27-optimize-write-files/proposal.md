## Why

`writeFiles()` writes files one-by-one with sequential `await`, creating folders and emitting events per-file. For projects with many files (40+), this is slow due to O(N) sequential OPFS writes and redundant `refreshTree` calls.

## What Changes

- `writeFiles()` collects all directory paths first, creates them in parallel
- Writes file entries in batches of 20 with `Promise.allSettled()`
- Emits a single `file:changed` event per batch (not per-file)
- Calls `refreshTree` once at the end (not per-file)

## Capabilities

### New Capabilities
- `batch-file-write`: Parallel batched file writing with controlled concurrency for OPFS

### Modified Capabilities

*(none)*

## Impact

- `packages/fs/src/index.ts` — `ProjectFileSystem.writeFiles()` method
- No API signature change (same interface)
