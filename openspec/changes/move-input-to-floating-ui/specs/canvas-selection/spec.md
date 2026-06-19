## ADDED Requirements

### Requirement: Canvas item click-to-select
The system SHALL allow users to click on any canvas item (sprite, engine, shoot, part, draw-region) to select it.

#### Scenario: Click sprite item selects it
- **WHEN** user clicks on a sprite item on the canvas
- **THEN** the clicked item becomes the selected item
- **AND** a highlighted border appears around the item

#### Scenario: Click shoot item selects it
- **WHEN** user clicks on a shoot item on the canvas
- **THEN** the shoot item becomes selected

#### Scenario: Click empty area deselects
- **WHEN** user clicks on empty canvas area (not on any item or the base sprite)
- **THEN** selection is cleared

### Requirement: Selected item visual highlight
The selected canvas item SHALL display a visible highlighted border to indicate its selected state.

#### Scenario: Selected sprite shows border
- **WHEN** a sprite item is selected on the canvas
- **THEN** the item displays a dashed bright border (e.g., yellow/cyan stroke) around its bounds

#### Scenario: Selected shoot shows border
- **WHEN** a shoot item is selected on the canvas
- **THEN** the shoot crosshair displays a highlighted ring or border

#### Scenario: Selected engine shows border
- **WHEN** an engine item is selected on the canvas
- **THEN** the engine circle displays a highlighted border

### Requirement: Sidebar preview highlight
The PositionPreview card corresponding to the selected item SHALL display a highlight indicator in the sidebar.

#### Scenario: Selected preview highlighted
- **WHEN** a canvas item is selected
- **THEN** the matching PositionPreview card in the sidebar shows a highlighted border (e.g., `ring-2 ring-primary`)
- **AND** all other preview cards have normal styling

#### Scenario: Deselection clears highlight
- **WHEN** selection is cleared
- **THEN** no preview card is highlighted

### Requirement: Selection by path key
Selection SHALL be identified by the HJSON path key (`position.x.path`) for matching between canvas items and sidebar entries.

#### Scenario: Same key matches across views
- **WHEN** a canvas item is selected
- **THEN** its `position.x.path` is stored as the selection key
- **AND** the PositionPreview with the same key in the sidebar gets the highlight
