## Context

The editor's file content system lives in `@project/state` with two parts: a Zustand store (`file-content-store.ts`) and a React hook (`use-file-content.ts`). Currently:

- Each `useFileContent(path)` instance creates its own `setTimeout` debounce for writes
- No coordination — two components opening the same file each schedule independent writes
- The store has only `{data, isLoading, error}` — no way to distinguish "dirty editing" from "saved"
- Path switches (rapid file navigation) trigger reads that may resolve out of order, overwriting newer content
- Read errors clear `data` to `null`, losing the user's work
- `setFileError` sets `data: null`, discarding what was visible
- Zustand selectors in the hook are not memoized per-path; changes to unrelated paths trigger re-renders

This design addresses all issues with a centralized queue, versioning, and clean separation of concerns.

## Goals / Non-Goals

**Goals:**
- Single `WriteQueue` class managing all debounced writes per project, with batch flush
- File version counter (monotonic per path) to reject stale read/write completions
- Cancel stale in-flight reads when path changes rapidly
- Skip disk reload when file is dirty (has local unsaved edits)
- File states: `idle` → `dirty` → `saving` → `idle` (with `savedAt` timestamp)
- Preserve `data` in memory on write/read errors (set error flag alongside data)
- Optimized Zustand selectors: subscribe only to the specific path's entry
- Memory is source of truth; filesystem is persistence layer called by the WriteQueue
- Extract `WriteQueue` and version map into standalone singletons (not inside React)

**Non-Goals:**
- Conflict resolution for concurrent external edits (last-write-wins is acceptable)
- Offline-first or sync protocol (targets single-user browser environment)
- Migration of existing cached data (cache is ephemeral in-memory only)

## Decisions

1. **Centralized WriteQueue singleton** (per project) vs message bus pattern  
   Decision: Singleton `WriteQueue` class instantiated per project, held in a module-level `Map<projectId, WriteQueue>`. The hook retrieves it by project ID. This avoids passing it through React context.

2. **Version counter as `number`** per file path, incremented on each local edit  
   Decision: Simple `Map<string, number>`. Write completions and read results carry the version at request time. If the current version differs, the result is stale and discarded. This is O(1) per path.

3. **File states enum** vs multiple boolean flags  
   Decision: `FileStatus` enum with values `idle | dirty | saving | error`. The store entry becomes `{data, status, error, savedAt, version}`. This is cleaner than `isDirty && !isSaving`.

4. **Cancel stale reads via `AbortController`**  
   Decision: Store the latest `AbortController` per path. On path change or re-read, abort the previous controller. The read promise rejects silently, preventing out-of-order state updates.

5. **No clearing `data` on error**  
   Decision: `setFileError` sets `status: "error"` but preserves `data`. The hook exposes `{data, status, error}`. UI can choose to show stale data with an error banner.

6. **Selector optimization via `useStore` with shallow comparison**  
   Decision: Use `useFileContentStore((s) => s.fileContents[path])` directly (returns undefined if no entry). Combine with `useShallow` or manual shallow equality to prevent re-renders when unrelated paths change.

7. **Skip disk reload when dirty**  
   Decision: On `file:changed` event, check current status. If `dirty`, skip the reload. The user's in-flight edit takes precedence over external changes.

## Risks / Trade-offs

- **WriteQueue lifecycle**: If a project is closed before the queue flushes, pending writes are lost. Mitigation: flush queue synchronously on project close (`Promise.all`).
- **Version counter overflow**: Not a practical concern for a browser editor (max safe integer is 9 quadrillion).
- **AbortController compatibility**: `AbortController` is well-supported in modern browsers and Cloudflare Workers (the deployment target).
- **Backward compatibility for consumers**: The `FileContentEntry` type changes shape. Consumers already using `data`, `isLoading`, `error` need minor updates.
