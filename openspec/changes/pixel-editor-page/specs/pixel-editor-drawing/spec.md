## ADDED Requirements

### Requirement: Direct pixel buffer mutation during strokes
The system SHALL mutate the layer's `Uint8ClampedArray` buffer directly during active drawing. Zustand/React state SHALL NOT be updated on each pointer event.

#### Scenario: Mutate buffer on pointer move
- **WHEN** the user drags with the pencil tool
- **THEN** pixels SHALL be written directly to the `Uint8ClampedArray`
- **AND** the Zustand store SHALL NOT be updated until the stroke ends

#### Scenario: State committed on pointer up
- **WHEN** the user releases the pointer (ends stroke)
- **THEN** the Zustand store SHALL be updated with the final state
- **AND** a history snapshot SHALL be committed

### Requirement: Stroke buffering
The system SHALL buffer stroke data and create a single undo entry for the entire stroke, not per-pixel or per-event entries.

#### Scenario: One undo entry per stroke
- **WHEN** the user draws a drag stroke with many pointer events
- **THEN** a single undo entry SHALL be created for the entire stroke
- **AND** undoing reverses the entire stroke at once

#### Scenario: Region snapshot on stroke start
- **WHEN** the user presses the pointer to start a stroke
- **THEN** a RegionSnapshot of the affected layer(s) SHALL be captured
- **AND** stored for undo on stroke completion

### Requirement: Pencil tool
The system SHALL provide a pencil tool that draws individual pixels on the active layer using the foreground color when the user clicks or drags on the canvas.

#### Scenario: Click to place pixel
- **WHEN** the pencil tool is active and the user clicks a pixel
- **THEN** that single pixel SHALL be set to the foreground color

#### Scenario: Drag to draw continuous line
- **WHEN** the pencil tool is active and the user drags across the canvas
- **THEN** all pixels along the drag path SHALL be set to the foreground color
- **AND** the line SHALL be continuous with no gaps (Bresenham interpolation)

### Requirement: Eraser tool
The system SHALL provide an eraser tool that sets pixels on the active layer to fully transparent (RGBA: 0,0,0,0) when the user clicks or drags.

#### Scenario: Click to erase pixel
- **WHEN** the eraser tool is active and the user clicks a pixel
- **THEN** that pixel SHALL become fully transparent

#### Scenario: Erase selection
- **WHEN** the eraser tool is active and a selection exists
- **THEN** only pixels within the selection SHALL be erased

### Requirement: Fill bucket tool
The system SHALL provide a fill bucket tool that performs flood fill on contiguous pixels matching a color, replacing them with the foreground color.

#### Scenario: Fill contiguous area
- **WHEN** the fill bucket tool is active and the user clicks a pixel
- **THEN** all contiguous pixels of similar color SHALL be replaced with the foreground color

#### Scenario: Fill all matching colors
- **WHEN** the user holds Shift and clicks with the fill bucket
- **THEN** ALL pixels of similar color on the layer SHALL be replaced (not just contiguous)

#### Scenario: Tolerance setting
- **WHEN** the fill bucket has a tolerance value of N
- **THEN** pixels within N color distance (Euclidean in RGBA space) of the clicked pixel SHALL match for fill operations

### Requirement: Color picker tool
The system SHALL provide a color picker (eyedropper) tool that samples the color at the clicked pixel and sets it as the foreground color.

#### Scenario: Pick foreground color
- **WHEN** the color picker tool is active and the user clicks a pixel
- **THEN** the foreground color SHALL be set to that pixel's color

#### Scenario: Pick background color
- **WHEN** the color picker tool is active and the user right-clicks a pixel
- **THEN** the background color SHALL be set to that pixel's color

### Requirement: Line tool
The system SHALL provide a line tool that draws straight lines between two points using the foreground color.

#### Scenario: Draw straight line
- **WHEN** the line tool is active and the user clicks and drags
- **THEN** a preview line SHALL be shown from the start point to the current cursor position
- **AND** on release, a straight line SHALL be drawn

#### Scenario: Pixel-perfect line
- **WHEN** the line tool is in pixel-perfect mode
- **THEN** the line SHALL use Bresenham's line algorithm for pixel-perfect rendering

### Requirement: Shape tools
The system SHALL provide rectangle, circle, and ellipse shape tools that draw outlined or filled shapes using the foreground color.

#### Scenario: Draw outlined rectangle
- **WHEN** the rectangle shape tool is active and the user drags
- **THEN** an outlined rectangle SHALL be drawn from the start to end point

#### Scenario: Draw filled rectangle
- **WHEN** the filled rectangle tool is active and the user drags
- **THEN** a filled rectangle SHALL be drawn

#### Scenario: Draw outlined circle/ellipse
- **WHEN** the circle or ellipse tool is active and the user drags
- **THEN** an outlined circle or ellipse SHALL be drawn

#### Scenario: Draw filled circle/ellipse
- **WHEN** the filled circle or ellipse tool is active and the user drags
- **THEN** a filled circle or ellipse SHALL be drawn

### Requirement: Curve tool
The system SHALL provide a Bezier curve tool that draws smooth curves by placing control points.

#### Scenario: Draw Bezier curve
- **WHEN** the curve tool is active and the user places control points
- **THEN** a Bezier curve SHALL be rendered using pixel-perfect approximation

### Requirement: Spray tool
The system SHALL provide a spray tool that scatters random pixels in an area around the cursor.

#### Scenario: Spray pixels
- **WHEN** the spray tool is active and the user clicks or drags
- **THEN** random pixels SHALL be placed within the spray radius using the foreground color

#### Scenario: Density control
- **WHEN** the spray density setting is adjusted
- **THEN** the proportion of pixels filled within the spray area SHALL change accordingly
