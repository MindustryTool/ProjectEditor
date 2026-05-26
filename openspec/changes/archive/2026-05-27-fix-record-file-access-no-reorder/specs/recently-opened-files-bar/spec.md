## MODIFIED Requirements

### Requirement: LRU recently opened files storage
The system SHALL maintain a list of recently opened file paths per project, ordered by first access, capped at 50 entries with automatic LRU eviction.

#### Scenario: Entry is added on file open
- **WHEN** user navigates to a file path in the editor
- **THEN** that path SHALL be added to the recently opened files list with current timestamp
- **AND** it SHALL appear as the last entry in the list

#### Scenario: Existing entry timestamp is updated on re-open
- **WHEN** user navigates to a file path already in the recently opened list
- **THEN** its `lastAccessedAt` SHALL be updated to current timestamp
- **AND** its position in the list SHALL remain unchanged

#### Scenario: LRU eviction when over 50 entries
- **WHEN** a new entry is added and the list already has 50 entries
- **THEN** the entry with the oldest `lastAccessedAt` SHALL be removed
- **AND** the new entry SHALL be added at the end of the list

#### Scenario: Data persists across sessions
- **WHEN** user reloads the page
- **THEN** the recently opened files list SHALL be restored from localStorage
- **AND** the order and timestamps SHALL match the last saved state
