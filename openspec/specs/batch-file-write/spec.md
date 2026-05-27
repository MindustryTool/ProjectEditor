### Requirement: Batched parallel file writes
`ProjectFileSystem.writeFiles()` SHALL process entries in a two-phase approach: first create all required directories in parallel, then write file data in batches of 20 using `Promise.allSettled()`.

#### Scenario: Writes files in parallel batches
- **WHEN** `writeFiles()` is called with 45 entries
- **THEN** directories are created first via `Promise.all()`
- **THEN** files are written in 3 batches (20, 20, 5) via `Promise.allSettled()`

### Requirement: Directory deduplication
`writeFiles()` SHALL collect unique parent directory paths before creation to avoid redundant mkdir calls.

#### Scenario: Deduplicates directories
- **WHEN** `writeFiles()` is called with entries under the same subdirectory
- **THEN** mkdir is called exactly once for that directory

### Requirement: Graceful partial failure
If a file write fails within a batch, other writes SHALL continue. Failures SHALL be reported.

#### Scenario: One file fails, others succeed
- **WHEN** a batch of 20 files is written and one write rejects
- **THEN** the other 19 writes still complete
- **THEN** the caller receives an error indicating which entries failed

### Requirement: Single tree refresh
`writeFiles()` SHALL call `refreshTree(true)` exactly once, after all batches complete.

#### Scenario: Tree refreshed once
- **WHEN** `writeFiles()` completes
- **THEN** `refreshTree(true)` is called exactly once

### Requirement: Batched event emission
`writeFiles()` SHALL emit one `file:changed` event per file after each batch completes.

#### Scenario: Emits events per-file after batch
- **WHEN** 45 files are written in 3 batches
- **THEN** `file:changed` is emitted for each file after its batch completes
