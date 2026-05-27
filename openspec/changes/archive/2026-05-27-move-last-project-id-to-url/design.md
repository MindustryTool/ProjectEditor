## Context

The app currently persists `lastProjectId` in zustand's localStorage-backed store. On editor mount, `EditorPage` reads it to auto-restore the last project. This makes project selection stateful and opaque — users can't link directly to a project, and the behavior is hidden in persisted state. The app uses TanStack Router with locale prefix routing (`/$lang/editor`). URL query params (via nuqs) already carry the file `path` but project identity is not in the URL.

## Goals / Non-Goals

**Goals:**
- Remove `lastProjectId` from zustand persist storage entirely
- `/projects` renders the project picker (current `NoProjectScreen` → `ProjectsPage`)
- `/projects/:id` opens the editor with that project loaded
- All create/import/open actions navigate to the appropriate URL instead of setting `lastProjectId`
- `EditorPage` reads project ID from route params, not from store

**Non-Goals:**
- Changing how project context, file system, or session state works
- Adding server-side routing (all routes remain client-side)
- Removing `nuqs` for file path tracking in the editor

## Decisions

1. **Route structure under `/$lang/`**
   - `/$lang/projects` → renders `ProjectsPage` (renamed from `NoProjectScreen`)
   - `/$lang/projects/$id` → renders `EditorPage`, with `$id` available as route param
   - Rationale: Keeps locale prefix consistent, makes routes predictable and bookmarkable.

2. **How `EditorPage` receives the project ID**
   - Use TanStack Router's `useParams({ from: projectsIdRoute })` or a generic `useParams({ strict: false })` to read `$id`
   - On mount, if `$id` exists and no project context is loaded, find the project record and call `openProjectFromRecord`
   - If `$id` is invalid or project doesn't exist, redirect to `/projects`
   - Rationale: Route params are the canonical source of truth; no store interaction needed.

3. **Navigation after create/import/open**
   - `ProjectPickerScreen` (used in `ProjectsPage`) accepts an `onProjectSelected(id: string)` callback
   - Caller (the route component) passes `navigate({ to: '/$lang/projects/$id', params: { lang, id } })`
   - `ProjectMenu` (toolbar dropdown) navigates with `useNavigate()` after import/create
   - `createNewProject` in the store no longer sets `lastProjectId` — the caller navigates instead
   - Rationale: Keeps the store clean; routing is a UI concern.

4. **Removal from zustand persist**
   - Delete `lastProjectId` from `AppState` interface
   - Delete `lastProjectId` from initial state
   - Remove `lastProjectId` from `partialize`
   - Remove all `set({ lastProjectId })` calls from actions
   - Existing persisted data with `lastProjectId` will be ignored after deploy (extra key in localStorage, harmless)

5. **NoProjectScreen → ProjectsPage**
   - Rename file to `ProjectsPage.tsx`, component to `ProjectsPage`
   - Content stays the same (wraps `ProjectPickerScreen`)
   - Update all imports

## Risks / Trade-offs

- [**Orphaned data**] localStorage still has `lastProjectId` key → Mitigation: ignored by `partialize`, no migration needed
- [**Redirect loop**] Opening `/projects/:id` with missing project → Mitigation: redirect to `/projects` with a toast message
- [**Breaking URL structure**] Existing bookmarks to `/$lang/editor` still work (shows `/projects` screen if no URL param) → Mitigation: redirect `/$lang/editor` to `/$lang/projects` if we want to consolidate
