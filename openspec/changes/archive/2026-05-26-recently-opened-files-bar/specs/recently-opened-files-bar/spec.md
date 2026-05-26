## ADDED Requirements

### Requirement: LRU recently opened files storage
The system SHALL maintain a list of recently opened file paths per project, ordered by most recent access, capped at 50 entries with automatic LRU eviction.

#### Scenario: Entry is added on file open
- **WHEN** user navigates to a file path in the editor
- **THEN** that path SHALL be added to the recently opened files list with current timestamp
- **AND** it SHALL appear as the first entry in the list

#### Scenario: Existing entry is updated on re-open
- **WHEN** user navigates to a file path already in the recently opened list
- **THEN** its `lastAccessedAt` SHALL be updated to current timestamp
- **AND** it SHALL be moved to the first position in the list

#### Scenario: LRU eviction when over 50 entries
- **WHEN** a new entry is added and the list already has 50 entries
- **THEN** the entry with the oldest `lastAccessedAt` SHALL be removed
- **AND** the new entry SHALL be added at position 0

#### Scenario: Data persists across sessions
- **WHEN** user reloads the page
- **THEN** the recently opened files list SHALL be restored from localStorage
- **AND** the order and timestamps SHALL match the last saved state

### Requirement: Recently opened files bar UI
The system SHALL render a horizontal bar of file tabs above the main editor content area, displaying recently opened files for the active project.

#### Scenario: Bar shows recently opened files
- **WHEN** a project is active and has recently opened files
- **THEN** a horizontal bar SHALL be displayed above the editor content
- **AND** it SHALL show file name entries ordered by recency (most recent first)

#### Scenario: Clicking a tab navigates to that file
- **WHEN** user clicks on a file tab in the recently opened bar
- **THEN** the editor SHALL navigate to that file path
- **AND** the file SHALL become the active editor content

#### Scenario: Close button removes entry
- **WHEN** user clicks the close button on a file tab
- **THEN** that file SHALL be removed from the recently opened list
- **AND** the store SHALL be updated immediately

#### Scenario: Current file is highlighted
- **WHEN** a file tab matches the currently open file path
- **THEN** that tab SHALL visually appear as active/selected

#### Scenario: Empty bar when no recent files
- **WHEN** there are no recently opened files for the active project
- **THEN** no bar SHALL be rendered (zero height)

### Requirement: Cross-project isolation
Recently opened files SHALL be tracked per project, so switching projects shows the correct file list.

#### Scenario: Different projects have different lists
- **WHEN** user switches from project A to project B
- **THEN** the recently opened files bar SHALL display project B's list
- **AND** SHALL NOT show any files from project A

#### Scenario: Switching back preserves list
- **WHEN** user switches back to project A
- **THEN** its recently opened files list SHALL be restored unchanged
