## MODIFIED Requirements

### Requirement: File explorer renders directory tree
The system SHALL render a file explorer in the editor left panel showing the active Mindustry mod project directory structure as a collapsible tree, with validation status badges on files.

#### Scenario: Tree displays top-level items from the project snapshot
- **WHEN** the editor page renders with a project file-tree snapshot containing entries at the project root
- **THEN** the file explorer SHALL display one item per distinct top-level file or folder present in that snapshot

#### Scenario: Folders are expandable
- **WHEN** the user clicks a folder item
- **THEN** the folder SHALL expand to show its children or collapse if already expanded

#### Scenario: Expanded folders reflect snapshot children
- **WHEN** a folder is expanded
- **THEN** it SHALL show the direct child files and folders that exist under that folder in the project snapshot

#### Scenario: File items show file icon
- **WHEN** a file item (e.g., `mod.hjson`) is rendered
- **THEN** it SHALL display a file icon next to the name

#### Scenario: Folder items show folder icon
- **WHEN** a folder item is rendered
- **THEN** it SHALL display a folder icon next to the name

#### Scenario: File items show validation badge
- **WHEN** a file item has validation results with "error" or "warning" severity
- **THEN** it SHALL display a colored badge (red for errors, yellow for warnings) with the count

#### Scenario: Validation badge clears
- **WHEN** validation re-runs and a file's error/warning results become empty
- **THEN** the badge SHALL be removed

### Requirement: Selected item is highlighted
The system SHALL visually highlight the currently selected item in the explorer tree based on the `?path=` URL query parameter.

#### Scenario: Selected file is highlighted
- **WHEN** the URL contains `?path=<file-path>` that matches an existing file in the tree
- **THEN** the file explorer SHALL highlight that file item on mount

#### Scenario: Folder clicks do not change selection highlight
- **WHEN** the user clicks a folder item
- **THEN** the file explorer SHALL NOT change which item is highlighted

### Requirement: Selection synced to URL
The system SHALL sync the selected file path to a `?path=` URL query parameter.

#### Scenario: URL updates on file selection
- **WHEN** the user clicks a file item (e.g., `content/items/some-file.hjson`)
- **THEN** the URL SHALL update to `?path=content/items/some-file.hjson`

#### Scenario: URL does not update on folder selection
- **WHEN** the user clicks a folder item (e.g., `content/items`)
- **THEN** the URL SHALL NOT change its `?path=` value
