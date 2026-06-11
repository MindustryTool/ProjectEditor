## ADDED Requirements

### Requirement: Region-snapshot undo/redo
The system SHALL implement undo/redo using region snapshots. Each action captures a `RegionSnapshot` (set of `{x, y, width, height, data: Uint8ClampedArray}` rectangles) of the pixel state before modification. Undo restores those regions.

#### Scenario: Undo last action
- **WHEN** the user presses Ctrl+Z
- **THEN** the most recent undo entry's region snapshot SHALL be restored to the current layer data
- **AND** the affected regions SHALL be marked as dirty for re-render

#### Scenario: Redo last undone action
- **WHEN** the user presses Ctrl+Shift+Z or Ctrl+Y
- **THEN** the current state SHALL be captured as a new undo snapshot
- **AND** the redo entry's region snapshot SHALL be restored

#### Scenario: New action clears redo stack
- **WHEN** the user performs a new action after undoing
- **THEN** the redo stack SHALL be cleared

### Requirement: Stroke-level undo granularity
The system SHALL create one undo entry per stroke (pointer down → move → up), not per pixel or per event.

#### Scenario: Drag stroke is one undo entry
- **WHEN** the user stops drawing (releases mouse) after a drag stroke
- **THEN** the entire drag stroke SHALL be a single undoable entry (not per-pixel)
- **AND** the snapshot captured at pointer down SHALL be stored as the undo data

#### Scenario: Tool actions are undo entries
- **WHEN** the user performs a non-stroke action (fill bucket, delete layer, etc.)
- **THEN** that action SHALL create a single undo entry

### Requirement: Undo history panel
The system SHALL provide a panel that displays the undo history as a list, allowing the user to jump to any state.

#### Scenario: View history list
- **WHEN** the user opens the history panel
- **THEN** a chronological list of actions SHALL be displayed

#### Scenario: Jump to history state
- **WHEN** the user clicks on a history entry
- **THEN** the canvas SHALL revert to that state
- **AND** all subsequent states SHALL become redo-able

### Requirement: Clear history
The system SHALL allow clearing the undo/redo history.

#### Scenario: Clear history
- **WHEN** the user triggers "Clear History"
- **THEN** all undo and redo entries SHALL be removed
- **AND** the current state SHALL become the new base state

### Requirement: History limit
The system SHALL limit the number of undo states to prevent excessive memory usage.

#### Scenario: History cap
- **WHEN** the undo stack exceeds the maximum (default 50)
- **THEN** the oldest state SHALL be discarded
