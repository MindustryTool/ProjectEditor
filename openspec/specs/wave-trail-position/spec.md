# wave-trail-position Specification

## Purpose
TBD - created by archiving change add-wave-trail-position. Update Purpose after archive.
## Requirements
### Requirement: Wave trail positions are collected from unit data
The system SHALL extract `waveTrailX` and `waveTrailY` values from unit HJSON objects and include them as position data in the output of `collectUnitPositions()`.

#### Scenario: Naval unit with wave trail values
- **WHEN** a unit HJSON object has `waveTrailX: 6` and `waveTrailY: -2`
- **THEN** the collected positions include one entry of type `"wave-trail"` with `position.x.value = 6` and `position.y.value = -2`

#### Scenario: Unit without wave trail fields
- **WHEN** a unit HJSON object has no `waveTrailX` or `waveTrailY` fields
- **THEN** the collected positions include one entry of type `"wave-trail"` with `position.x.value = 4` and `position.y.value = -3` (schema defaults)

### Requirement: Wave trail position is draggable on canvas
The system SHALL render a draggable marker for the wave trail position on the position editor canvas, following the same drag interaction pattern as other position types.

#### Scenario: Drag wave trail marker
- **WHEN** user drags the wave trail position marker on the canvas
- **THEN** the `waveTrailX` and `waveTrailY` values in the HJSON data update to the new position
- **AND** the wave trail marker moves to the dragged position

### Requirement: Wave trail position supports selection
The system SHALL allow selecting the wave trail position marker on the canvas, showing a selection highlight and enabling the floating input editor.

#### Scenario: Select wave trail marker
- **WHEN** user clicks on the wave trail position marker
- **THEN** the marker shows a selection highlight
- **AND** the floating coordinate input appears for editing x/y values

### Requirement: Wave trail renders with distinct visual style
The system SHALL render the wave trail position marker in a visually distinct color to differentiate it from engine, weapon, part, and draw-region markers.

#### Scenario: Wave trail marker appearance
- **WHEN** the wave trail position is displayed on the canvas
- **THEN** it appears as a colored square placeholder with the label `"wave-trail"`
- **AND** the color is distinct from other position types

