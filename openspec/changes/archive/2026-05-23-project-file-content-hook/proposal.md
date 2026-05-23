## Why

Editors that work with file content (mod.hjson, scripts, JSON files) currently have no centralized source of truth for file data in memory. Each component must re-read from disk on mount, content changes are written directly without debounce, and there is no shared loading/error state management. This leads to redundant reads, inconsistent data between components, and no debounced persistence pattern.

## What Changes

- New `useFileContent(path)` hook that returns `{ data, isLoading, error, update }` for any file in the current project
- New Zustand store slice (`fileContents` map) that acts as the in-memory cache and source of truth for file content
- On first access: loads file content from disk via `ProjectFileSystem.readTextFile`
- On `update(content)`: immediately updates in-memory state, debounces the write-to-disk via `ProjectFileSystem.writeTextFile`
- Exposes loading and error states per file path
- Integrates with the existing `EventBus` (`file:changed`) to sync when external file changes occur
- Cleans up cached content when the project is closed or switched

## Capabilities

### New Capabilities
- `file-content-store`: Zustand store slice for in-memory file content cache with path-keyed entries, loading/error states, and disk sync

### Modified Capabilities
None

## Impact

Affects `@project/state` package. New exported types, store slice, and React hook. No breaking changes to existing API surfaces. `ProjectFileSystem` remains unchanged (used as the persistence layer).
