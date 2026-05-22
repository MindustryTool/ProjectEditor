## ADDED Requirements

### Requirement: File explorer renders directory tree
The system SHALL render a file explorer in the editor left panel showing the Mindustry mod project directory structure as a collapsible tree.

#### Scenario: Tree displays all top-level items
- **WHEN** the editor page renders
- **THEN** the file explorer SHALL display: `mod.hjson`, `content`, `maps`, `bundles`, `sounds`, `schematics`, `scripts`, `sprites-override`, `sprites`

#### Scenario: Folders are expandable
- **WHEN** the user clicks a folder item
- **THEN** the folder SHALL expand to show its children or collapse if already expanded

#### Scenario: Content folder has subdirectories
- **WHEN** the `content` folder is expanded
- **THEN** it SHALL show: `items`, `blocks`, `liquids`, `units`

#### Scenario: File items show file icon
- **WHEN** a file item (e.g., `mod.hjson`) is rendered
- **THEN** it SHALL display a file icon next to the name

#### Scenario: Folder items show folder icon
- **WHEN** a folder item is rendered
- **THEN** it SHALL display a folder icon next to the name

### Requirement: Selected item is highlighted
The system SHALL visually highlight the currently selected file or folder in the explorer tree.

#### Scenario: Clicked item is highlighted
- **WHEN** the user clicks a file or folder
- **THEN** that item SHALL receive a highlighted/active background style

### Requirement: Selection synced to URL
The system SHALL sync the selected path to a `?path=` URL query parameter.

#### Scenario: URL updates on selection
- **WHEN** the user clicks `content/items`
- **THEN** the URL SHALL update to `?path=content/items`

#### Scenario: Initial selection from URL
- **WHEN** the user navigates to the editor with `?path=mod.hjson` in the URL
- **THEN** the file explorer SHALL highlight `mod.hjson` on mount
