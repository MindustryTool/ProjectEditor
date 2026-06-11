## ADDED Requirements

### Requirement: Move tool
The system SHALL provide a move tool that translates the active layer or the selection content.

#### Scenario: Move layer
- **WHEN** the move tool is active and the user drags without a selection
- **THEN** the entire active layer SHALL be offset by the drag delta

#### Scenario: Move selection
- **WHEN** the move tool is active and a selection exists
- **THEN** only the pixels within the selection SHALL be moved

### Requirement: Scale tool
The system SHALL provide scale operations with nearest-neighbor, integer, and free scaling modes.

#### Scenario: Scale nearest-neighbor
- **WHEN** the user scales the layer with nearest-neighbor mode
- **THEN** pixels SHALL be duplicated without interpolation (hard pixel edges preserved)

#### Scenario: Scale integer
- **WHEN** the user scales by an integer factor (2x, 3x, etc.)
- **THEN** the scale SHALL snap to the nearest integer factor

#### Scenario: Scale free
- **WHEN** the user scales with free mode
- **THEN** any scale factor SHALL be accepted, rendered with nearest-neighbor interpolation

### Requirement: Rotation
The system SHALL provide 90° rotation (clockwise and counterclockwise) and arbitrary angle rotation.

#### Scenario: Rotate 90°
- **WHEN** the user triggers "Rotate 90° CW"
- **THEN** the active layer SHALL be rotated 90 degrees clockwise

#### Scenario: Rotate arbitrary angle
- **WHEN** the user enters an angle or drags the rotation handle
- **THEN** the layer SHALL be rotated by that angle

### Requirement: Flip
The system SHALL provide horizontal and vertical flip operations.

#### Scenario: Flip horizontal
- **WHEN** the user triggers "Flip Horizontal"
- **THEN** the active layer SHALL be mirrored horizontally

#### Scenario: Flip vertical
- **WHEN** the user triggers "Flip Vertical"
- **THEN** the active layer SHALL be mirrored vertically

### Requirement: Transform handles
The system SHALL display visual transform handles (corner and edge anchors) around the selection or layer when a transform tool is active.

#### Scenario: Show transform handles
- **WHEN** a transform tool (move, scale, rotate) is active
- **THEN** transform handles SHALL be displayed at the corners and edges of the selection/layer bounding box

#### Scenario: Drag handle to transform
- **WHEN** the user drags a corner handle
- **THEN** the layer/selection SHALL scale proportionally

### Requirement: Pivot point
The system SHALL display a pivot point indicator for rotation and scale operations, which the user can reposition.

#### Scenario: Move pivot point
- **WHEN** the user drags the pivot point indicator
- **THEN** rotation and scale SHALL be computed relative to the new pivot position

#### Scenario: Default pivot
- **WHEN** entering a transform mode
- **THEN** the pivot point SHALL default to the center of the selection/layer
