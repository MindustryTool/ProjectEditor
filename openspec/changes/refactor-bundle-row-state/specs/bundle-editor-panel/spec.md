## MODIFIED Requirements

### Requirement: Key-value grid display
The system SHALL display a scrollable grid of all i18n keys with their values from the bundle file.

#### Scenario: Display all keys
- **WHEN** the panel loads
- **THEN** it SHALL show a list of key-value pairs from the parsed bundle file
- **THEN** each row SHALL have an editable value input

#### Scenario: Missing key display
- **WHEN** an i18n key from content files is absent in the bundle file
- **THEN** the row SHALL have state `"missing"` with a yellow background indicator
- **THEN** its value input SHALL be enabled (editable)

#### Scenario: Extra key display
- **WHEN** a key is present in the bundle file but not in content files
- **THEN** the row SHALL have state `"extra"` with distinct visual styling
- **THEN** its value input SHALL be enabled (editable)

#### Scenario: Untranslated key display
- **WHEN** a key exists in the bundle file with an empty value
- **THEN** the row SHALL have state `"untranslated"`
- **THEN** its value input SHALL show a blank field and be enabled

#### Scenario: State column
- **WHEN** the grid renders
- **THEN** a delete button SHALL appear in the last column for all non-invalid rows

### Requirement: Row filtering
The system SHALL support filtering the displayed key-value rows using a unified search input and state-based filter tabs.

#### Scenario: Filter by key or value
- **WHEN** user types in the search input
- **THEN** only rows whose key OR value contains the filter text SHALL be shown

#### Scenario: Filter by translated state
- **WHEN** user selects "translated" filter
- **THEN** only rows with state `"translated"` SHALL be shown

#### Scenario: Filter by untranslated state
- **WHEN** user selects "untranslated" filter
- **THEN** only rows with state `"untranslated"` SHALL be shown

#### Scenario: Filter by extra state
- **WHEN** user selects "extra" filter
- **THEN** only rows with state `"extra"` SHALL be shown

#### Scenario: Filter by missing state
- **WHEN** user selects "missing" filter
- **THEN** only rows with state `"missing"` SHALL be shown

#### Scenario: Filter by invalid state
- **WHEN** user selects "invalid" filter
- **THEN** only rows with state `"invalid"` SHALL be shown

#### Scenario: Show all
- **WHEN** user selects "all" filter
- **THEN** all rows SHALL be shown regardless of state
