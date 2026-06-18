## ADDED Requirements

### Requirement: Dedicated preview per sprite type
The system SHALL render a dedicated preview component for each position type in the sidebar, replacing the monolithic `PositionPreview` component.

#### Scenario: Sprite type preview
- **WHEN** a position has `type: "sprite"`
- **THEN** the sidebar SHALL render a `SpritePreview` component showing the sprite thumbnail, name, dimensions, and mirror status

#### Scenario: Engine type preview
- **WHEN** a position has `type: "engine"`
- **THEN** the sidebar SHALL render an `EnginePreview` component showing the engine name, radius value, and rotation value

#### Scenario: Shoot type preview
- **WHEN** a position has `type: "shoot"`
- **THEN** the sidebar SHALL render a `ShootPreview` component showing the weapon name, weapon position, and shoot offset

#### Scenario: Part type preview
- **WHEN** a position has `type: "part"`
- **THEN** the sidebar SHALL render a `PartPreview` component showing the part name and mirror status

#### Scenario: Draw-region type preview
- **WHEN** a position has `type: "draw-region"`
- **THEN** the sidebar SHALL render a `DrawRegionPreview` component showing the region name and suffix

### Requirement: Click-to-scroll behavior preserved
Each preview component SHALL support clicking to scroll to the corresponding HJSON element in the text editor, maintaining the existing `scrollTo` functionality.

#### Scenario: Click preview scrolls to HJSON
- **WHEN** user clicks any preview card
- **THEN** the text editor scrolls to the corresponding position element by ID path
- **AND** the element receives focus

### Requirement: ImageFilePreview usage for sprite types
The `SpritePreview` component SHALL use the existing `ImageFilePreview` shared component to render lazy-loaded sprite thumbnails.

#### Scenario: Sprite thumbnail loading
- **WHEN** a sprite preview is rendered
- **THEN** the sprite image is loaded lazily via `ImageFilePreview`
- **AND** the component displays image dimensions once loaded
