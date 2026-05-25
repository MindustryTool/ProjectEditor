## Context

The private `cacheKey(projectId, path)` function in `stores/file-content.ts` centralizes composite key logic, but consumers bypass it by manually writing `${projectId}::${path}`.

## Goals / Non-Goals

**Goals:**
- Add exported helper functions in the store that consume `cacheKey` internally
- Replace all inline composite key constructions in consumers

**Non-Goals:**
- No key format change
- No behavioral changes
- `cacheKey` stays private

## Decisions

### Selector factories instead of store actions
Add plain exported functions (selector factories) rather than store actions because zustand selectors need to be called inline with `useStore(selector)`, not via `getState().method()`.

```typescript
// stores/file-content.ts
export function selectEntry(projectId: string, path: string) {
  const key = cacheKey(projectId, path);
  return (state: FileContentStore) => state.fileContents[key];
}

export function selectIsSaving(projectId: string, path: string) {
  const key = cacheKey(projectId, path);
  return (state: FileContentStore) => state.savingPaths.includes(key);
}

export function getEntry(projectId: string, path: string) {
  const key = cacheKey(projectId, path);
  return useFileContentStore.getState().fileContents[key];
}
```

### Consumers use functions
- `useFileContentStore(selectEntry(id, path))` replaces `useFileContentStore((s) => s.fileContents[\`${id}::${path}\`])`
- `useFileContentStore(selectIsSaving(id, path))` replaces `useFileContentStore((s) => s.savingPaths.includes(...))`
- `getEntry(id, path)` replaces `useFileContentStore.getState().fileContents[\`${id}::${path}\`]`

## Risks / Trade-offs

None — pure refactor. Each consumer call site is a 1:1 mechanical replacement.
