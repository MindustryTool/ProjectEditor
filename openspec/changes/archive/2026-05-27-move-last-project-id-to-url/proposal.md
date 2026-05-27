## Why

`lastProjectId` is persisted in zustand's localStorage store, creating a hidden auto-restore behavior that conflicts with URL-based navigation. Users can't share or bookmark editor links to specific projects, and the app always tries to reopen the last project regardless of URL state. Moving project selection to the URL makes navigation predictable, shareable, and decouples routing from persisted state.

## What Changes

- **BREAKING**: Remove `lastProjectId` from `useAppStore` (zustand persist store) and its `partialize` config
- Add a new `/projects` route that renders the project picker (currently `NoProjectScreen`)
- Add a `/projects/:id` route that opens the editor with a specific project by ID
- Rename `NoProjectScreen` component to `ProjectsPage` and use it as the route component for `/projects`
- `lastProjectId` auto-restore logic in `EditorPage` is replaced by reading project ID from URL params
- All places that set `lastProjectId` (create, import, open) will navigate to `/projects/:id` instead
- Remove `nuqs` `useQueryState("path")` from `EditorPage` — path will remain in URL via nuqs but as a query param on the editor route pattern

## Capabilities

### New Capabilities
- `projects-routing`: URL-based project selection with `/projects` and `/projects/:id` routes under each locale

### Modified Capabilities
- `editor-loading-transition`: Editor page no longer reads `lastProjectId` from store; reads project ID from URL param instead

## Impact

- `packages/state/src/stores/project.ts` — remove `lastProjectId` field, `partialize`, and all `set({ lastProjectId })` calls
- `apps/web/src/components/editor/EditorPage.tsx` — replace `lastProjectId` store read with URL param read; simplify loading logic
- `apps/web/src/components/editor/NoProjectScreen.tsx` — rename to `ProjectsPage`, may move to a new location
- `apps/web/src/components/editor/ProjectPickerScreen.tsx` — update to accept `onProjectSelected` callback that navigates instead of setting `lastProjectId`
- `apps/web/src/components/editor/ProjectMenu.tsx` — navigate to `/projects/:id` after import instead of setting `lastProjectId`
- `apps/web/src/components/editor/useProjectActions.ts` — may need to add navigation or accept a callback
- Route tree: new files `routes/$lang/projects/index.tsx` and `routes/$lang/projects/$id.tsx`
