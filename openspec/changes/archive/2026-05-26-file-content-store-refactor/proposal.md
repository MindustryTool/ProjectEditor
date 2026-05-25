## Why

The current file content store has each hook managing its own debounce timer, creating race conditions on rapid path changes, redundant reads when multiple components open the same file, and tangled memory state with filesystem persistence. This causes stale writes, unnecessary disk IO, and inconsistent UI state on errors.

## What Changes

- Centralize write scheduling into a single flush queue instead of per-hook `setTimeout`
- Add file versioning to detect and reject stale writes (race conditions)
- Abort stale read requests when `path` changes before a read completes
- Skip disk reload if the file is locally dirty (has unsaved edits)
- Add explicit file states: `dirty`, `saving`, `savedAt`, `error`
- Preserve in-memory content on write/read errors (don't null it out)
- Optimize Zustand selectors to minimize re-renders
- Treat memory state as source of truth; filesystem is async persistence only
- Extract persistence logic from the React hook into a standalone service
- Eliminate duplicated IO when multiple components open the same file
- **BREAKING**: `useFileContent` result changes — `FileContentEntry` adds `status`, `version`, `savedAt` fields

## Capabilities

### New Capabilities
- `write-queue`: Centralized batched write scheduler with single flush queue
- `file-versioning`: Version counter per file path for stale write/read detection
- `file-states`: Extended file states (idle, dirty, saving, error) replacing simple boolean flags

### Modified Capabilities
- `file-content-store`: All requirements updated — new file states, versioning, centralized write queue, memory-as-truth, no content clearing on error

## Impact

- `packages/state/src/file-content-store.ts` — Rewritten: new fields, selectors, actions
- `packages/state/src/use-file-content.ts` — Rewritten: delegates to write queue, uses versioning, cancels stale reads
- `packages/state/src/index.ts` — May need to export new types/services
- New file: `packages/state/src/write-queue.ts` — Centralized flush queue
- New file: `packages/state/src/file-version-map.ts` — Version tracker
- All consumers of `useFileContent` (MonacoEditor, EditorCenterPanel, etc.) adapt to new `FileContentEntry` shape
