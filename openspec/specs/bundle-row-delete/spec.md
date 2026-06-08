## ADDED Requirements

### Requirement: Delete button per row
The system SHALL provide a delete button for each row in the bundle editor grid to remove the key from the bundle file.

#### Scenario: Delete button visible
- **WHEN** the grid renders a non-invalid row
- **THEN** a delete button SHALL appear in the last column of that row

#### Scenario: Delete button hidden on invalid rows
- **WHEN** a row has state `"invalid"`
- **THEN** no delete button SHALL be shown

#### Scenario: Click delete sets value to empty
- **WHEN** user clicks the delete button
- **THEN** the row's value SHALL be set to empty string
- **THEN** the change SHALL be written to the bundle file immediately

#### Scenario: Row state after delete
- **WHEN** a key exists in contentKeys after delete
- **THEN** the row state SHALL become `"untranslated"`
- **WHEN** a key is not in contentKeys after delete
- **THEN** the row state SHALL become `"missing"`