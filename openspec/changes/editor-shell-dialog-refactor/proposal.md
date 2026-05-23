## Why

EditorPage and EditorShell currently coordinate project-picker / settings dialog state via props and local state, causing avoidable props drilling and coupling between the shell layout and feature-specific UI flows. This makes the editor UI harder to evolve and reason about.

## What Changes

- Move hook usage and state to the components that directly use it instead of passing callbacks/state through EditorShell.
- Remove dialog-open state management from EditorShell (remove pickerOpen, pickerMode, settingsOpen).
- Co-locate the project picker and project settings dialogs with the UI entry points that open them, using shadcn Dialog patterns (trigger-controlled) instead of custom open-state wiring.
- Keep EditorShell focused on composing the editor chrome (toolbar, split view, status bar) with minimal business logic.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- None

## Impact

- Web editor components: EditorPage, EditorShell, ProjectMenu, ProjectPickerDialog, ProjectSettingsDialog, and any menu/toolbar composition that currently depends on “open dialog” callbacks.
- State management boundaries: shifts responsibility from page/shell props into the menu/dialog components that need it.
