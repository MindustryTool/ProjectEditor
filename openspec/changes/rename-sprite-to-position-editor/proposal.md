## Why

The current "Sprite Editor" has evolved beyond sprite-only rendering — it handles engines, shoot points, parts, draw-regions, and other positioned entities. The naming is misleading and limits the mental model. Renaming to "Position Editor" better reflects what the feature does: visualize and edit all position-bearing elements in a unit schema.

## What Changes

- **BREAKING**: Rename `collectRegionData` → `collectPositionData` in `@project/schema`
- **BREAKING**: Rename all `*RegionData` types → `*PositionData` (e.g., `SpriteRegionData` → `SpritePositionData`, `EngineRegionData` → `EnginePositionData`, etc.)
- **BREAKING**: Rename `resolveRegionType` → `resolvePositionType`
- **BREAKING**: Rename `SpriteEditor` component → `PositionEditor`
- **BREAKING**: Rename `SpriteSidebar` (inline) → `PositionSidebar`
- **BREAKING**: Rename `SpritePreview` (inline) → `PositionPreview`
- **BREAKING**: Rename `UnitSpriteEditor` → `UnitPositionEditor` (and fix filename typo `UnitSpritEdior.tsx` → `UnitPositionEditor.tsx`)
- **BREAKING**: Rename file directory `sprite/` → `position-editor/`
- **BREAKING**: Rename `SpriteImage` → `PositionImage`
- **BREAKING**: Rename `RegionPlaceholder` → `PositionPlaceholder` (and `EnginePlaceholder`, `ShootPlaceholder`)
- **BREAKING**: Rename `updateSpritePosition` → `updatePositionData`
- **BREAKING**: Update lazy imports, route names, and i18n keys (`sprite-editor.*` → `position-editor.*`)
- **Add**: Exclude non-position fields from collection (`shadowElevation`, `shadowElevationScl`, `rippleScale`, `waveTrailX`, `waveTrailY`, `circleTargetRadius`, `outlineRadius`, `trailLength`, `trailScl`, `xRand`, `yRand`, `heatColor`, `inaccuracy`, `shootCone`, `layerOffset`, `heatLayerOffset`, `turretHeatLayer`, `outlineLayerOffset`, `blending`, `moves`)
- **Add**: `PositionSidebar` renders previews for all position types (engine, shoot, part, draw-region) not just sprites

## Capabilities

### New Capabilities
- `position-data-collector`: Enhanced position data collection with exclusion list for non-position fields
- `position-editor-sidebar`: Sidebar supporting previews for all position types (sprite, engine, shoot, part, draw-region)

### Modified Capabilities
- `schema-renderer`: `collectRegionData` → `collectPositionData` rename, added field exclusion logic
- `pixel-editor-view`: Dependency imports will reference renamed types

## Impact

- `packages/schema/src/utils.ts`: Rename types, function, add exclusion logic
- `packages/schema/src/index.ts`: Update re-exports
- `apps/web/src/components/editor/sprite/`: Rename all files and internal references
- `apps/web/src/components/editor/EditorShell.tsx`: Update lazy import
- `apps/web/src/components/editor/right/UnitPanel.tsx`: Update route/type references
- `apps/web/src/i18n/locales/en/common.ts` + `vi/common.ts`: Update i18n keys
- All files importing from `@project/schema` that reference `RegionData` or `collectRegionData`
