## ADDED Requirements

### Requirement: Editable x/y inputs in preview
Each preview component in the sidebar SHALL display editable numeric input fields for the x and y position values, allowing users to type precise coordinates.

#### Scenario: X value input
- **WHEN** a position preview is rendered
- **THEN** an `<Input type="number">` field SHALL be shown for the x coordinate, pre-filled with the current x value
- **AND** the field SHALL update the sprite position on blur or Enter key press

#### Scenario: Y value input
- **WHEN** a position preview is rendered
- **THEN** an `<Input type="number">` field SHALL be shown for the y coordinate, pre-filled with the current y value
- **AND** the field SHALL update the sprite position on blur or Enter key press

#### Scenario: Position update on blur
- **WHEN** user edits an x or y value and clicks outside the input (blur)
- **THEN** the system SHALL write the new value to the HJSON data via `updatePositionData()`
- **AND** the canvas SHALL re-render with the updated position

#### Scenario: Position update on Enter
- **WHEN** user edits an x or y value and presses Enter
- **THEN** the system SHALL write the new value to the HJSON data via `updatePositionData()`
- **AND** the canvas SHALL re-render with the updated position

#### Scenario: Cancel on Escape
- **WHEN** user edits an x or y value and presses Escape
- **THEN** the input SHALL reset to the original value
- **AND** the input SHALL lose focus

#### Scenario: Input value sync
- **WHEN** the underlying position data changes (e.g., via canvas drag)
- **THEN** the input fields SHALL update to reflect the new x/y values
