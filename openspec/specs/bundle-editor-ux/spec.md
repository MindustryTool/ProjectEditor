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

### Requirement: Unified search input
The system SHALL provide a single search input that filters rows by matching against both key and value.

#### Scenario: Search by key
- **WHEN** user types in the search input
- **THEN** only rows whose key contains the search text (case-insensitive) SHALL be shown

#### Scenario: Search by value
- **WHEN** user types in the search input
- **THEN** only rows whose value contains the search text (case-insensitive) SHALL be shown

### Requirement: Entry count badges on state filters
The system SHALL display entry counts for each state filter option (all, translated, untranslated, extra, missing, invalid).

#### Scenario: Show entry counts
- **WHEN** the bundle editor panel renders
- **THEN** each state filter tab SHALL display the count of entries matching that state in a badge

#### Scenario: Counts update dynamically
- **WHEN** a value is edited or a filter changes
- **THEN** the entry counts SHALL update to reflect the current data

### Requirement: Auto-save on value change
The system SHALL write changes to the bundle file automatically when a value is edited, using the write queue.

#### Scenario: Value edited triggers write
- **WHEN** user types in a value input
- **THEN** the change SHALL be queued for write automatically via the write queue

#### Scenario: No save button
- **WHEN** the bundle editor panel renders
- **THEN** there SHALL be no save button visible

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

### Requirement: Streamlined layout
The system SHALL render with a compact layout: no outer padding, compare-with dropdown on same row as search and state filters, no separator above.

#### Scenario: No outer padding
- **WHEN** the bundle editor panel renders
- **THEN** the root container SHALL NOT have padding (no `p-4`)

#### Scenario: Compare-with on filter row
- **WHEN** comparison files are available
- **THEN** the compare-with dropdown SHALL appear on the same row as the search input and state filter tabs

#### Scenario: No separator
- **WHEN** the bundle editor panel renders
- **THEN** there SHALL be no separator/divider line between the toolbar and the table

### Requirement: Default locale label hidden
The system SHALL NOT display the locale name when it equals "DEFAULT".

#### Scenario: Hide DEFAULT label
- **WHEN** `bundle.localeName` equals "DEFAULT"
- **THEN** the locale name SHALL NOT be rendered
