### Requirement: File write event
The system SHALL emit a `"file:write"` event when a file's content is written to disk.

#### Scenario: Single file write
- **WHEN** `writeFile(path, data)` completes successfully
- **THEN** a `"file:write"` event is emitted with `{ path: string }`

#### Scenario: Batch file write
- **WHEN** `writeFiles(entries)` completes writing each entry
- **THEN** a `"file:write"` event is emitted per entry with `{ path: string }`

### Requirement: File delete event
The system SHALL emit a `"file:delete"` event when a file or directory is deleted.

#### Scenario: File deletion
- **WHEN** `delete(path)` completes successfully
- **THEN** a `"file:delete"` event is emitted with `{ path: string }`

### Requirement: File rename event
The system SHALL emit a `"file:rename"` event when a file or directory is renamed.

#### Scenario: File rename
- **WHEN** `rename(oldPath, newPath)` completes successfully
- **THEN** a `"file:rename"` event is emitted with `{ oldPath: string; newPath: string }`

#### Scenario: File move emits rename
- **WHEN** `move(src, dst)` completes successfully
- **THEN** a single `"file:rename"` event is emitted with `{ oldPath: src; newPath: dst }`

### Requirement: File create event
The system SHALL emit a `"file:create"` event when a new file is created.

#### Scenario: Copy emits create
- **WHEN** `copy(src, dst)` completes successfully
- **THEN** a single `"file:create"` event is emitted with `{ path: dst }`

#### Scenario: createFile emits create
- **WHEN** `createFile(path)` completes successfully
- **THEN** a single `"file:create"` event is emitted with `{ path }`

### Requirement: Directory create event
The system SHALL emit a `"file:mkdir"` event when a directory is created.

#### Scenario: Directory creation
- **WHEN** `mkdir(path)` completes successfully
- **THEN** a `"file:mkdir"` event is emitted with `{ path: string }`

### Requirement: No duplicate events
Each file operation SHALL emit exactly one event, not multiple redundant events.

#### Scenario: createFile emits once
- **WHEN** `createFile(path)` is called
- **THEN** exactly one event (`"file:create"`) is emitted (not also `"file:write"`)