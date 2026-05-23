## Context

The editor currently has a "Files" dropdown with Open File / Save / Save As actions that duplicate functionality better handled by the File Explorer and auto-save. The primary user flow is project-based: create a Mindustry mod project, open an existing one, or switch between projects. The toolbar should reflect this project-centric workflow.

The Zustand store already has `projectContext`, `projects`, and `createNewProject`/`setCurrentProject`/`closeProject` actions. Projects are persisted in IndexedDB via the `storage` package.

## Goals / Non-Goals

**Goals:**
- Replace "Files" menu with "Project" menu containing Create/Open/Change/Close actions
- Provide a dialog to list and select saved projects from IndexedDB
- Show a welcome/picker screen when no project is open (instead of empty SplitView)
- Use live `projectContext` data in StatusBar (project name, file count)
- Reuse existing shadcn Dialog and DropdownMenu components

**Non-Goals:**
- Auto-save behavior (already exists in editor)
- File-level operations in the toolbar (handled by File Explorer context menu)
- Project deletion/rename (future work)
- Cloud/remote project listing

## Decisions

1. **ProjectMenu as DropdownMenu (not separate buttons)** — Keeps toolbar compact, consistent with View/Export/Localization menus. The FilesMenu already uses this pattern.

2. **Single dialog component for both Open and Change Project** — Same UI (project list + select button) for both actions. When opened via "Open Project" the dialog also shows a "Create New" option since no project is active. When opened via "Change Project", the current project is highlighted and switching triggers project close + open.

3. **Dialog uses IndexedDB directly via `@project/storage`** — The store's `projects` array is in-memory only; IndexedDB is the source of truth for saved projects. The dialog queries `getAllProjects()` on open.

4. **Welcome screen is a new `ProjectPickerScreen` component** — Rendered by `EditorPage` when `projectContext === null`. Contains a heading, "Create Project" form, and "Open Recent" list. Keeps SplitView clean — it only renders when there's an active project.

5. **StatusBar reads from store directly** — Instead of passing hardcoded props, StatusBar reads `projectContext` and file count from the Zustand store internally (or gets them passed via `EditorPage`). Simpler to keep passing as props but derive from store.

6. **No new store actions needed** — `createNewProject`, `setCurrentProject`, `closeProject` already exist. The `loadProject` action (hydrating from storage) can be added if needed, but `setCurrentProject` suffices.

## Risks / Trade-offs

- [Risk] IndexedDB `getAllProjects()` might be slow on large datasets → Mitigation: projects are small (just metadata), and the query runs once on dialog open
- [Risk] User might accidentally create duplicate project names → Mitigation: check for existing name before creating, or allow duplicates (simple for now)
- [Trade-off] Not adding project deletion → Keeps scope small; can be added later
