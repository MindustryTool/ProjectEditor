## Why

The current file-content store conflates two concerns — in-memory editor state and disk persistence — into a single explicit status machine (dirty → saving → idle). This creates tight coupling: the hook must orchestrate status transitions for each write, validation listens for status transitions, and project switches wipe all in-memory buffers. The result is brittle, hard to extend, and loses in-memory state on project switch.

## What Changes

- **BREAKING**: Remove explicit `status` field (`idle | dirty | saving | error | loading`) from `FileContentEntry`. Replace with derived boolean getters (`isDirty`, `isSaving`, `isLoading`, `isError`) computed from `savedVersion` vs `currentVersion`.
- **BREAKING**: Remove `setFileDirty`, `setFileSaving`, `setFileSaved`, `setFileLoading`, `setFileError` actions. Replace with `writeBuffer(path, content)` (updates buffer + increments currentVersion) and `markPersisted(path)` (syncs savedVersion = currentVersion).
- **BREAKING**: `useFileContent` hook returns `{ data, currentVersion, savedVersion, savedAt, error, isDirty, isSaving, isLoading, isError, update }` instead of `{ data, status, error, version, savedAt, update }`.
- **Validation triggers on `currentVersion` change** (any buffer edit) instead of `status === "dirty"` transitions.
- `readFile` no longer resets version to 0. The `expectedVersion` parameter is removed; stale-read detection uses `currentVersion` captured at start.
- **No `clearAllFileContents()` on project switch**. Cache remains intact until closed explicitly or evicted by LRU policy.
- **BREAKING**: Cache keyed by `(projectId, path)` tuples. Each project gets an independent file buffer cache.
- **LRU eviction** for file buffers. Cache has a configurable max size; oldest entries evicted when limit exceeded.
- **Separation of layers**: Editor buffer layer (in-memory `data` + `currentVersion`), persistence layer (debounced writes via WriteQueue), validation layer (runs against in-memory buffer). These communicate through the store but are not coupled.
- Validation always runs from in-memory buffer content (`data` field), not from disk.

## Capabilities

### New Capabilities
- `state-derivation`: Derived state model (`isDirty`, `isSaving`, `isLoading` computed from `savedVersion`/`currentVersion`)
- `file-buffer-cache`: Per-project in-memory buffer cache with LRU eviction
- `validation-version-trigger`: Validation triggered by version change rather than status transition

### Modified Capabilities
- `file-content-store`: Complete rework of state shape (remove status, add savedVersion/currentVersion), action set, project-switch behavior, and readFile semantics
- `file-content-validation-listener`: Validation trigger changed from dirty-status-transition to version-change
- `file-states`: Replaced by derived state — remove explicit status requirements
- `file-versioning`: Extended — version now split into `savedVersion` and `currentVersion`; version not reset on readFile
- `write-queue`: Persistence layer decoupled from status machine — write success/failure only syncs `savedVersion`, does not set status

## Impact

- `packages/state/src/stores/file-content.ts` — Major rework of state shape, actions, cache keying, LRU eviction
- `packages/state/src/hooks/use-file-content.ts` — Return derived booleans instead of status; no explicit status transitions; no `clearAllFileContents` on project switch; readFile semantics changed
- `packages/state/src/validation/listener.ts` — Watch `currentVersion` changes instead of `status` transitions
- `packages/state/src/services/write-queue.ts` — Decoupled from status machine
- `packages/state/src/services/version-map.ts` — Likely replaced or integrated into store entry
- `apps/web/src/components/editor/EditorContext.tsx` — Update marker logic to use derived booleans
- `apps/web/src/components/editor/EditorShell.tsx` — Update validation summary usage
- `apps/web/src/components/editor/ExportMenu.tsx` — Update validation check
- `apps/web/src/components/editor/left/FileExplorer.tsx` — Update file status badge logic
