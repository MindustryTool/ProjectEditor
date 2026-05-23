## ADDED Requirements

### Requirement: Conditional layout based on project state
The EditorPage SHALL conditionally render either the SplitView (when a project is active) or the ProjectPickerScreen (when no project is open), instead of always rendering the SplitView.

#### Scenario: SplitView shown when project active
- **WHEN** `projectContext` is not null
- **THEN** the EditorPage SHALL render Toolbar, SplitView, and StatusBar as before

#### Scenario: Welcome screen shown when no project
- **WHEN** `projectContext` is null
- **THEN** the EditorPage SHALL render the ProjectPickerScreen and NOT render the SplitView

## MODIFIED Requirements

### Requirement: Editor page layout
The system SHALL provide an EditorPage component that renders either the toolbar + split-panel layout (with a project) or the project picker screen (without a project).

#### Scenario: Full layout renders with project
- **WHEN** the EditorPage is mounted and a project is active
- **THEN** the toolbar SHALL be visible at the top, status bar at the bottom, and three-column panel layout in between
