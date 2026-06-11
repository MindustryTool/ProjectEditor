## ADDED Requirements

### Requirement: Foreground and background colors
The system SHALL maintain a foreground color and a background color, used by drawing tools as primary and secondary colors.

#### Scenario: Default colors
- **WHEN** the pixel editor initializes
- **THEN** the foreground SHALL be black (#000000) and the background SHALL be white (#FFFFFF)

#### Scenario: Swap colors
- **WHEN** the user triggers "Swap Colors" (press X)
- **THEN** the foreground and background colors SHALL exchange

#### Scenario: Reset colors
- **WHEN** the user triggers "Reset Colors" (press D)
- **THEN** the foreground SHALL reset to black and background to white

### Requirement: Color palette
The system SHALL provide a palette panel showing a grid of color swatches that the user can click to select as the foreground color.

#### Scenario: Add color to palette
- **WHEN** the user adds a color to the palette
- **THEN** the current foreground color SHALL be appended to the palette

#### Scenario: Remove color from palette
- **WHEN** the user removes a color from the palette
- **THEN** that color swatch SHALL be deleted

#### Scenario: Reorder palette colors
- **WHEN** the user drags a palette color to a new position
- **THEN** the palette order SHALL update accordingly

#### Scenario: Lock palette color
- **WHEN** a palette color is locked
- **THEN** it SHALL NOT be removable or reorderable until unlocked

### Requirement: Palette import/export
The system SHALL support importing palette files (GIMP/Adobe .gpl, hex list) and exporting the current palette.

#### Scenario: Import palette
- **WHEN** the user imports a palette file
- **THEN** the colors from the file SHALL be added to the palette

#### Scenario: Export palette
- **WHEN** the user exports the palette
- **THEN** a `.gpl` or hex file SHALL be downloaded containing all palette colors

#### Scenario: Generate palette from image
- **WHEN** the user triggers palette generation from the current canvas
- **THEN** the system SHALL extract the most common colors and populate the palette

#### Scenario: Sort palette
- **WHEN** the user triggers sort
- **THEN** the palette colors SHALL be sorted by hue, saturation, or brightness (configurable)

### Requirement: RGB color editor
The system SHALL provide an RGB color editor with sliders for Red (0-255), Green (0-255), and Blue (0-255) channels.

#### Scenario: Edit RGB values
- **WHEN** the user adjusts any RGB slider
- **THEN** the foreground color SHALL update in real time
- **AND** the hex value SHALL update accordingly

### Requirement: HSV color editor
The system SHALL provide an HSV color editor with sliders for Hue (0-360), Saturation (0-100), and Value (0-100).

#### Scenario: Edit HSV values
- **WHEN** the user adjusts any HSV slider
- **THEN** the foreground color SHALL update in real time

### Requirement: HEX color editor
The system SHALL provide a HEX color editor with a text input for hex color codes (e.g., #FF00AA).

#### Scenario: Enter hex code
- **WHEN** the user types a valid hex color code
- **THEN** the foreground color SHALL update accordingly

#### Scenario: Invalid hex code
- **WHEN** the user types an invalid hex code
- **THEN** the foreground color SHALL NOT change
- **AND** the input SHALL be visually marked as invalid

### Requirement: Alpha editor
The system SHALL provide an alpha (opacity) slider for the current color from 0 (transparent) to 255 (opaque).

#### Scenario: Edit alpha
- **WHEN** the user adjusts the alpha slider
- **THEN** the foreground color's alpha channel SHALL update

### Requirement: Color wheel
The system SHALL provide an interactive color wheel for visual color selection.

#### Scenario: Pick from color wheel
- **WHEN** the user clicks on the color wheel
- **THEN** the foreground color SHALL update to the selected hue and saturation

### Requirement: Gradient picker
The system SHALL provide a gradient/ramp picker for fine-tuning the selected color's value/brightness.

#### Scenario: Adjust brightness
- **WHEN** the user adjusts the gradient picker
- **THEN** the foreground color's brightness SHALL update
