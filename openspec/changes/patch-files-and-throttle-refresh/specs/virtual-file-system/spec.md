## ADDED Requirements

### Requirement: writeFiles batch writes multiple entries
The system SHALL provide a `ProjectFileSystem.writeFiles(entries)` method that accepts an array of `{ name: string; data: Uint8Array }` entries, writes them all to disk, creates parent directories as needed, and refreshes the tree once after all writes complete.

#### Scenario: Writes all entries to disk
- **WHEN** `writeFiles([{ name: "a.txt", data: ... }, { name: "sub/b.txt", data: ... }])` is called
- **THEN** both files SHALL be written to the project scope
- **AND** the tree snapshot SHALL be refreshed exactly once after all writes

#### Scenario: Creates parent directories
- **WHEN** an entry has a path with subdirectories (e.g., `"content/blocks.json"`)
- **THEN** the parent directory (`"content/"`) SHALL be created automatically if it doesn't exist

#### Scenario: Works with import result entries
- **WHEN** `writeFiles` is called with `ImportResult.entries` (which have `{ name: string; data: Uint8Array }` shape)
- **THEN** all files are written successfully without additional path processing

### Requirement: refreshTree is debounced
The system SHALL debounce `refreshTree()` calls so that rapid successive invocations coalesce into a single tree refresh, preventing excessive UI re-renders.

#### Scenario: Rapid calls coalesce into one refresh
- **WHEN** `refreshTree()` is called multiple times within 50ms
- **THEN** the tree snapshot SHALL be updated only once after the last call

#### Scenario: Force parameter bypasses debounce
- **WHEN** `refreshTree(true)` is called
- **THEN** the tree snapshot SHALL be updated immediately, regardless of any pending debounce
