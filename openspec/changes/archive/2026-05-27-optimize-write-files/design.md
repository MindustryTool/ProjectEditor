## Context

`writeFiles()` in `packages/fs/src/index.ts:87` processes entries sequentially: for each entry it creates parent dirs, writes the file, emits an event, and after all entries calls `refreshTree`. For 40+ files this means 40+ sequential OPFS writes + 40+ event emissions + 40 debounced `refreshTree` calls — none of which benefit from parallel I/O.

## Goals / Non-Goals

**Goals:**
- Reduce total wall-clock time for bulk file writes (target: near-constant overhead per batch, not per-file)
- Keep the same public API signature (`writeFiles(entries)`)
- Maintain correctness: all files written, all events emitted, tree refreshed

**Non-Goals:**
- Changing the `writeFile` single-file method
- Changing OPFSAdapter internals
- Adding a transaction/rollback mechanism

## Decisions

1. **Two-phase batch approach** — First collect all unique parent directories and create them in parallel (`Promise.all`). Then write files in batches of 20 via `Promise.allSettled()`. This separates the two slow operations (mkdir vs write) and maximizes concurrency without overwhelming OPFS.

2. **Batch size of 20** — OPFS handles ~20 concurrent writes well in Chrome. Higher values risk `QuotaExceededError` or write lock contention. 20 is a conservative default.

3. **`allSettled` over `all`** — If one write fails, we still want the others to complete. Rejection is collected and re-thrown as an aggregate after the batch.

4. **One event per batch, one `refreshTree` at end** — Emit `file:changed` once per batch (instead of per-file) and call `refreshTree(true)` once after all batches. This eliminates redundant UI re-renders and debounce timers.

## Risks / Trade-offs

- [Larger batch = more memory] → 20 is small; Uint8Array data is already in memory
- [Partial write failure] → `allSettled` collects failures; caller can inspect or retry
- [mkdir race] → Deduplicating directories with a Set avoids redundant mkdir calls
