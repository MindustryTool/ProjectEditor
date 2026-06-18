## ADDED Requirements

### Requirement: Toggle sprite visibility on canvas
The system SHALL provide an eye icon button in the top-right corner of the position editor canvas area that toggles visibility of all sprite/position indicators on the Konva stage.

#### Scenario: Toggle sprites off
- **WHEN** user clicks the eye icon button while sprites are visible
- **THEN** all position-related Konva shapes (PositionImage, SpriteItem, ShootItem, placeholders) are hidden on the canvas
- **AND** the icon changes from "eye" to "eye-off"

#### Scenario: Toggle sprites on
- **WHEN** user clicks the eye icon button while sprites are hidden
- **THEN** all position-related Konva shapes are shown on the canvas
- **AND** the icon changes from "eye-off" to "eye"

#### Scenario: Visibility state persists during editor session
- **WHEN** user toggles sprites off, then interacts with the sidebar (e.g., edits a position)
- **THEN** the canvas remains in the hidden state until toggled back on

### Requirement: Visibility indicator availability
The system SHALL ensure the visibility toggle works regardless of whether sprites are currently loaded or the canvas is empty.

#### Scenario: No sprites loaded
- **WHEN** the position editor has no sprites to display
- **THEN** the eye icon button SHALL still be rendered (but may appear disabled or have no effect)
