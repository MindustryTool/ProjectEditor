## ADDED Requirements

### Requirement: Per-project file buffer cache
The file content store SHALL key file buffers by `(projectId, path)` tuple instead of path alone, so switching projects preserves in-memory buffers.

#### Scenario: Cache keyed by projectId and path
- **WHEN** two projects each have a file named `mod.hjson`
- **THEN** their buffer entries SHALL be distinct and isolated in the store

#### Scenario: Buffer preserved on project switch
- **WHEN** the user switches from project A to project B and back to project A
- **THEN** the in-memory buffer for project A's files SHALL be preserved (including unsaved edits)

#### Scenario: Buffer cleared on explicit close
- **WHEN** `closeProject()` is called or project A's cleanup is triggered
- **THEN** the buffers for project A SHALL be removed from the store

### Requirement: LRU eviction for file buffers
The store SHALL enforce a configurable maximum number of cached file entries (default 100). When the limit is exceeded, the least recently used entry SHALL be evicted.

#### Scenario: Oldest entry evicted on overflow
- **WHEN** a new file buffer is written and the cache size exceeds `maxEntries`
- **THEN** the entry with the oldest access time SHALL be evicted from the store

#### Scenario: ReadFile bumps LRU order
- **WHEN** `readFile` is called for an existing cached entry
- **THEN** that entry SHALL be marked as recently used (bumped to end of LRU order)

#### Scenario: WriteBuffer bumps LRU order
- **WHEN** `writeBuffer` is called for an existing cached entry
- **THEN** that entry SHALL be marked as recently used

#### Scenario: Explicit clear removes from LRU
- **WHEN** `clearFileContent(path)` is called
- **THEN** the entry SHALL be removed from the cache and does NOT count toward the LRU limit

### Requirement: Configurable max cache size
The LRU cache SHALL accept a `maxEntries` configuration option (default 100).

#### Scenario: Default max entries
- **WHEN** no `maxEntries` is specified
- **THEN** the cache SHALL default to 100 entries

#### Scenario: Custom max entries
- **WHEN** `maxEntries` is set to 50
- **THEN** the cache SHALL evict when size exceeds 50 entries
