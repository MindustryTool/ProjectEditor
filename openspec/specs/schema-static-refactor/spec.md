## ADDED Requirements

### Requirement: Static schema constants extracted to top level
Each schema file SHALL extract all pure-data object schema definitions (those with no SchemaFn context dependency) into top-level named constants.

#### Scenario: ParticleEffect schema extracted
- **WHEN** inspecting `effect.ts`
- **THEN** `ParticleEffect`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `particleEffectObjectSchema`

#### Scenario: ExplosionEffect schema extracted
- **WHEN** inspecting `effect.ts`
- **THEN** `ExplosionEffect`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `explosionEffectObjectSchema`

#### Scenario: WaveEffect schema extracted
- **WHEN** inspecting `effect.ts`
- **THEN** `WaveEffect`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `waveEffectObjectSchema`

#### Scenario: ShootAlternate schema extracted
- **WHEN** inspecting `shoot-pattern.ts`
- **THEN** `ShootAlternate`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `shootAlternateObjectSchema`

#### Scenario: ShootBarrel schema extracted
- **WHEN** inspecting `shoot-pattern.ts`
- **THEN** `ShootBarrel`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `shootBarrelObjectSchema`

#### Scenario: ShootHelix schema extracted
- **WHEN** inspecting `shoot-pattern.ts`
- **THEN** `ShootHelix`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `shootHelixObjectSchema`

#### Scenario: ShootSine schema extracted
- **WHEN** inspecting `shoot-pattern.ts`
- **THEN** `ShootSine`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `shootSineObjectSchema`

#### Scenario: ShootSpread schema extracted
- **WHEN** inspecting `shoot-pattern.ts`
- **THEN** `ShootSpread`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `shootSpreadObjectSchema`

#### Scenario: ShootSummon schema extracted
- **WHEN** inspecting `shoot-pattern.ts`
- **THEN** `ShootSummon`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `shootSummonObjectSchema`

#### Scenario: FlarePart schema extracted
- **WHEN** inspecting `part.ts`
- **THEN** `FlarePart`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `flarePartObjectSchema`

#### Scenario: HaloPart schema extracted
- **WHEN** inspecting `part.ts`
- **THEN** `HaloPart`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `haloPartObjectSchema`

#### Scenario: HoverPart schema extracted
- **WHEN** inspecting `part.ts`
- **THEN** `HoverPart`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `hoverPartObjectSchema`

#### Scenario: ShapePart schema extracted
- **WHEN** inspecting `part.ts`
- **THEN** `ShapePart`'s inline object schema in `classSchemaMap` SHALL be a top-level exported constant named `shapePartObjectSchema`

### Requirement: Context-dependent schemas stay inline
Factory functions that reference SchemaFn calls (EffectHjsonSchema, BulletHjsonSchema, PartHjsonSchema, ShootPatternHjsonSchema) SHALL remain inline in classSchemaMap without extraction to static constants.

#### Scenario: MultiEffect stays inline
- **WHEN** inspecting `effect.ts`
- **THEN** `MultiEffect` factory function SHALL remain inline because it calls `createEffectArraySchema`

#### Scenario: SeqEffect stays inline
- **WHEN** inspecting `effect.ts`
- **THEN** `SeqEffect` factory function SHALL remain inline because it calls `createEffectArraySchema`

#### Scenario: RadialEffect stays inline
- **WHEN** inspecting `effect.ts`
- **THEN** `RadialEffect` factory function SHALL remain inline because it calls `EffectHjsonSchema` via `createEffectFieldSchema`

#### Scenario: SoundEffect stays inline
- **WHEN** inspecting `effect.ts`
- **THEN** `SoundEffect` factory function SHALL remain inline because it calls `EffectHjsonSchema` and `SoundHjsonSchema`

#### Scenario: WrapEffect stays inline
- **WHEN** inspecting `effect.ts`
- **THEN** `WrapEffect` factory function SHALL remain inline because it calls `EffectHjsonSchema`

#### Scenario: ShootMulti stays inline
- **WHEN** inspecting `shoot-pattern.ts`
- **THEN** `ShootMulti` factory function SHALL remain inline because it calls `ShootPatternHjsonSchema`

#### Scenario: RegionPart stays inline
- **WHEN** inspecting `part.ts`
- **THEN** `RegionPart` factory function SHALL remain inline because it calls `PartHjsonSchema` for children

#### Scenario: EffectSpawnerPart stays inline
- **WHEN** inspecting `part.ts`
- **THEN** `EffectSpawnerPart` factory function SHALL remain inline because it calls `EffectHjsonSchema`

### Requirement: Static constants merged via spread in exported SchemaFn
Extracted static constants SHALL be merged into the exported schema function using object spread of `.entries` property, following the existing pattern in `effect.ts`.

#### Scenario: Static entries spread into class schema
- **WHEN** exported SchemaFn creates a class-specific schema
- **THEN** it SHALL use `v.object({ ...baseSchema.entries, ...classSchema.entries })` to merge static base with class-specific entries

### Requirement: Runtime behavior unchanged
The refactoring SHALL NOT change the validation behavior of any exported schema.

#### Scenario: Same schema output for same input
- **WHEN** the same HJSON value and context are passed to a SchemaFn before and after refactoring
- **THEN** the resulting valibot schema SHALL produce identical validation results for all inputs
