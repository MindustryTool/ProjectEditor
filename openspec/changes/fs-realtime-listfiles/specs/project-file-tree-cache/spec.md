## ADDED Requirements

### Requirement: listFiles queries are served from the VFS
The system SHALL answer `ProjectFileSystem.listFiles()` by querying the underlying `VirtualFileSystem` so results reflect current filesystem state.

#### Scenario: Repeated listFiles calls reflect underlying changes
- **WHEN** `listFiles(dir)` is called, and the underlying VFS contents under `dir` change between calls
- **THEN** subsequent `listFiles(dir)` calls MUST reflect the updated VFS contents

#### Scenario: listFiles supports recursive and non-recursive listing
- **WHEN** `listFiles(dir, { recursive: false })` is called
- **THEN** it MUST return only direct children under `dir`
- **WHEN** `listFiles(dir, { recursive: true })` is called
- **THEN** it MUST return all descendants under `dir`

## MODIFIED Requirements

### Requirement: ProjectFileSystem caches a project file tree snapshot
The system SHALL allow the application to build and retain an in-memory snapshot of the project file tree as `FileEntry[]` in `useProjectStore` for UI performance.

#### Scenario: Snapshot is built for UI without being a listFiles dependency
- **WHEN** a project is opened successfully
- **THEN** the project store MAY build an in-memory file tree snapshot for file tree UI
- **AND** `ProjectFileSystem.listFiles()` MUST NOT depend on this snapshot to return correct results

#### Scenario: Snapshot includes files and directories
- **WHEN** the snapshot is built
- **THEN** it MUST include entries for both files and directories reachable from the project root

## REMOVED Requirements

### Requirement: listFiles queries are served from the snapshot
**Reason**: Snapshot-backed listings can become stale when the underlying VFS changes outside snapshot refresh paths; `listFiles()` must reflect realtime VFS state.
**Migration**: Any caller needing stable results across multiple operations MUST take its own snapshot (store the result of `listFiles()` or maintain a store-level cache) rather than relying on `ProjectFileSystem` snapshot plumbing.

### Requirement: Tree mutation operations refresh the cached snapshot
**Reason**: Rebuilding a full-tree snapshot after every tree mutation is expensive and couples store/UI caching to filesystem operations.
**Migration**: Update caches using VFS watch events and/or rebuild snapshots on-demand (e.g., after UI-visible operations) instead of requiring automatic refresh after every mutation.
