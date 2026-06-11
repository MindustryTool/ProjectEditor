## ADDED Requirements

### Requirement: Toggle grid
The system SHALL display a grid overlay on the canvas showing pixel boundaries, toggleable by the user.

#### Scenario: Show grid
- **WHEN** the user toggles "Show Grid"
- **THEN** thin lines SHALL be drawn at each pixel boundary

#### Scenario: Grid zoom visibility
- **WHEN** zoom is below 800%
- **THEN** the grid SHALL show every Nth pixel boundary based on zoom level to avoid clutter
- **WHEN** zoom is 800% or above
- **THEN** every pixel boundary SHALL be shown

### Requirement: Toggle pixel grid
The system SHALL display a finer grid separate from the main grid, showing individual pixels at high zoom levels.

#### Scenario: Show pixel grid
- **WHEN** the user enables pixel grid and zoom is sufficient
- **THEN** each individual pixel SHALL have a visible boundary

### Requirement: Toggle rulers
The system SHALL display horizontal and vertical rulers along the top and left edges of the canvas.

#### Scenario: Show rulers
- **WHEN** the user toggles "Show Rulers"
- **THEN** pixel-position rulers SHALL appear along the top and left edges

#### Scenario: Cursor tracking on rulers
- **WHEN** the cursor moves over the canvas and rulers are visible
- **THEN** indicator lines SHALL track the cursor position on both rulers

### Requirement: Toggle guides
The system SHALL support draggable guide lines that can be placed on the canvas for alignment.

#### Scenario: Show guides
- **WHEN** the user toggles "Show Guides"
- **THEN** previously placed guides SHALL be visible

#### Scenario: Add guide from ruler
- **WHEN** the user drags from a ruler onto the canvas
- **THEN** a guide line SHALL be placed at that position

### Requirement: Toggle layer bounds
The system SHALL highlight the bounding box of non-transparent content on the active layer.

#### Scenario: Show layer bounds
- **WHEN** the user toggles "Show Layer Bounds"
- **THEN** a dashed outline SHALL surround the non-empty area of the active layer

### Requirement: Toggle onion skin
The system SHALL display an onion skin overlay showing the layers below the current layer with reduced opacity.

#### Scenario: Show onion skin
- **WHEN** the user toggles "Onion Skin"
- **THEN** layers below the active layer SHALL be visible at reduced opacity

### Requirement: Toggle transparency checkerboard
The system SHALL display transparent areas as a checkerboard pattern instead of showing them as black/white.

#### Scenario: Show checkerboard
- **WHEN** the user toggles "Transparency Checkerboard"
- **THEN** transparent pixels SHALL be rendered as a checkerboard pattern (light/dark gray squares)
