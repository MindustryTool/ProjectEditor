## MODIFIED Requirements

### Requirement: ProjectFileSystem convenience API
The system SHALL provide a `ProjectFileSystem` class that wraps `VirtualFileSystem` with project-scoped paths and text/JSON convenience methods.

#### Scenario: Constructor accepts ProjectInfo and VirtualFileSystem
- **WHEN** `new ProjectFileSystem(projectInfo, vfs)` is called
- **THEN** it stores both the project info and the underlying filesystem

#### Scenario: Paths are scoped to project root
- **WHEN** a method is called with a relative path like `"mod.hjson"`
- **THEN** the path is internally prefixed with `/projects/<project.id>/` before delegating to the underlying VFS

#### Scenario: readTextFile decodes text
- **WHEN** `readTextFile("mod.hjson")` is called
- **THEN** it returns the file contents as a decoded UTF-8 string

#### Scenario: writeTextFile encodes text
- **WHEN** `writeTextFile("mod.hjson", "content")` is called
- **THEN** the string is UTF-8 encoded and written to the scoped path

#### Scenario: readJsonFile parses JSON
- **WHEN** `readJsonFile<Config>("config.json")` is called
- **THEN** it returns the parsed JSON object typed as `Config`

#### Scenario: writeJsonFile serializes JSON
- **WHEN** `writeJsonFile("config.json", data)` is called
- **THEN** the data is serialized as pretty-printed JSON and written

#### Scenario: Delegates all VFS methods with scoped paths
- **WHEN** any `VirtualFileSystem` method (readFile, writeFile, delete, mkdir, readdir, stat, exists, rename, move, copy, watch) is called
- **THEN** the call is delegated to the underlying VFS with the project root prefix applied to all path arguments

#### Scenario: listFiles lists entries
- **WHEN** `listFiles(dir)` is called without options
- **THEN** it returns entries that are direct children of `dir`
- **AND** it MUST include both files and directories in the result

#### Scenario: listFiles can be recursive
- **WHEN** `listFiles(dir, { recursive: true })` is called
- **THEN** it returns entries contained in `dir` and all nested subdirectories

#### Scenario: listFiles returns full-path entries
- **WHEN** `listFiles(dir)` is called
- **THEN** each returned entry MUST include `{ name, kind, path }`
- **AND** `path` MUST be the full scoped VFS path (including the `/projects/<project.id>/` prefix)

#### Scenario: listFiles normalizes paths
- **WHEN** `listFiles()` is called with `""`, `"/"`, `"subdir"`, or `"/subdir"`
- **THEN** it MUST treat these inputs consistently with existing `ProjectFileSystem` path scoping rules

### Requirement: FileEntry and FileStat types
The system SHALL export `FileEntry` (name, path, kind) and `FileStat` (name, kind, size, lastModified) types for directory listings and file metadata.

#### Scenario: FileEntry has name, path, and kind
- **WHEN** listing a directory
- **THEN** each entry has `{ name: string, path: string, kind: "file" | "directory" }`
- **AND** `path` MUST be a full VFS path (including leading `/`)

#### Scenario: FileStat has full metadata
- **WHEN** calling `stat()` on a file
- **THEN** the result includes `name`, `kind`, `size` (number), and `lastModified` (Date)
