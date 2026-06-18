## ADDED Requirements

### Requirement: PositionEditor replaces SpriteEditor
The system SHALL rename `SpriteEditor` to `PositionEditor`, `SpriteSidebar` to `PositionSidebar`, `SpritePreview` to `PositionPreview`, and all supporting components (`SpriteImage` → `PositionImage`, `RegionPlaceholder` → `PositionPlaceholder`, `EnginePlaceholder` → `EnginePositionPlaceholder`, `ShootPlaceholder` → `ShootPositionPlaceholder`). The directory `sprite/` SHALL be renamed to `position-editor/`. The wrapper `UnitSpriteEditor` (`UnitSpritEdior.tsx`) SHALL be renamed to `UnitPositionEditor` with the filename typo fixed.

#### Scenario: Component exports renamed
- **WHEN** another module imports from the position editor directory
- **THEN** all component names SHALL use the `Position*` naming convention
- **AND** the file path SHALL be `components/editor/position-editor/`

### Requirement: Sidebar renders previews for all position types
The `PositionSidebar` SHALL render meaningful previews for all position types (sprite, engine, shoot, part, draw-region), not just sprites. Engine entries SHALL display radius and rotation info. Shoot entries SHALL display their type label. Part and draw-region entries SHALL display their name/suffix info.

#### Scenario: Engine entry in sidebar shows radius and rotation
- **WHEN** an engine-type position entry is in the sprites array
- **THEN** the sidebar SHALL display `r=<radius> rot=<rotation>` alongside the type label

#### Scenario: Non-sprite entries show type label and coordinates
- **WHEN** a non-sprite position entry (shoot, part, draw-region, unknown) is in the sprites array
- **THEN** the sidebar SHALL display the type label, any extra info, and the x/y coordinates

### Requirement: i18n keys updated
All i18n translation keys SHALL be renamed from `sprite-editor.*` to `position-editor.*` in both English and Vietnamese locale files.

#### Scenario: English keys renamed
- **WHEN** the UI renders the open/close buttons for the position editor
- **THEN** the keys `"position-editor.open"` and `"position-editor.close"` SHALL be used
- **AND** `"sprite-editor.open"` and `"sprite-editor.close"` SHALL NOT be referenced

#### Scenario: Vietnamese keys renamed
- **WHEN** the Vietnamese locale is active
- **THEN** the keys `"position-editor.open"` and `"position-editor.close"` SHALL be present in the Vietnamese locale file

### Requirement: EditorShell and UnitPanel reference updated
`EditorShell.ts` SHALL lazy-import `UnitPositionEditor` instead of `UnitSpriteEditor`. `UnitPanel.tsx` SHALL use `"position-editor"` route type and updated i18n keys.

#### Scenario: Lazy import updated
- **WHEN** `EditorShell.ts` resolves a `"sprite"` route
- **THEN** it SHALL lazy-import from `"#/components/editor/position-editor/UnitPositionEditor"`
- **AND** render `<UnitPositionEditor />`

#### Scenario: UnitPanel toggle updated
- **WHEN** the user opens the position editor from the unit panel
- **THEN** the button labels SHALL use `"position-editor.open"` / `"position-editor.close"` i18n keys
