## Context

The editor toolbar currently exposes project actions (create/open/change/close) via ProjectMenu. The current project’s metadata (name, updatedAt) is loaded from IndexedDB (packages/storage) into the in-memory project context (packages/state) and displayed in the status bar. There is no UI to rename or delete a project.

Projects are scoped by immutable `project.id` for filesystem storage (`/projects/${id}/` in OPFS), so renaming does not require moving project files.

## Goals / Non-Goals

**Goals:**
- Add a Project Settings entry in the Project menu that opens a settings dialog for the currently opened project.
- Allow editing the project name with inline validation and automatic persistence (no explicit Save button).
- Allow deleting the current project with a confirmation step; after deletion the editor closes the current project and the project is removed from persistent storage.
- Keep status bar/project context UI in sync with the persisted project name.

**Non-Goals:**
- Changing project id or migrating existing project file paths.
- Adding new global application settings (theme, autosave toggles, etc.).
- Adding multi-project batch management UI.

## Decisions

- Use existing UI primitives based on Radix wrappers:
  - Use `~/components/ui/dialog` for the settings dialog container.
  - Use `~/components/ui/alert-dialog` for the destructive “Delete project” confirmation.
- Mount the dialog at the editor shell level:
  - `EditorShell` owns `open` state and renders `ProjectSettingsDialog` alongside `ProjectPickerDialog`.
  - `ProjectMenu` receives a new `onProjectSettings` callback and renders a new dropdown item.
- Implement auto-save for the project name as a debounced persistence flow:
  - The dialog maintains a local `draftName` state initialized from `projectContext.project.name`.
  - On valid changes, schedule a debounced write (e.g. 300–500ms) that:
    - updates the in-memory project context (`useProjectStore`) to keep the status bar label updated, and
    - persists the updated project record via `saveProject(...)` in `@project/storage`.
  - Validation uses the existing `ProjectInfoSchema` name constraints (regex + length) and/or the existing `sanitizeFilename` behavior for safe normalization.
- Deletion performs both metadata and file cleanup:
  - Delete the IndexedDB record via `deleteProject(projectId)`.
  - Remove the OPFS project folder `/projects/${projectId}` recursively (using `navigator.storage.getDirectory()` and `removeEntry`).
  - Close the current project context via the existing store `closeProject()` and close the dialog.

## Risks / Trade-offs

- Invalid name handling could surprise users if sanitization happens implicitly → Prefer inline validation (block persistence while invalid) and optional normalization on blur.
- Debounced auto-save may overwrite fast edits if multiple timers are active → Always clear the previous timer on each change and cancel timers on unmount/close.
- Deleting OPFS data can fail due to browser restrictions or transient OPFS errors → Treat OPFS cleanup as best-effort; always delete the IndexedDB record and close the project, and surface an error state if cleanup fails.
