## ADDED Requirements

### Requirement: Editor page layout
The system SHALL provide an EditorPage component that arranges the toolbar, left panel, editor area, right panel, and status bar in a VS Code-inspired layout using CSS flexbox.

#### Scenario: Full layout renders
- **WHEN** the EditorPage is mounted
- **THEN** the toolbar SHALL be visible at the top, status bar at the bottom, and three-column panel layout in between

#### Scenario: Left panel resized
- **WHEN** user drags the left panel resize handle horizontally
- **THEN** the left panel width SHALL update in real time, constrained to min/max bounds

### Requirement: Reusable layout primitives
The system SHALL export Toolbar, StatusBar, Panel, and SplitView as reusable components.

#### Scenario: Components exported
- **WHEN** importing from the layout module
- **THEN** Toolbar, StatusBar, Panel, and SplitView SHALL be available as named exports
