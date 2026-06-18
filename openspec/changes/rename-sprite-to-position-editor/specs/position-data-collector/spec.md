## ADDED Requirements

### Requirement: collectPositionData exports from @project/schema
The system SHALL export a function `collectPositionData` from `@project/schema` that replaces the old `collectRegionData`. All `*RegionData` types SHALL be renamed to `*PositionData` counterparts. `resolveRegionType` SHALL be renamed to `resolvePositionType`. The old names SHALL NOT be exported.

#### Scenario: collectPositionData replaces collectRegionData
- **WHEN** a consumer imports from `@project/schema`
- **THEN** `collectPositionData` SHALL be available instead of `collectRegionData`
- **AND** `collectRegionData` SHALL NOT be exported

#### Scenario: Types renamed
- **WHEN** a consumer imports position data types from `@project/schema`
- **THEN** `SpritePositionData`, `EnginePositionData`, `ShootPositionData`, `PartPositionData`, `DrawPositionData`, `UnknownPositionData`, and `PositionData` union type SHALL be available
- **AND** the old `*RegionData` type names SHALL NOT be exported

### Requirement: Field exclusion in position data collection
The system SHALL exclude objects with `x`/`y` from position data when they match a known non-position field set. The excluded field set SHALL include: `shadowElevation`, `shadowElevationScl`, `rippleScale`, `waveTrailX`, `waveTrailY`, `circleTargetRadius`, `outlineRadius`, `trailLength`, `trailScl`, `xRand`, `yRand`, `heatColor`, `inaccuracy`, `shootCone`, `layerOffset`, `heatLayerOffset`, `turretHeatLayer`, `outlineLayerOffset`, `blending`, and `moves`.

#### Scenario: Non-position fields excluded
- **WHEN** `collectPositionData` visits an object with `x`, `y` whose parent key matches an excluded name (e.g., `shadowElevation`)
- **THEN** the object SHALL NOT be included in the returned position data array

#### Scenario: Normal position fields still collected
- **WHEN** `collectPositionData` visits an object with `x`, `y` whose parent key does NOT match an excluded name
- **THEN** it SHALL be included in the returned position data array with the appropriate type

### Requirement: Position data maintains type-aware payload
Each position data entry SHALL carry type-specific data beyond the base position: sprite entries carry `name`, `path`, `mirror`; engine entries carry `radius`, `rotation`; shoot entries carry only position; part entries carry optional `name`, `mirror`; draw-region entries carry optional `name`, `suffix`.

#### Scenario: Engine position data includes radius and rotation
- **WHEN** an engine-type position is collected
- **THEN** the entry SHALL have type `"engine"` with `radius` and `rotation` fields containing `{ value, path }` objects
