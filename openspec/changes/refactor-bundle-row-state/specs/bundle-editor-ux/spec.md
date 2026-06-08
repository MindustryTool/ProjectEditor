## ADDED Requirements

### Requirement: Extra and missing state counts
The system SHALL display entry counts for the new extra and missing state filters.

#### Scenario: Extra count badge
- **WHEN** the bundle editor panel renders
- **THEN** the "extra" filter tab SHALL display the count of extra rows in a badge

#### Scenario: Missing count badge
- **WHEN** the bundle editor panel renders
- **THEN** the "missing" filter tab SHALL display the count of missing rows in a badge

## MODIFIED Requirements

### Requirement: Entry count badges on state filters
The system SHALL display entry counts for each state filter option (all, translated, untranslated, extra, missing, invalid).

#### Scenario: Show entry counts
- **WHEN** the bundle editor panel renders
- **THEN** each state filter tab SHALL display the count of entries matching that state in a badge

#### Scenario: Counts update dynamically
- **WHEN** a value is edited or a filter changes
- **THEN** the entry counts SHALL update to reflect the current data

### Requirement: Untranslated rows editable
The system SHALL allow editing value inputs for untranslated (missing) rows.

#### Scenario: Edit missing key value
- **WHEN** a row has state `"missing"` or `"untranslated"`
- **THEN** its value input SHALL NOT be disabled
- **THEN** typing in the input SHALL queue a write that adds/updates the key in the bundle

#### Scenario: Delete key from bundle
- **WHEN** user clicks the delete button on a row
- **THEN** the key SHALL be written with an empty value to the bundle file
- **THEN** the row's state SHALL transition to `"untranslated"` if the key is in contentKeys, or `"missing"` otherwise
