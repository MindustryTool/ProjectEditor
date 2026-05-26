## ADDED Requirements

### Requirement: `recordFileAccess` SHALL skip directories
`recordFileAccess()` SHALL NOT record a path if it corresponds to a directory in `treeSnapshot`. The check SHALL use the session store's `treeSnapshot` to determine the type of each path.

#### Scenario: File path is recorded
- **WHEN** `recordFileAccess()` is called with a path that has a matching entry in `treeSnapshot` with `kind === "file"`
- **THEN** the path SHALL be added to `recentlyOpenedFiles`

#### Scenario: Directory path is skipped
- **WHEN** `recordFileAccess()` is called with a path that has a matching entry in `treeSnapshot` with `kind === "directory"` OR has no matching entry
- **THEN** the path SHALL NOT be added to `recentlyOpenedFiles`

#### Scenario: Folder click in RecentlyOpenedFilesBar does not record
- **WHEN** a user clicks a folder tab in the recently-opened files bar
- **THEN** the path SHALL be set via query param but SHALL NOT be recorded via `recordFileAccess()`
