## ADDED Requirements

### Requirement: Tree mutation operations refresh the cached snapshot
The system SHALL refresh the cached project file tree snapshot after any `ProjectFileSystem` operation that can change the tree structure.

#### Scenario: Snapshot updates after creating a directory
- **WHEN** `ProjectFileSystem.mkdir(path)` resolves successfully
- **THEN** the cached snapshot MUST include a directory entry for `path`

#### Scenario: Snapshot updates after deleting an entry
- **WHEN** `ProjectFileSystem.delete(path)` resolves successfully
- **THEN** the cached snapshot MUST NOT include an entry for `path`

## MODIFIED Requirements

### Requirement: ProjectFileSystem caches a project file tree snapshot
The system SHALL build and retain an in-memory snapshot of the project file tree as `FileEntry[]` in `useProjectStore`.

#### Scenario: Snapshot is built when creating ProjectFileSystem
- **WHEN** `createProjectFileSystem(projectInfo)` resolves successfully
- **THEN** the project store MUST have an in-memory file tree snapshot available for `ProjectFileSystem.listFiles()` queries

#### Scenario: Snapshot includes files and directories
- **WHEN** the snapshot is built
- **THEN** it MUST include entries for both files and directories reachable from the project root

### Requirement: listFiles queries are served from the snapshot
The system SHALL answer `ProjectFileSystem.listFiles()` by querying the cached snapshot stored in `useProjectStore`.

#### Scenario: Repeated listFiles calls are consistent
- **WHEN** `listFiles(dir)` is called multiple times without refreshing the snapshot
- **THEN** it MUST return consistent results for the same `dir` and `recursive` option

#### Scenario: listFiles filters by directory prefix
- **WHEN** `listFiles("content")` is called
- **THEN** every returned entry MUST have a `path` under `/projects/<project.id>/content/`
