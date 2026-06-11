## ADDED Requirements

### Requirement: Zoom controls
The system SHALL provide zoom in, zoom out, fit to screen, 100% zoom, and custom zoom percentage.

#### Scenario: Zoom in
- **WHEN** the user triggers "Zoom In" (Ctrl+=)
- **THEN** the zoom level SHALL increase by one step

#### Scenario: Zoom out
- **WHEN** the user triggers "Zoom Out" (Ctrl+-)
- **THEN** the zoom level SHALL decrease by one step

#### Scenario: Fit to screen
- **WHEN** the user triggers "Fit to Screen"
- **THEN** the zoom level SHALL be set so the entire canvas is visible

#### Scenario: 100% zoom
- **WHEN** the user triggers "100% Zoom"
- **THEN** the zoom level SHALL be set to 1:1 (each canvas pixel = 1 screen pixel)

#### Scenario: Custom zoom
- **WHEN** the user enters a zoom percentage
- **THEN** the zoom level SHALL be set to the specified value (clamped between 1% and 3200%)

### Requirement: Mouse wheel zoom
The system SHALL zoom in/out centered on the cursor position when the user scrolls the mouse wheel.

#### Scenario: Scroll to zoom
- **WHEN** the user scrolls the mouse wheel
- **THEN** the canvas SHALL zoom in/out with the cursor position as the focal point

### Requirement: Pinch zoom
The system SHALL support pinch-to-zoom on touch devices.

#### Scenario: Pinch to zoom
- **WHEN** the user performs a pinch gesture on the canvas
- **THEN** the zoom level SHALL change proportionally to the pinch distance

### Requirement: Pan navigation
The system SHALL support panning the canvas view using middle mouse button drag, spacebar+drag, and a dedicated hand tool.

#### Scenario: Middle mouse drag
- **WHEN** the user holds the middle mouse button and drags
- **THEN** the canvas view SHALL pan

#### Scenario: Spacebar drag
- **WHEN** the user holds the spacebar and drags with left mouse button
- **THEN** the canvas view SHALL pan

#### Scenario: Hand tool pan
- **WHEN** the hand tool is active and the user drags
- **THEN** the canvas view SHALL pan

### Requirement: Zoom limits
The system SHALL enforce minimum and maximum zoom levels.

#### Scenario: Zoom clamping
- **WHEN** the zoom level would go below 1% or above 3200%
- **THEN** the zoom SHALL be clamped to the limit
