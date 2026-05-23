## ADDED Requirements

### Requirement: VirtualFileSystem interface
The system SHALL provide a `VirtualFileSystem` interface with methods for reading, writing, deleting, and managing files and directories.

#### Scenario: readFile returns file contents
- **WHEN** `readFile("/path/to/file")` is called
- **THEN** it returns a `Promise<ArrayBuffer>` with the file contents

#### Scenario: writeFile stores data
- **WHEN** `writeFile("/path/to/file", data)` is called with a `BufferSource`
- **THEN** the data is persisted at the given path

#### Scenario: delete removes a file
- **WHEN** `delete("/path/to/file")` is called
- **THEN** the file is removed from the filesystem

#### Scenario: mkdir creates a directory
- **WHEN** `mkdir("/path/to/dir")` is called
- **THEN** a directory is created at the given path

#### Scenario: readdir lists directory contents
- **WHEN** `readdir("/path/to/dir")` is called
- **THEN** it returns a `Promise<FileEntry[]>` with the directory contents

#### Scenario: stat returns file metadata
- **WHEN** `stat("/path/to/file")` is called
- **THEN** it returns a `Promise<FileStat>` with file metadata (name, size, kind, lastModified)

#### Scenario: exists checks path existence
- **WHEN** `exists("/path/to/file")` is called
- **THEN** it returns `true` if the path exists, `false` otherwise

#### Scenario: rename moves a file to a new name
- **WHEN** `rename("/old/path", "/new/path")` is called
- **THEN** the file at old path is moved to the new path

#### Scenario: move relocates a file to a different directory
- **WHEN** `move("/src/path", "/dst/path")` is called
- **THEN** the file is moved to the destination path

#### Scenario: copy duplicates a file
- **WHEN** `copy("/src/path", "/dst/path")` is called
- **THEN** a duplicate of the source file is created at the destination path

#### Scenario: watch subscribes to file changes
- **WHEN** `watch(callback)` is called
- **THEN** it returns an `Unsubscribe` function that stops watching when called

### Requirement: OPFSAdapter implements VirtualFileSystem
The system SHALL provide an `OPFSAdapter` class that implements `VirtualFileSystem` using the Origin Private File System.

#### Scenario: OPFSAdapter is constructed with a root handle
- **WHEN** `new OPFSAdapter(rootHandle)` is called with a `FileSystemDirectoryHandle`
- **THEN** all file operations are scoped to that root directory

#### Scenario: readFile resolves relative to root
- **WHEN** `readFile("mod.hjson")` is called
- **THEN** it reads from `<root>/mod.hjson` in the OPFS

#### Scenario: UnsupportedError thrown when OPFS unavailable
- **WHEN** OPFS is not available in the runtime
- **THEN** the adapter throws at construction with a clear error message

### Requirement: FileEntry and FileStat types
The system SHALL export `FileEntry` (name, kind) and `FileStat` (name, kind, size, lastModified) types for directory listings and file metadata.

#### Scenario: FileEntry has name and kind
- **WHEN** listing a directory
- **THEN** each entry has `{ name: string, kind: "file" | "directory" }`

#### Scenario: FileStat has full metadata
- **WHEN** calling `stat()` on a file
- **THEN** the result includes `name`, `kind`, `size` (number), and `lastModified` (Date)

### Requirement: FileWatchCallback and Unsubscribe types
The system SHALL export `FileWatchCallback` (receiving file path change events) and `Unsubscribe` (void function) types.

#### Scenario: FileWatchCallback receives paths
- **WHEN** a file changes
- **THEN** the callback is invoked with the changed file path

#### Scenario: Unsubscribe stops watching
- **WHEN** the returned `Unsubscribe` function is called
- **THEN** the watcher stops and the callback is no longer invoked
