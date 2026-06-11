## ADDED Requirements

### Requirement: Horizontal symmetry
The system SHALL mirror drawing strokes across a vertical axis.

#### Scenario: Draw with horizontal symmetry
- **WHEN** horizontal symmetry is enabled and the user draws on one side
- **THEN** the stroke SHALL be mirrored to the opposite side

### Requirement: Vertical symmetry
The system SHALL mirror drawing strokes across a horizontal axis.

#### Scenario: Draw with vertical symmetry
- **WHEN** vertical symmetry is enabled and the user draws above the axis
- **THEN** the stroke SHALL be mirrored below the axis

### Requirement: Radial symmetry
The system SHALL repeat drawing strokes around a center point for radial symmetry.

#### Scenario: Draw with radial symmetry
- **WHEN** radial symmetry is enabled with N segments
- **THEN** the stroke SHALL be repeated N times around the center point

### Requirement: Pixel-perfect line drawing
The system SHALL constrain line drawing to pixel-perfect paths when pixel-perfect mode is enabled, preventing anti-aliased or sub-pixel lines.

#### Scenario: Pixel-perfect pencil
- **WHEN** pixel-perfect mode is enabled and the pencil is active
- **THEN** the drawn line SHALL only occupy whole pixels with no anti-aliasing

#### Scenario: Pixel-perfect brush
- **WHEN** pixel-perfect mode is enabled
- **THEN** brush strokes SHALL be snapped to pixel boundaries
