## Why

Currently, file content cache is cleared imperatively inside the `closeProject()` Zustand action by calling `useFileContentStore.getState().clearAllFileContents()`. This approach is fragile: it only works when `closeProject()` is explicitly called, misses scenarios like switching projects via `setCurrentProject()` directly, and tightly couples the cache store to the project store action. Moving to a reactive `useEffect`-based approach that watches `projectContext.project.id` ensures the cache is always cleared when the active project changes, regardless of how the change occurs.

## What Changes

- Remove the imperative `clearAllFileContents()` call from `useProjectStore`'s `closeProject()` action
- Add a `useEffect` in `useFileContent` (or a dedicated hook) that watches `projectContext.project.id` and calls `clearAllFileContents()` whenever the project ID changes
- This handles project close (set to null), project switch, and any other scenario where project ID changes

## Capabilities

### Modified Capabilities
- `file-content-store`: Cache clearing behavior changes from imperative (inside `closeProject` action) to reactive (useEffect watching project ID)

### New Capabilities
None

## Impact

Affects `@project/state` package. Changes `useProjectStore` (remove store call) and `useFileContent` hook (add useEffect). No breaking changes to public API.
