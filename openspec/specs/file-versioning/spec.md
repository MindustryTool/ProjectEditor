## ADDED Requirements

### Requirement: Version pair prevents stale operations
The system SHALL maintain per-file `currentVersion` and `savedVersion` counters. `currentVersion` increments on each local edit; `savedVersion` syncs to `currentVersion` on successful disk write. The version pair is used to detect derived state and discard stale read/write completions.

#### Scenario: currentVersion increments on edit
- **WHEN** `writeBuffer` is called for a file
- **THEN** `currentVersion` SHALL increment by 1
- **AND** `savedVersion` SHALL remain unchanged

#### Scenario: savedVersion syncs on persist
- **WHEN** a disk write completes successfully
- **THEN** `savedVersion` SHALL be set to `currentVersion`

#### Scenario: Stale write completion discarded
- **WHEN** a write promise resolves but `currentVersion` is greater than when the write was enqueued
- **THEN** the completion SHALL be discarded (no state update)

#### Scenario: Stale read completion discarded
- **WHEN** a read promise resolves but `currentVersion` has changed since the read started
- **THEN** the result SHALL be discarded

#### Scenario: Version starts at 0
- **WHEN** a file is first loaded from disk
- **THEN** both `currentVersion` and `savedVersion` SHALL be set to 0

#### Scenario: Version NOT reset on readFile
- **WHEN** `readFile` loads content from disk for an existing entry
- **THEN** versions SHALL NOT be reset. `savedVersion` SHALL be set to `currentVersion` after successful read.
