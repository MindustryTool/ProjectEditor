## Context

`stores/project.ts` currently houses a single `useProjectStore` with a `ProjectState` interface mixing:
- App-level persisted state: `settings`, `projects`, `lastProjectId`, `hydrated`
- Project session transient state: `projectContext`, `treeSnapshot`, `recentlyOpenedFiles`

All 13+ consumers import from `useProjectStore`, making it unclear which fields are session-scoped vs app-scoped. This design splits the store and renames the types for clarity.

## Goals / Non-Goals

**Goals:**
- Rename `ProjectState` → `AppState` and `useProjectStore` → `useAppStore`
- Extract `projectContext`, `treeSnapshot`, `recentlyOpenedFiles` → new `stores/session.ts` with `ProjectSession` type and `useProjectSession` hook
- Keep backward-compatible re-exports from `@project/state` so consumers can migrate gradually
- Move all session-related actions (`recordFileAccess`, `removeFromRecentFiles`, `clearRecentFiles`, `setCurrentProject`, `closeProject`) to the session store
- `useCurrentProject` hook stays as a selector from the session store

**Non-Goals:**
- Changing localStorage schema (persist key remains `project-store`)
- Altering business logic of any action
- Splitting the persist middleware (session state stays non-persisted, app state stays persisted)

## Decisions

1. **`useAppStore` keeps persistence, `useProjectSession` stays in-memory** — The session store holds runtime-only data (`projectContext`, `treeSnapshot`) that is rebuilt on page load. `recentlyOpenedFiles` was previously persisted but will move to a separate persistence mechanism in the session store (same `partialize` target).

2. **Backward-compatible re-exports in `index.ts`** — Both `useAppStore` and `useProjectSession` are exported so existing consumers can be updated incrementally.

3. **`setCurrentProject` moves to session store** — It sets `projectContext` and clears `treeSnapshot`. `lastProjectId` updates stay in `useAppStore` because it's persisted.

## Risks / Trade-offs

- **[Consumer migration]** 13+ files must update imports. Mitigation: each change is mechanical (rename import + update selector), gated by a single commit.
- **[recentlyOpenedFiles persistence]** Moving from `useAppStore` partialize to `useProjectSession` requires ensuring the persist middleware still captures it. Mitigation: duplicate the partialize config in session store.
