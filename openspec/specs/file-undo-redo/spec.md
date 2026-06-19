## ADDED Requirements

### Requirement: Undo/redo store with per-file history stack
The system SHALL maintain a zustand store (`UndoRedoStore`) that tracks undo/redo history per file using `projectId::path` keys. Each file SHALL have an independent history stack with a pointer (current index) for navigation.

#### Scenario: Store pushes snapshot before write
- **WHEN** `useFile().write()` is called
- **THEN** a snapshot of the file's current data SHALL be pushed onto the undo stack before the new content is written
- **AND** the current index SHALL advance to point to the new (just-pushed) entry

#### Scenario: Undo restores previous snapshot
- **WHEN** `undo(projectId, path)` is called and `canUndo` is true
- **THEN** the previous snapshot SHALL be written to the file store
- **AND** the current index SHALL decrement by 1

#### Scenario: Redo restores next snapshot
- **WHEN** `redo(projectId, path)` is called and `canRedo` is true
- **THEN** the next snapshot SHALL be written to the file store
- **AND** the current index SHALL increment by 1

#### Scenario: New edit after undo clears redo stack
- **WHEN** user undoes (moves index back) and then makes a new edit
- **THEN** all entries after the current index SHALL be discarded
- **AND** the new snapshot SHALL be appended as the latest entry

### Requirement: Bounded history at 50 entries
The undo history SHALL be capped at 50 entries per file. When the limit is exceeded the oldest entries SHALL be dropped.

#### Scenario: Pushing beyond max drops oldest
- **WHEN** the undo stack has 50 entries and a new snapshot is pushed
- **THEN** the oldest entry (index 0) SHALL be removed
- **AND** the stack SHALL remain at 50 entries

### Requirement: Undo/redo availability flags
The store SHALL expose derived `canUndo(projectId, path)` and `canRedo(projectId, path)` selectors.

#### Scenario: canUndo is false at initial state
- **WHEN** a file has no history entries
- **THEN** `canUndo` SHALL return false

#### Scenario: canUndo is true after edits
- **WHEN** a file has at least one snapshot and currentIndex is not at the first entry
- **THEN** `canUndo` SHALL return true

#### Scenario: canRedo is true after undo
- **WHEN** user undoes at least once and no new edit has been made
- **THEN** `canRedo` SHALL return true

#### Scenario: canRedo is false at initial or latest state
- **WHEN** no undo has been performed, or all undos have been consumed
- **THEN** `canRedo` SHALL return false

### Requirement: Edit menu shows Undo/Redo items
The EditMenu SHALL display Undo and Redo items with keyboard shortcut labels and disabled state when not available.

#### Scenario: Undo/Redo items in Edit menu
- **WHEN** the Edit menu is opened
- **THEN** it SHALL display "Undo" and "Redo" items with respective keyboard shortcut hints
- **AND** items SHALL be disabled when `canUndo` or `canRedo` is false respectively

#### Scenario: Undo item triggers undo
- **WHEN** user clicks the Undo menu item
- **THEN** `undo(projectId, path)` SHALL be called for the current file

#### Scenario: Redo item triggers redo
- **WHEN** user clicks the Redo menu item
- **THEN** `redo(projectId, path)` SHALL be called for the current file

### Requirement: Global keyboard shortcuts
The system SHALL register Ctrl+Z for undo and Ctrl+Shift+Z for redo as global keyboard shortcuts.

#### Scenario: Ctrl+Z triggers undo
- **WHEN** user presses Ctrl+Z while a text file is active
- **THEN** undo SHALL be performed for the active file
- **AND** SHALL NOT fire when focus is on input/textarea/select elements

#### Scenario: Ctrl+Shift+Z triggers redo
- **WHEN** user presses Ctrl+Shift+Z while a text file is active
- **THEN** redo SHALL be performed for the active file
- **AND** SHALL NOT fire when focus is on input/textarea/select elements
