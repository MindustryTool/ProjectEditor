## ADDED Requirements

### Requirement: Rectangle selection
The system SHALL provide a rectangular selection tool that allows the user to drag a rectangular selection marquee on the canvas.

#### Scenario: Create rectangle selection
- **WHEN** the rectangle selection tool is active and the user drags
- **THEN** a rectangular selection SHALL be created from the start to end point

### Requirement: Ellipse selection
The system SHALL provide an elliptical selection tool.

#### Scenario: Create ellipse selection
- **WHEN** the ellipse selection tool is active and the user drags
- **THEN** an elliptical selection SHALL be created within the drag bounds

### Requirement: Magic wand selection
The system SHALL provide a magic wand tool that selects contiguous pixels of similar color.

#### Scenario: Magic wand select
- **WHEN** the magic wand tool is active and the user clicks a pixel
- **THEN** all contiguous pixels within the tolerance range SHALL be selected

### Requirement: Color select
The system SHALL provide a "select by color" tool that selects all pixels of similar color on the layer (not just contiguous).

#### Scenario: Select by color
- **WHEN** the color select tool is active and the user clicks a pixel
- **THEN** ALL pixels on the layer within the tolerance range SHALL be selected

### Requirement: Lasso selection
The system SHALL provide a freehand lasso selection tool.

#### Scenario: Lasso select
- **WHEN** the lasso tool is active and the user drags a freehand path
- **THEN** the enclosed area SHALL become the selection

### Requirement: Polygon selection
The system SHALL provide a polygon selection tool where the user clicks to place vertices.

#### Scenario: Polygon select
- **WHEN** the polygon tool is active and the user clicks to place vertices
- **THEN** a polygon connecting the vertices SHALL become the selection
- **AND** double-click or Enter SHALL close the polygon

### Requirement: Selection operations
The system SHALL support adding to, removing from, and intersecting with the current selection.

#### Scenario: Add to selection
- **WHEN** the user holds Shift and creates a new selection
- **THEN** the new selection SHALL be unioned with the existing selection

#### Scenario: Remove from selection
- **WHEN** the user holds Alt and creates a new selection
- **THEN** the overlapping area SHALL be removed from the existing selection

#### Scenario: Intersect selection
- **WHEN** the user holds Shift+Alt and creates a new selection
- **THEN** only the overlapping area SHALL remain selected

### Requirement: Move selection
The system SHALL allow moving the selection marquee (without moving the pixels) or the selected pixels as a floating selection.

#### Scenario: Move selection marquee
- **WHEN** the user drags the selection with the selection tool
- **THEN** only the selection boundary SHALL move, not the pixels

#### Scenario: Move selection content
- **WHEN** the user drags the selection with the move tool
- **THEN** the selected pixels SHALL move, leaving transparency behind

### Requirement: Duplicate selection
The system SHALL allow duplicating the selected pixels as a new floating layer.

#### Scenario: Duplicate selection
- **WHEN** the user triggers "Duplicate Selection"
- **THEN** the selected pixels SHALL be copied to a new floating layer above the current layer

### Requirement: Delete selection
The system SHALL allow deleting (clearing) the pixels within the selection.

#### Scenario: Delete selection content
- **WHEN** the user triggers "Delete Selection"
- **THEN** all pixels within the selection on the active layer SHALL become transparent

### Requirement: Fill selection
The system SHALL allow filling the selected area with the foreground color.

#### Scenario: Fill selection
- **WHEN** the user triggers "Fill Selection"
- **THEN** all pixels within the selection on the active layer SHALL be set to the foreground color

### Requirement: Invert selection
The system SHALL allow inverting the current selection (selecting everything that was not selected).

#### Scenario: Invert selection
- **WHEN** the user triggers "Invert Selection"
- **THEN** all previously unselected pixels SHALL become selected
- **AND** all previously selected pixels SHALL become unselected

### Requirement: Expand/Shrink selection
The system SHALL allow expanding or shrinking the selection by a specified number of pixels.

#### Scenario: Expand selection
- **WHEN** the user triggers "Expand Selection" with N pixels
- **THEN** the selection boundary SHALL grow outward by N pixels

#### Scenario: Shrink selection
- **WHEN** the user triggers "Shrink Selection" with N pixels
- **THEN** the selection boundary SHALL contract inward by N pixels

### Requirement: Feather selection
The system SHALL allow feathering (softening) the selection edges by a specified radius.

#### Scenario: Feather selection
- **WHEN** the user triggers "Feather Selection" with radius R
- **THEN** the selection edges SHALL become semi-transparent over R pixels

### Requirement: Select all / Deselect / Reselect
The system SHALL support Select All (entire canvas), Deselect (clear selection), and Reselect (restore previous selection).

#### Scenario: Select all
- **WHEN** the user triggers "Select All"
- **THEN** all pixels on the canvas SHALL be selected

#### Scenario: Deselect
- **WHEN** the user triggers "Deselect"
- **THEN** the selection SHALL be cleared

#### Scenario: Reselect
- **WHEN** the user triggers "Reselect" after deselecting
- **THEN** the previous selection SHALL be restored
