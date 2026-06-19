## ADDED Requirements

### Requirement: Floating input UI on selection
When a canvas item is selected, the system SHALL display a floating overlay on the canvas near the selected item with X/Y coordinate input fields.

#### Scenario: Floating UI appears on selection
- **WHEN** a canvas item is selected
- **THEN** a floating overlay appears on the canvas near the selected item
- **AND** the overlay contains X and Y number input fields pre-filled with the item's current coordinates

#### Scenario: Floating UI hides on deselect
- **WHEN** selection is cleared (click empty area)
- **THEN** the floating UI disappears

#### Scenario: Floating UI updates position on drag
- **WHEN** the selected item is dragged on the canvas
- **THEN** the floating UI follows the item's new position
- **AND** the input fields update to reflect the new coordinates

### Requirement: Coordinate input editing
The floating UI SHALL allow users to type numeric X/Y values that update the selected item's position.

#### Scenario: Type X value updates position
- **WHEN** user types a new value in the X input field
- **THEN** after debounce (200ms), the item's X position updates via HJSON write
- **AND** the canvas item moves to the new position

#### Scenario: Type Y value updates position
- **WHEN** user types a new value in the Y input field
- **THEN** after debounce, the item's Y position updates via HJSON write
- **AND** the canvas item moves to the new position

#### Scenario: Enter commits immediately
- **WHEN** user presses Enter in an input field
- **THEN** the value is committed immediately (no debounce)

#### Scenario: Escape reverts to original
- **WHEN** user presses Escape in an input field
- **THEN** the input reverts to the item's current value

### Requirement: Floating UI positioning
The floating overlay SHALL be positioned relative to the selected canvas item's screen coordinates.

#### Scenario: Positioned above the item
- **WHEN** a canvas item is selected and there is sufficient space above
- **THEN** the floating UI appears above the selected item

#### Scenario: Adjusts when near edge
- **WHEN** the selected item is near the top of the canvas
- **THEN** the floating UI appears below the item instead

#### Scenario: Follows canvas zoom/pan
- **WHEN** the canvas is zoomed or panned
- **THEN** the floating UI repositions to stay aligned with the selected item

### Requirement: Sidebar preview cards lose inputs
The PositionPreview cards in the sidebar SHALL no longer contain X/Y input fields.

#### Scenario: Preview card no footer inputs
- **WHEN** any PositionPreview card is rendered in the sidebar
- **THEN** it does not display X/Y input fields in its footer
- **AND** the footer section is removed from the card layout

#### Scenario: Preview card retains other content
- **WHEN** a PositionPreview card is rendered
- **THEN** it still displays the eye toggle, type label, mirror indicator, and image preview as before
