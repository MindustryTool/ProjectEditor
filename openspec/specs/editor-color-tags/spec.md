## ADDED Requirements

### Requirement: Color tag syntax support
The system SHALL support Mindustry-style color tags within strings in the editor.

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
