## ADDED Requirements

### Requirement: Layer data model
The system SHALL maintain an ordered list of layers per canvas, where each layer has: name, visibility flag, opacity (0-1), blend mode, lock flag, and a `Uint8ClampedArray` of RGBA pixel data.

#### Scenario: Default layer
- **WHEN** a new canvas is created
- **THEN** it SHALL contain one default layer named "Layer 1"

### Requirement: Layer CRUD operations
The system SHALL allow creating, deleting, duplicating, and renaming layers.

#### Scenario: New layer
- **WHEN** the user creates a new layer
- **THEN** a new transparent layer SHALL be added above the currently active layer

#### Scenario: Delete layer
- **WHEN** the user deletes a layer
- **THEN** the layer SHALL be removed from the list
- **AND** if it was the active layer, the layer below (or above if none below) SHALL become active

#### Scenario: Can't delete last layer
- **WHEN** the user tries to delete the only remaining layer
- **THEN** deletion SHALL be prevented

#### Scenario: Duplicate layer
- **WHEN** the user duplicates a layer
- **THEN** a copy of the layer with its pixel data SHALL be added above the source layer

#### Scenario: Rename layer
- **WHEN** the user renames a layer
- **THEN** the layer's name SHALL update

### Requirement: Layer visibility
The system SHALL allow toggling layer visibility. Hidden layers SHALL be excluded from the composited output.

#### Scenario: Toggle visibility
- **WHEN** the user clicks the visibility icon on a layer
- **THEN** the layer SHALL toggle between visible and hidden

#### Scenario: Solo layer
- **WHEN** the user Alt+clicks a layer's visibility icon
- **THEN** all other layers SHALL be hidden
- **AND** only the clicked layer SHALL remain visible

### Requirement: Layer lock
The system SHALL allow locking a layer to prevent editing.

#### Scenario: Lock layer
- **WHEN** a layer is locked
- **THEN** no drawing or editing operations SHALL modify its pixel data

### Requirement: Layer reordering
The system SHALL allow moving layers up, down, to the top, or to the bottom of the layer stack.

#### Scenario: Move layer up
- **WHEN** the user moves a layer up
- **THEN** it SHALL swap positions with the layer above

#### Scenario: Move layer to top
- **WHEN** the user moves a layer to top
- **THEN** it SHALL become the topmost layer

### Requirement: Layer opacity
The system SHALL support per-layer opacity from 0 (fully transparent) to 1 (fully opaque).

#### Scenario: Adjust layer opacity
- **WHEN** the user adjusts a layer's opacity slider
- **THEN** the layer's opacity SHALL update in real time
- **AND** the canvas preview SHALL reflect the change

### Requirement: Blend modes
The system SHALL support common blend modes for layers: Normal, Multiply, Screen, Overlay, Darken, Lighten, Difference, Additive.

#### Scenario: Change blend mode
- **WHEN** the user selects a different blend mode for a layer
- **THEN** the canvas preview SHALL update to reflect the new blend mode

### Requirement: Layer groups
The system SHALL support grouping layers into folders for organization, with collapsible/expandable groups.

#### Scenario: Create group
- **WHEN** the user creates a layer group
- **THEN** a new empty group folder SHALL appear in the layer list

#### Scenario: Collapse group
- **WHEN** the user collapses a group
- **THEN** all layers within the group SHALL be hidden from the layer list view

#### Scenario: Expand group
- **WHEN** the user expands a group
- **THEN** all layers within the group SHALL become visible in the layer list
