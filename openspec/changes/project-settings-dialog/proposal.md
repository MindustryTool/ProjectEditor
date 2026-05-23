## Why

Project management actions are currently limited to create/open/change/close, forcing users to leave the editor (or use storage side effects) to rename or delete a project. A dedicated settings dialog makes project maintenance discoverable and safe.

## What Changes

- Add a “Project Settings” action in the toolbar Project menu that opens a settings dialog for the currently opened project.
- In the dialog, allow editing the project name with immediate persistence (no explicit Save button).
- Add a “Delete Project” action with a confirmation step; on delete, the project is removed from storage and the editor closes the current project context.
- Ensure all settings edits in the dialog are auto-saved with debounced persistence and inline validation feedback.

## Capabilities

### New Capabilities
- `project-settings-dialog`: UI dialog for editing current project metadata (rename) and performing destructive actions (delete) with auto-save behavior.

### Modified Capabilities
- `project-menu`: Add a new Project Settings entry (enabled only when a project is open) and wire it to the settings dialog.
- `toolbar-menus`: Project menu structure changes to include the Project Settings entry.

## Impact

- Web UI: new dialog component(s) under editor components; updates to ProjectMenu wiring and translation keys.
- Storage/state: reuse existing persistence APIs (`saveProject`, `deleteProject`) and project context close behavior; add a small rename flow if not already present.
- Validation: enforce existing project name schema/sanitization rules when editing the name.
