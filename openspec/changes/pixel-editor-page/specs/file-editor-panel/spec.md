## MODIFIED Requirements

### Requirement: Dynamic center panel content
The system SHALL render the SplitView center panel based on the currently selected file path from the `?path=` URL query parameter.

#### Scenario: No file selected
- **WHEN** the `?path=` parameter is absent, empty, or null
- **THEN** the center panel SHALL not render any content

#### Scenario: Known file selected
- **WHEN** the `?path=` value matches a known file in the project tree
- **THEN** the center panel SHALL render the corresponding editor component for that file type

#### Scenario: Unknown path selected
- **WHEN** the `?path=` value does not match any known file
- **THEN** the center panel SHALL not render any content

## ADDED Requirements

### Requirement: PNG file opens pixel editor
The system SHALL route `.png` files to the pixel editor component instead of the static `ImageWithSize` component.

#### Scenario: PNG file selected
- **WHEN** the `?path=` value ends with `.png` and matches a known file
- **THEN** the center panel SHALL render the pixel editor component

#### Scenario: PNG file opened from existing image route
- **WHEN** the route type resolves to "image" (`.png` files)
- **THEN** the system SHALL render `<PixelEditor>` instead of `<ImageWithSize>`
