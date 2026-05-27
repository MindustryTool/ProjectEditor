## MODIFIED Requirements

### Requirement: Color tag syntax support
The system SHALL support Mindustry-style color tags within strings in the editor, including interactive editing for valid color tags.

#### Scenario: Predefined color names
- **WHEN** a string contains a tag like `[accent]`, `[scarlet]`, `[cyan]`, etc.
- **THEN** the tag SHALL be tokenized as a color tag
- **AND** the subsequent text SHALL be rendered with that color until a reset tag `[]` or another color tag is encountered

#### Scenario: Hex color values
- **WHEN** a string contains a tag like `[#f]`, `[#ffaa11]`, or `[#11223344]`
- **THEN** the tag SHALL be tokenized as a hex color tag
- **AND** the subsequent text SHALL be rendered with Mindustry-compatible normalized color value until a reset tag `[]` or another color tag is encountered

#### Scenario: Mindustry hex length rules
- **WHEN** a string contains a hex color tag
- **THEN** only `1-6` or `8` hex digits after `#` SHALL be accepted
- **AND** `7` hex digits SHALL be rejected as invalid

#### Scenario: Mindustry hex normalization
- **WHEN** a string contains a short hex color tag with fewer than `8` digits after `#`
- **THEN** the color SHALL be normalized by right-padding to `RRGGBB` width and appending `ff` alpha, matching Mindustry parser behavior

#### Scenario: Reset tag
- **WHEN** a string contains a reset tag `[]`
- **THEN** the subsequent text SHALL be rendered with the default string color

#### Scenario: Multiple tags in one string
- **WHEN** a string contains multiple tags (e.g., `[red]Red [blue]Blue []Default`)
- **THEN** each segment SHALL be rendered with the corresponding color

#### Scenario: Clicking inside named color tag
- **WHEN** user clicks or moves cursor inside valid named color tag like `[accent]`
- **THEN** editor SHALL show color picker anchored to that tag
- **AND** picker SHALL indicate current resolved color for that tag

#### Scenario: Clicking inside hex color tag
- **WHEN** user clicks or moves cursor inside valid hex color tag like `[#ffaa11]`
- **THEN** editor SHALL show color picker anchored to that tag
- **AND** picker SHALL initialize from Mindustry-normalized color value of that tag

#### Scenario: Picking named color
- **WHEN** color picker is open for a valid color tag and user selects one of predefined Mindustry named colors
- **THEN** editor SHALL replace original tag text with selected named tag syntax like `[scarlet]`
- **AND** rendered text color SHALL update to selected color immediately

#### Scenario: Picking custom color
- **WHEN** color picker is open for a valid color tag and user selects custom color outside predefined names
- **THEN** editor SHALL replace original tag text with hex tag syntax like `[#ffaa11]`
- **AND** rendered text color SHALL update to selected color immediately

#### Scenario: Leaving tag range
- **WHEN** active cursor or selection leaves valid editable color tag range
- **THEN** editor SHALL hide color picker

#### Scenario: Invalid or reset tag
- **WHEN** user clicks inside invalid color-like text or reset tag `[]`
- **THEN** editor SHALL NOT show color picker
