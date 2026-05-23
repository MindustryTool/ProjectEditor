## 1. UI Wiring

- [x] 1.1 Add a new Project Settings menu item to ProjectMenu (new prop callback + disabled state when no project)
- [x] 1.2 Mount a ProjectSettingsDialog in EditorShell and wire ProjectMenu → dialog open/close state
- [x] 1.3 Add i18n keys for the new menu item and dialog UI (title, labels, delete confirmation)

## 2. Project Rename (Auto-Save)

- [x] 2.1 Implement ProjectSettingsDialog with a name input prefilled from the current project context
- [x] 2.2 Add project name validation (reuse ProjectInfoSchema name constraints) and inline error presentation
- [x] 2.3 Implement debounced auto-save: persist updated name via saveProject(...) and keep project context/status bar updated

## 3. Project Deletion

- [x] 3.1 Add a “Delete Project” button in ProjectSettingsDialog and a confirmation prompt using alert-dialog primitives
- [x] 3.2 Implement delete flow: deleteProject(projectId), best-effort OPFS cleanup for /projects/{projectId}, then close the current project context
- [x] 3.3 Ensure UI state resets correctly after delete (dialog closed, menu usable, no stale project name shown)

## 4. Tests

- [x] 4.1 Add a ProjectMenu test for the Project Settings item rendering and disabled behavior
- [x] 4.2 Add a ProjectSettingsDialog test for name validation and auto-save triggering (with mocked storage)
- [x] 4.3 Add a ProjectSettingsDialog test for delete confirmation behavior (cancel vs confirm)

## 5. Verification

- [x] 5.1 Manual check: rename persists and updates status bar without explicit Save
- [x] 5.2 Manual check: delete removes the project from the picker list and closes the editor project context
