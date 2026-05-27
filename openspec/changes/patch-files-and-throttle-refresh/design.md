## Context

`refreshTree()` is called inside every `ProjectFileSystem` mutation (`writeFile`, `delete`, `mkdir`, `rename`, `move`, `copy`, `createFile`). During import (dozens of sequential writes), this triggers N tree rebuilds and UI re-renders. The project already has `debounce`/`throttle` utilities in `packages/utils` but they are unused.

## Goals / Non-Goals

**Goals:**
- Add `ProjectFileSystem.writeFiles(entries)` that writes multiple files, creates parent dirs, and refreshes the tree once at the end
- Debounce `refreshTree()` so rapid successive calls coalesce into a single refresh
- Update the import flow in `ProjectMenu.tsx` to use `writeFiles()`

**Non-Goals:**
- Not parallelizing writes (OPFS doesn't benefit from concurrent writes)
- Not changing the single-file `writeFile` debounce (that's handled by `WriteQueue`)
- Not removing the existing `refreshTree()` calls in individual methods

## Decisions

- **`writeFiles()` signature**: `writeFiles(entries: { name: string; data: Uint8Array }[]): Promise<void>` — mirrors the `ZipEntry` shape used in import. Creates parent directories with `mkdir` (already `{ recursive: true }` capable), writes all files sequentially, then calls `await this.refreshTree(true)` (force immediate).
- **Debounce over throttle for `refreshTree()`**: A trailing-edge debounce (50ms) coalesces all rapid calls into a single refresh at the end. Throttle would risk multiple refreshes if writes span >1 throttle window. The existing `debounce` from `packages/utils` is used.
- **Force-refresh flag**: `refreshTree(force?: boolean)` — when `force` is true, bypasses the debounce and refreshes immediately. Used by `writeFiles()`, `mkdir()`, `delete()` etc. to ensure the final mutation always triggers a refresh.
- **Single-file methods keep their refresh call**: `writeFile`, `delete`, etc. continue to call `refreshTree()` individually — but the debounce ensures they coalesce when called rapidly.
- **No changes to `VirtualFileSystem` interface**: `writeFiles()` is only on `ProjectFileSystem` since it's a convenience for the project-scoped write pattern.

## Risks / Trade-offs

- **[Debounce delay]**: A 50ms delay before UI updates is imperceptible for manual operations. For batch operations, `writeFiles()` bypasses the delay.
- **[In-flight debounce on project close]**: If the user closes the project during a debounced refresh, the final snapshot may not fire → mitigated by flushing the debounce in a `dispose`-like method.
