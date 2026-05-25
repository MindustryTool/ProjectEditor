## ADDED Requirements

### Requirement: File status enum replaces boolean isLoading
The system SHALL use a `FileStatus` enum with states `idle | dirty | saving | error` instead of separate boolean flags, and track `savedAt` timestamp.

#### Scenario: Initial status is idle
- **WHEN** a file's content is loaded from disk
- **THEN** its status SHALL be `idle` and `savedAt` SHALL be set to the current timestamp

#### Scenario: Edit sets status to dirty
- **WHEN** `update()` is called (local edit)
- **THEN** the file's status SHALL change to `dirty`

#### Scenario: Write in progress sets status to saving
- **WHEN** the WriteQueue begins flushing a file's pending write
- **THEN** the file's status SHALL change to `saving`

#### Scenario: Write success sets status to idle
- **WHEN** a write completes successfully
- **THEN** the file's status SHALL change to `idle` and `savedAt` SHALL update to the current timestamp

#### Scenario: Write or read error sets status to error
- **WHEN** a write or read fails
- **THEN** the file's status SHALL change to `error`, the error message SHALL be stored, but `data` SHALL NOT be cleared

#### Scenario: Error cleared on next successful edit
- **WHEN** `update()` is called on a file with status `error`
- **THEN** the error SHALL be cleared and status SHALL change to `dirty`
