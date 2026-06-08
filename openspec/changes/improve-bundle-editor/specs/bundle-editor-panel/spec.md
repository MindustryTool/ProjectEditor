## MODIFIED Requirements

### Requirement: Row filtering
The system SHALL support filtering the displayed key-value rows using a unified search input.

#### Scenario: Filter by key or value
- **WHEN** user types in the search input
- **THEN** only rows whose key OR value contains the filter text SHALL be shown

#### Scenario: Filter by translated state
- **WHEN** user selects "translated" filter
- **THEN** only rows where the key exists in the bundle (has a value) SHALL be shown

#### Scenario: Filter by untranslated state
- **WHEN** user selects "untranslated" filter
- **THEN** only rows where the key is missing from the bundle SHALL be shown

#### Scenario: Filter by invalid state
- **WHEN** user selects "invalid" filter
- **THEN** only rows with invalid parse lines SHALL be shown

#### Scenario: Show all
- **WHEN** user selects "all" filter
- **THEN** all rows SHALL be shown regardless of state

### Requirement: Missing key display
The system SHALL display untranslated keys in the grid with editable value inputs.

#### Scenario: Missing key editable
- **WHEN** an i18n key is discovered from content files but is not present in the bundle file
- **THEN** it SHALL be displayed with a yellow background indicator
- **THEN** its value input SHALL be enabled (editable)

### Requirement: Side-by-side comparison
The system SHALL allow selecting a second locale file from the `bundles/` directory for side-by-side comparison, with the dropdown on the same toolbar row as search and state filters.

#### Scenario: Select comparison file
- **WHEN** user selects a second locale file from a dropdown
- **THEN** the dropdown SHALL be positioned on the same toolbar row as the search input and state filter tabs
- **THEN** the panel SHALL display two value columns, both editable, each saving to its respective file
