## MODIFIED Requirements

### Requirement: File rename via inline edit
The system SHALL allow users to rename a file or folder by clicking a rename action button, entering a new name inline, and confirming the change. The rename button SHALL NOT be shown on default project tree items.

#### Scenario: Rename button visible on hover (desktop)
- **WHEN** the user hovers over a non-default file or folder row in the file explorer on a desktop device
- **THEN** the row SHALL show a Pencil icon button on the right side of the row

#### Scenario: Rename button visible on selected row (touch)
- **WHEN** the user selects a non-default file or folder row on a touch device
- **THEN** the row SHALL show a Pencil icon button on the right side of the row

#### Scenario: No rename button on default tree files
- **WHEN** the user hovers over or selects a default project tree file (e.g., `mod.hjson`)
- **THEN** the row SHALL NOT show the Pencil rename button

#### Scenario: No rename button on default tree folders
- **WHEN** the user hovers over or selects a default project tree folder (e.g., `content`, `maps`)
- **THEN** the row SHALL NOT show the Pencil rename button

#### Scenario: Clicking rename enters inline edit mode
- **WHEN** the user clicks the rename button on a non-default file or folder row
- **THEN** the filename text SHALL be replaced by an `<input>` element pre-filled with the current name, and the input SHALL be focused

#### Scenario: Confirm rename with Enter
- **WHEN** the user presses Enter while in inline rename mode
- **THEN** the system SHALL call `project.fs.rename(oldPath, newPath)` and on success exit inline mode with the new name displayed; if the new path already exists, SHALL show an error toast

#### Scenario: Confirm rename on blur
- **WHEN** the user clicks outside the rename input (blur)
- **THEN** the system SHALL confirm the rename (same as Enter behavior)

#### Scenario: Cancel rename with Escape
- **WHEN** the user presses Escape while in inline rename mode
- **THEN** the system SHALL cancel the rename and restore the original filename

#### Scenario: Rename applies extension changes
- **WHEN** the user renames a file and the provided new name changes, adds, or removes the file extension
- **THEN** the system SHALL use the provided name as the target filename when calling `project.fs.rename(oldPath, newPath)` and SHALL NOT force the original extension to be preserved

#### Scenario: Rename folder name
- **WHEN** the user renames a folder
- **THEN** the `<input>` SHALL be pre-filled with the full folder name (folders have no extension)

#### Scenario: Selected path updates on rename
- **WHEN** the currently opened file is renamed successfully
- **THEN** the `?path=` URL query parameter SHALL update to reflect the new path

### Requirement: File/folder remove with confirmation
The system SHALL allow users to delete a file or folder by clicking a remove button, confirming the action, then executing the delete. The remove button SHALL NOT be shown on default project tree items.

#### Scenario: Remove button visible on hover (desktop)
- **WHEN** the user hovers over a non-default file or folder row in the file explorer on a desktop device
- **THEN** the row SHALL show a Trash2 icon button on the right side of the row

#### Scenario: Remove button visible on selected row (touch)
- **WHEN** the user selects a non-default file or folder row on a touch device
- **THEN** the row SHALL show a Trash2 icon button on the right side of the row

#### Scenario: No remove button on default tree files
- **WHEN** the user hovers over or selects a default project tree file (e.g., `mod.hjson`)
- **THEN** the row SHALL NOT show the Trash2 remove button

#### Scenario: No remove button on default tree folders
- **WHEN** the user hovers over or selects a default project tree folder (e.g., `content`, `maps`)
- **THEN** the row SHALL NOT show the Trash2 remove button

#### Scenario: Clicking remove shows confirmation dialog
- **WHEN** the user clicks the remove button on a non-default file or folder row
- **THEN** the system SHALL show an AlertDialog with the filename displayed and "Delete" / "Cancel" buttons

#### Scenario: Confirm delete executes remove
- **WHEN** the user clicks "Delete" in the confirmation dialog
- **THEN** the system SHALL call `project.fs.delete(path)` and on success remove the item from the tree

#### Scenario: Cancel delete dismisses dialog
- **WHEN** the user clicks "Cancel" or clicks outside the AlertDialog
- **THEN** the dialog SHALL close without deleting

#### Scenario: Folder delete is recursive
- **WHEN** the user confirms deletion of a folder
- **THEN** the system SHALL delete the folder and all its contents recursively

#### Scenario: Error on delete shows feedback
- **WHEN** the delete operation fails (e.g., permission denied)
- **THEN** the system SHALL show a toast or inline error message

#### Scenario: Delete removes from file content cache
- **WHEN** a file is deleted
- **THEN** the `file:changed` delete event SHALL trigger `clearFileContent` in `FileContentStore`
