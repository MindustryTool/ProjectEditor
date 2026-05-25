## ADDED Requirements

### Requirement: File version counter prevents stale operations
The system SHALL maintain a per-file monotonic version counter that increments on each local edit, used to detect and discard stale read/write completions.

#### Scenario: Version increments on edit
- **WHEN** `update("new content")` is called for a file
- **THEN** the file's version counter SHALL increment by 1

#### Scenario: Stale write completion discarded
- **WHEN** a write promise resolves with an old version number that is less than the current version
- **THEN** the completion SHALL be discarded (no state update)

#### Scenario: Stale read completion discarded
- **WHEN** a read promise resolves with an old version number that is less than the current version
- **THEN** the result SHALL be discarded (the file was modified locally after the read started)

#### Scenario: Version starts at 0
- **WHEN** a file is first loaded from disk
- **THEN** its version SHALL be set to 0
