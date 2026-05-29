## ADDED Requirements

### Requirement: File explorer renders directory tree
The system SHALL render a file explorer in the editor left panel showing the active Mindustry mod project directory structure as a collapsible tree, with validation status badges, buffer state indicators, and action buttons on each row. The Plus (+) create button SHALL remain directly visible on folder rows. The Rename and Delete actions SHALL be accessible via an ellipsis (`MoreHorizontal`) dropdown menu.

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

#### Scenario: Ellipsis button visible on hover (desktop)
- **WHEN** the user hovers over a non-default file or folder row on a desktop device
- **THEN** the row SHALL show a `MoreHorizontal` ellipsis icon button on the right side

#### Scenario: Ellipsis button visible on selected row (touch)
- **WHEN** the user selects a non-default file or folder row on a touch device
- **THEN** the row SHALL show a `MoreHorizontal` ellipsis icon button on the right side

#### Scenario: Ellipsis opens dropdown with Rename and Delete
- **WHEN** the user clicks the ellipsis button
- **THEN** a dropdown menu SHALL open containing "Rename" and "Delete" items

#### Scenario: Rename in dropdown enters inline edit
- **WHEN** the user clicks "Rename" in the ellipsis dropdown
- **THEN** the row SHALL enter inline rename mode (not select the file)

#### Scenario: Delete in dropdown shows confirmation
- **WHEN** the user clicks "Delete" in the ellipsis dropdown
- **THEN** the system SHALL show a delete confirmation dialog

#### Scenario: Action buttons do not trigger file select
- **WHEN** the user clicks the Plus, ellipsis, or a dropdown item
- **THEN** the click SHALL NOT change the selected path or expand/collapse the folder

### Requirement: Folder rows show create button
Each folder row in the file explorer SHALL display a "+" create button that opens the create file dialog scoped to that folder's path.

#### Scenario: Create button visible on hover (desktop)
- **WHEN** the user hovers over a folder row in the file explorer on a desktop device
- **THEN** the row SHALL show a "+" (Plus) icon button on the right side of the row

#### Scenario: Create button visible on selected row (touch)
- **WHEN** the user selects a folder row on a touch device
- **THEN** the row SHALL show a "+" (Plus) icon button on the right side of the row

#### Scenario: Create button visible on root node
- **WHEN** the user hovers over or selects the root folder node
- **THEN** the row SHALL show the "+" create button

#### Scenario: Create button opens dialog scoped to folder
- **WHEN** the user clicks the "+" button on a folder row
- **THEN** the create file dialog SHALL open with that folder's path as the target directory

#### Scenario: Create button does not trigger expand/collapse
- **WHEN** the user clicks the "+" button on a folder
- **THEN** the click SHALL NOT expand or collapse the folder

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
