## ADDED Requirements

### Requirement: Line-targeted file update for mod.hjson editor

The ModHjsonPanel SHALL update only the line corresponding to the changed field instead of rebuilding the entire file content on each change. The system SHALL maintain a reference to the original file content as a mutable array of lines, and SHALL replace only the line that starts with the changed field's key before calling `update()`.

#### Scenario: Single field change replaces only that line
- **WHEN** the user modifies the `name` field value from `"my-mod"` to `"my-renamed-mod"`
- **THEN** the content passed to `update()` SHALL contain all original lines unchanged except the `name:` line, which SHALL read `name: my-renamed-mod`

#### Scenario: Multiple field changes each target their own line
- **WHEN** the user modifies `author` and then `displayName` separately
- **THEN** each `update()` call SHALL only change the line matching the respective field key

#### Scenario: Dependencies line replaced as a whole
- **WHEN** the user adds or removes a dependency
- **THEN** only the `dependencies:` line SHALL be replaced in the content passed to `update()`

#### Scenario: Hidden field toggled replaces hidden line
- **WHEN** the user toggles the hidden checkbox
- **THEN** only the `hidden:` line SHALL be replaced

#### Scenario: Description multiline field replaced line
- **WHEN** the user changes the description value
- **THEN** only the `description:` line SHALL be replaced (the value text SHALL be placed inline after the key, not as separate lines)

#### Scenario: Empty file initializes with default lines
- **WHEN** the file content is an empty string
- **THEN** the line array SHALL be initialized from `defaultModHjson` using the same line format as `toHjson()`

### Requirement: Line replacement function

The system SHALL provide a pure function that finds a line by key prefix in a lines array and replaces it.

#### Scenario: Key found and replaced
- **WHEN** `replaceLine(["name: old", "author: me"], "name", "new")` is called
- **THEN** the result SHALL be `["name: new", "author: me"]`

#### Scenario: Key not found appends
- **WHEN** `replaceLine(["author: me"], "name", "new")` is called
- **THEN** the result SHALL be `["author: me", "name: new"]`

#### Scenario: Key prefix matching is exact
- **WHEN** `replaceLine(["name: a", "named: b"], "name", "c")` is called
- **THEN** only the `name:` line SHALL be replaced, not the `named:` line
