## MODIFIED Requirements

### Requirement: Editor panels react to file selection
The EditorPage layout SHALL react to the selected file path and show or hide the center and right panels accordingly.

#### Scenario: Panels hidden when no file selected
- **WHEN** no file is selected in the file explorer (`?path=` is absent)
- **THEN** the SplitView SHALL render only the left (explorer) panel; center and right panels SHALL not be visible

#### Scenario: Panels shown when file selected
- **WHEN** a known file path is selected
- **THEN** the center panel SHALL show the appropriate editor and the right panel SHALL show properties

## ADDED Requirements

### Requirement: Pixel editor layout adjustments
When the pixel editor is active, the layout SHALL adjust to provide maximum vertical space for the canvas.

#### Scenario: Right panel collapsed for pixel editor
- **WHEN** the pixel editor is active (`.png` file selected)
- **THEN** the right (properties) panel SHALL be collapsed by default to maximize canvas space

#### Scenario: Pixel editor toolbar
- **WHEN** the pixel editor is active
- **THEN** a pixel-specific toolbar SHALL appear above the canvas with drawing tools, colors, and settings

#### Scenario: Layer panel replaces properties panel
- **WHEN** the pixel editor is active
- **THEN** the right panel (if opened) SHALL show the layer panel and color panel instead of the default properties panel
