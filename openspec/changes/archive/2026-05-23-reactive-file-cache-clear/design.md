## Context

The current implementation clears the file content cache imperatively in the `closeProject()` action of `useProjectStore`:

```ts
closeProject: () => {
  useFileContentStore.getState().clearAllFileContents();
  set({ projectContext: null, lastProjectId: null });
},
```

This approach has issues:
- Only works when `closeProject()` is explicitly called
- Does not handle project switching via `setCurrentProject()` 
- Tightly couples the cache store to the project store action
- No reactive trigger when project ID changes indirectly

## Goals / Non-Goals

**Goals:**
- Clear the file content cache whenever the active project ID changes (close, switch to different project)
- Keep cache intact when re-opening the same project
- Decouple cache clearing from `closeProject()` action
- Use React's `useEffect` for reactive behavior

**Non-Goals:**
- Changing the cache clearing mechanism itself (`clearAllFileContents` remains the same)
- Altering the `useProjectStore` API surface
- Adding new dependencies

## Decisions

**Decision 1: Where to place the useEffect**
Place it in the `useFileContent` hook itself. Each hook instance already subscribes to the project context, and adding a project-ID watcher there is minimal. Alternatively, a dedicated `useProjectCacheCleanup` hook could be created, but that adds unnecessary indirection for a single effect.

**Decision 2: Remove imperative call from closeProject**
Yes. Remove `useFileContentStore.getState().clearAllFileContents()` from `closeProject()` since the reactive useEffect handles all project-change scenarios (close, switch, etc.). This decouples the stores.

**Decision 3: Key the effect on project ID**
Use `projectContext?.project.id ?? null` as the dependency. When it changes to a different value (including null for close), fire `clearAllFileContents()`. This naturally handles both close and switch.

## Risks / Trade-offs

- **Race condition on project switch**: If a file is being loaded from the old project when a switch occurs, the old data could arrive after the cache is cleared and pollute the new project's cache. Mitigation: the load-throttle uses `entry !== undefined` check; after clear, entries are undefined so stale loads will still populate, but they will be overwritten when the new project's files are loaded. Acceptable for now.
- **First mount double-clear**: On initial mount when no project is open, `projectContext` starts as null and `projectContext?.project.id ?? null` evaluates to null — same as when a project is closed. The first mount with no project won't have any entries to clear, so the extra clear is harmless.
