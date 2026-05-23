## ADDED Requirements

### Requirement: Editor page layout
The system SHALL provide an EditorPage component that renders either the toolbar + split-panel layout (with a project active) or the project picker screen (when no project is open).

#### Scenario: Full layout renders with project
- **WHEN** the EditorPage is mounted and a project is active
- **THEN** the toolbar SHALL be visible at the top, status bar at the bottom, and three-column panel layout in between

#### Scenario: Left panel resized
- **WHEN** user drags the left panel resize handle horizontally
- **THEN** the left panel width SHALL update in real time, constrained to min/max bounds

### Requirement: Reusable layout primitives
The system SHALL export Toolbar, StatusBar, Panel, and SplitView as reusable components.

#### Scenario: Components exported
- **WHEN** importing from the layout module
- **THEN** Toolbar, StatusBar, Panel, and SplitView SHALL be available as named exports

### Requirement: Explorer panel shows file tree
The EditorPage's left panel SHALL render the FileExplorer component instead of a hardcoded placeholder list.

#### Scenario: Explorer panel renders FileExplorer
- **WHEN** the EditorPage is mounted
- **THEN** the left panel header SHALL show "Explorer" and the content SHALL be the FileExplorer component with the Mindustry mod directory tree

### Requirement: Editor page uses translated text
The EditorPage SHALL use translation keys for all user-facing strings instead of hardcoded English text.

#### Scenario: Placeholder text is translatable
- **WHEN** the EditorPage shows placeholder content (e.g. "Select a file to start editing")
- **THEN** the text SHALL be rendered via `t()` with a translation key

### Requirement: Editor panels react to file selection
The EditorPage layout SHALL react to the selected file path and show or hide the center and right panels accordingly.

#### Scenario: Panels hidden when no file selected
- **WHEN** no file is selected in the file explorer (`?path=` is absent)
- **THEN** the SplitView SHALL render only the left (explorer) panel; center and right panels SHALL not be visible

#### Scenario: Panels shown when file selected
- **WHEN** a known file path is selected
- **THEN** the center panel SHALL show the appropriate editor and the right panel SHALL show properties

### Requirement: Conditional layout based on project state
The EditorPage SHALL conditionally render either the SplitView (when a project is active) or the ProjectPickerScreen (when no project is open), instead of always rendering the SplitView.

#### Scenario: SplitView shown when project active
- **WHEN** `projectContext` is not null
- **THEN** the EditorPage SHALL render Toolbar, SplitView, and StatusBar as before

#### Scenario: Welcome screen shown when no project
- **WHEN** `projectContext` is null
- **THEN** the EditorPage SHALL render the ProjectPickerScreen and NOT render the SplitView
