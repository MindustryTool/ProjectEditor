## ADDED Requirements

### Requirement: ProjectFileSystem caches a project file tree snapshot
The system SHALL build and retain an in-memory snapshot of the project file tree as `FileEntry[]`.

#### Scenario: Snapshot is built when creating ProjectFileSystem
- **WHEN** `createProjectFileSystem(projectInfo)` resolves successfully
- **THEN** the returned `ProjectFileSystem` instance has an in-memory file tree snapshot available for `listFiles()` queries

#### Scenario: Snapshot includes files and directories
- **WHEN** the snapshot is built
- **THEN** it MUST include entries for both files and directories reachable from the project root

### Requirement: listFiles queries are served from the snapshot
The system SHALL answer `ProjectFileSystem.listFiles()` by querying the cached snapshot.

#### Scenario: Repeated listFiles calls are consistent
- **WHEN** `listFiles(dir)` is called multiple times without refreshing the snapshot
- **THEN** it MUST return consistent results for the same `dir` and `recursive` option

#### Scenario: listFiles filters by directory prefix
- **WHEN** `listFiles("content")` is called
- **THEN** every returned entry MUST have a `path` under `/projects/<project.id>/content/`
