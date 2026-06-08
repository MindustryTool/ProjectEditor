## ADDED Requirements

### Requirement: Bundle file selection triggers bundle editor panel
The system SHALL render the BundleEditorPanel in the right panel when the selected file path matches a bundle file pattern and is within a `bundles/` directory.

#### Scenario: Bundle file selected
- **WHEN** the `?path=` value matches the pattern `bundles/bundle.properties` or `bundles/bundle_<locale>.properties` where `<locale>` is a supported locale code
- **THEN** the right panel SHALL render the BundleEditorPanel component

#### Scenario: Non-bundle file selected inside bundles folder
- **WHEN** the `?path=` value is inside a `bundles/` directory but does not match the bundle file pattern
- **THEN** the right panel SHALL fall through to the default text editor

### Requirement: Bundle file parsing
The system SHALL parse `.properties` format bundle files into structured key-value entries.

#### Scenario: Parse valid key-value line
- **WHEN** a line matches `key = value` or `key=value` format
- **THEN** it SHALL be parsed as an entry with the key and value extracted

#### Scenario: Parse comment line
- **WHEN** a line starts with `#`
- **THEN** it SHALL be parsed as a comment entry

#### Scenario: Parse invalid line
- **WHEN** a line does not match key-value or comment format
- **THEN** it SHALL be logged as a warning and treated as an invalid entry (preserved as-is on write)

#### Scenario: Empty line
- **WHEN** a line is empty or whitespace-only
- **THEN** it SHALL be preserved as a blank separator on round-trip

### Requirement: Bundle file writing
The system SHALL write bundle files with sorted keys in `key = value` format.

#### Scenario: Write sorted entries
- **WHEN** saving the bundle file
- **THEN** all key-value entries SHALL be sorted alphabetically by key
- **THEN** each key-value line SHALL use `key = value` format (space before and after `=`)

#### Scenario: Preserve comments on write
- **WHEN** a comment line precedes a key-value entry
- **THEN** the comment SHALL remain associated with that entry on write

### Requirement: Key-value grid display
The system SHALL display a scrollable grid of all i18n keys with their values from the bundle file.

#### Scenario: Display all keys
- **WHEN** the panel loads
- **THEN** it SHALL show a list of key-value pairs from the parsed bundle file
- **THEN** each row SHALL have an editable value input

#### Scenario: Missing key display
- **WHEN** an i18n key is discovered from content files but is not present in the bundle file
- **THEN** it SHALL be displayed with a yellow background indicator
- **THEN** its value input SHALL be disabled (read-only) until explicitly added

### Requirement: Side-by-side comparison
The system SHALL allow selecting a second locale file from the `bundles/` directory for side-by-side comparison.

#### Scenario: Select comparison file
- **WHEN** user selects a second locale file from a dropdown
- **THEN** the panel SHALL display two value columns, both editable, each saving to its respective file

#### Scenario: Keys missing in primary file
- **WHEN** a key exists in content but is missing from the primary bundle file
- **THEN** the row SHALL be rendered with yellow background and disabled input

### Requirement: Content key discovery
The system SHALL discover i18n keys from content folder files via a configurable mapping function.

#### Scenario: Key mapping function returns a key
- **WHEN** the mapping function processes a content file and returns a string key
- **THEN** that key SHALL be included in the grid display

#### Scenario: Key mapping function returns null
- **WHEN** the mapping function returns null for a content file
- **THEN** that file SHALL be excluded from the key list

### Requirement: Row filtering
The system SHALL support filtering the displayed key-value rows.

#### Scenario: Filter by key
- **WHEN** user types in the key filter input
- **THEN** only rows whose key contains the filter text SHALL be shown

#### Scenario: Filter by value
- **WHEN** user types in the value filter input
- **THEN** only rows whose value contains the filter text SHALL be shown

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

### Requirement: Comparison file locale support
The system SHALL support all Mindustry mod locale identifiers for comparison file selection.

#### Scenario: Supported locales listed
- **WHEN** the comparison file dropdown opens
- **THEN** it SHALL list all bundle files in the `bundles/` directory matched against supported locale codes
