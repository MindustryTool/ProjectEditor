## ADDED Requirements

### Requirement: ProjectFileSystem can list files under a directory
The system SHALL provide a `ProjectFileSystem.listFiles()` convenience method that returns file paths contained in a directory.

#### Scenario: Lists only direct files by default
- **WHEN** `listFiles(dir)` is called without options
- **THEN** it returns only files that are direct children of `dir`
- **AND** it MUST NOT include directory entries in the result

#### Scenario: Can list files recursively
- **WHEN** `listFiles(dir, { recursive: true })` is called
- **THEN** it returns files contained in `dir` and all nested subdirectories
- **AND** each returned path MUST be relative to the project root

#### Scenario: Normalizes input and output paths
- **WHEN** `listFiles()` is called with `""`, `"/"`, `"subdir"`, or `"/subdir"`
- **THEN** it MUST treat these inputs consistently with existing `ProjectFileSystem` path scoping rules
- **AND** it MUST return paths without a leading `/`
