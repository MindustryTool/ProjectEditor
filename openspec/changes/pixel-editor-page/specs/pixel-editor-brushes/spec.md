## ADDED Requirements

### Requirement: Brush management
The system SHALL allow creating, saving, deleting, and duplicating brushes.

#### Scenario: Create brush
- **WHEN** the user creates a new brush from a selection
- **THEN** the selected pixel pattern SHALL be saved as a custom brush

#### Scenario: Save brush
- **WHEN** the user saves a brush
- **THEN** it SHALL be persisted and available in the brush list

#### Scenario: Delete brush
- **WHEN** the user deletes a brush
- **THEN** it SHALL be removed from the brush list

#### Scenario: Duplicate brush
- **WHEN** the user duplicates a brush
- **THEN** a copy SHALL appear in the brush list with "copy" suffix

### Requirement: Brush settings
The system SHALL provide configurable brush settings including size, opacity, flow, hardness, and rotation.

#### Scenario: Adjust brush size
- **WHEN** the user adjusts the brush size slider
- **THEN** the brush preview and stroke size SHALL update

#### Scenario: Adjust brush opacity
- **WHEN** the user adjusts brush opacity
- **THEN** strokes SHALL be rendered with the specified opacity

#### Scenario: Adjust brush flow
- **WHEN** the user adjusts brush flow
- **THEN** the rate at which opacity builds up with repeated strokes SHALL change

#### Scenario: Adjust brush hardness
- **WHEN** the user adjusts brush hardness
- **THEN** the edge softness of the brush stroke SHALL change

#### Scenario: Adjust brush rotation
- **WHEN** the user adjusts brush rotation
- **THEN** the brush stamp SHALL be rotated by the specified angle

### Requirement: Pixel brush types
The system SHALL provide built-in pixel brush shapes: square, circle, dither, pattern, and custom.

#### Scenario: Square brush
- **WHEN** the square brush is selected
- **THEN** the brush stamp SHALL be a solid square of the specified size

#### Scenario: Circle brush
- **WHEN** the circle brush is selected
- **THEN** the brush stamp SHALL be a solid circle of the specified size

#### Scenario: Dither brush
- **WHEN** the dither brush is selected
- **THEN** the brush stamp SHALL apply a dither pattern

#### Scenario: Pattern brush
- **WHEN** the pattern brush is selected
- **THEN** the brush SHALL stamp a repeating pattern

#### Scenario: Custom brush
- **WHEN** a custom brush is selected
- **THEN** the brush SHALL stamp the saved pixel pattern
