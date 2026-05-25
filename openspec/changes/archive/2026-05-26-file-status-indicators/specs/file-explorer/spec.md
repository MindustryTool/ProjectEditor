## MODIFIED Requirements

### Requirement: File explorer renders directory tree
The system SHALL render a file explorer in the editor left panel showing the active Mindustry mod project directory structure as a collapsible tree, with validation status badges and buffer state indicators on files.

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

#### Scenario: Dirty file shows white dot
- **WHEN** a file has `isDirty === true` (unsaved in-memory edits)
- **THEN** its row SHALL show a white filled circle dot before the filename

#### Scenario: Saving file shows yellow dot
- **WHEN** a file has `isSaving === true` (write to disk in progress)
- **THEN** its row SHALL show a yellow filled circle dot before the filename, which takes visual precedence over the dirty dot

#### Scenario: Error state colors filename red
- **WHEN** a file has `isError === true` (write or read failure)
- **THEN** its filename SHALL be rendered in red text

#### Scenario: Warning state colors filename yellow
- **WHEN** a file has validation warnings but no errors
- **THEN** its filename SHALL be rendered in yellow text

#### Scenario: Dot priority
- **WHEN** a file has both `isDirty` and `isSaving` state
- **THEN** the saving (yellow) dot SHALL be displayed, not the dirty dot

#### Scenario: No dot for clean files
- **WHEN** a file has `isDirty === false` and `isSaving === false`
- **THEN** its row SHALL NOT show any status dot
