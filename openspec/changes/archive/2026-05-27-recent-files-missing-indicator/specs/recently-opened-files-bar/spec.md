## ADDED Requirements

### Requirement: Missing file tabs are visually distinguished
The system SHALL render tabs for recently opened files that no longer exist in the project tree with a line-through text decoration and red text color.

#### Scenario: Missing file tab shows line-through red text
- **WHEN** a recently opened file's path is NOT present in the current project tree snapshot
- **THEN** its tab SHALL have `line-through` text decoration and `text-destructive` (red) color
- **AND** its name SHALL still be visible (not hidden)

#### Scenario: Existing file tab is unaffected
- **WHEN** a recently opened file's path IS present in the current project tree snapshot
- **THEN** its tab SHALL render with the normal styling (no line-through, no red text)

#### Scenario: Clicking missing file tab still navigates
- **WHEN** user clicks on a missing-file tab
- **THEN** the editor SHALL navigate to that file path (same as existing behavior)
