## ADDED Requirements

### Requirement: Content type selects allowed target folder
The system SHALL restrict content type file creation to content-type-specific subdirectories. When a content type is selected, a folder picker dropdown SHALL appear showing only the allowed folder(s) for that type.

#### Scenario: Unit type shows content/units and subfolders
- **WHEN** the user selects `unit` from the type dropdown
- **THEN** a folder picker dropdown SHALL appear with `content/units` as an option
- **AND** any subdirectories inside `content/units` SHALL also be listed as options (e.g., `content/units/my-faction`)
- **AND** the user SHALL be required to select one option before creating

#### Scenario: Item type shows content/items and subfolders
- **WHEN** the user selects `item` from the type dropdown
- **THEN** the folder picker SHALL show `content/items` and its subdirectories

#### Scenario: Block type shows content/blocks and subfolders
- **WHEN** the user selects `block` from the type dropdown
- **THEN** the folder picker SHALL show `content/blocks` and its subdirectories

#### Scenario: Liquid type shows content/liquids and subfolders
- **WHEN** the user selects `liquid` from the type dropdown
- **THEN** the folder picker SHALL show `content/liquids` and its subdirectories

#### Scenario: Status type shows content/status and subfolders
- **WHEN** the user selects `status` from the type dropdown
- **THEN** the folder picker SHALL show `content/status` and its subdirectories

#### Scenario: Sector type shows content/sectors and subfolders
- **WHEN** the user selects `sector` from the type dropdown
- **THEN** the folder picker SHALL show `content/sectors` and its subdirectories

#### Scenario: Env-block type shows content/env-blocks and subfolders
- **WHEN** the user selects `env-block` from the type dropdown
- **THEN** the folder picker SHALL show `content/env-blocks` and its subdirectories

#### Scenario: Effect type shows content/effects and subfolders
- **WHEN** the user selects `effect` from the type dropdown
- **THEN** the folder picker SHALL show `content/effects` and its subdirectories

#### Scenario: File and folder types do not show folder picker
- **WHEN** the user selects `file` or `folder` from the type dropdown
- **THEN** the folder picker SHALL NOT be shown

#### Scenario: Content type requires folder selection
- **WHEN** the user selects a content type but has not chosen a folder from the folder picker
- **THEN** the "Create" button SHALL be disabled or an error SHALL be shown

#### Scenario: Root content folder exists without subdirectories
- **WHEN** the user selects a content type and the content-type folder exists but has no subdirectories
- **THEN** the folder picker SHALL show only the root content folder as the sole option
- **AND** it SHALL be auto-selected

#### Scenario: Content type folder does not exist yet
- **WHEN** the user selects a content type and the content-type folder does not exist in the FS
- **THEN** the folder picker SHALL still show the root content folder as an option
- **AND** creating a file there SHALL succeed (file creation does not require the parent directory to exist, or the FS SHALL create it implicitly)
