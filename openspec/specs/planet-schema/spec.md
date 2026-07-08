## Requirements

### Requirement: PlanetSchema validates basic fields
The system SHALL provide a PlanetSchema that validates a planet object with fields including radius, sectorSize, orbitSpacing, camRadius, and position.

#### Scenario: Valid basic planet
- **WHEN** a planet object has `radius: 1`, `sectorSize: 6`, `orbitSpacing: 12`, `camRadius: 0`, `position: { x: 0, y: 0, z: 0 }`
- **THEN** the schema SHALL return a valid result

#### Scenario: Null radius uses default 1
- **WHEN** radius is not provided
- **THEN** the schema SHALL default radius to 1

#### Scenario: Zero or negative radius rejected
- **WHEN** radius is 0 or negative
- **THEN** the schema SHALL reject with a validation error

#### Scenario: Non-integer sectorSize rejected
- **WHEN** sectorSize is 1.5
- **THEN** the schema SHALL reject with a validation error

### Requirement: PlanetSchema validates orbital rendering fields
The system SHALL validate orbital and rendering fields: minZoom, maxZoom, drawOrbit, atmosphereRadIn, atmosphereRadOut, clipRadius, orbitTime, rotateTime, orbitOffset, tidalLock, bloom, visible, icon, hasAtmosphere.

#### Scenario: Valid orbital fields
- **WHEN** a planet has `minZoom: 0.5`, `maxZoom: 2`, `drawOrbit: true`, `atmosphereRadIn: 0`, `atmosphereRadOut: 0.3`, `visible: true`, `bloom: false`, `hasAtmosphere: true`
- **THEN** the schema SHALL return a valid result

#### Scenario: Boolean fields accept true/false
- **WHEN** `tidalLock`, `bloom`, `visible`, `hasAtmosphere` are set to boolean values
- **THEN** the schema SHALL validate them correctly

### Requirement: PlanetSchema validates atmosphere color fields
The system SHALL validate color fields (landCloudColor, lightColor, atmosphereColor, iconColor) using MindustryHexColorSchema.

#### Scenario: Valid hex color values
- **WHEN** color fields are set to valid hex strings like `"ffffff"` or `"ff0000"`
- **THEN** the schema SHALL return a valid result

#### Scenario: Invalid hex color rejected
- **WHEN** a color field has an invalid value like `"xyz"`
- **THEN** the schema SHALL reject with a validation error

### Requirement: PlanetSchema validates environment fields
The system SHALL validate environment and gameplay fields: accessible, defaultEnv, defaultAttributes, updateLighting, lightSrcFrom, lightSrcTo, lightDstFrom, lightDstTo, startSector, sectorSeed, launchCapacityMultiplier, enemyBuildSpeedMultiplier, enemyFactoryActivationDelay, enemyInfiniteItems, enemyCoreSpawnReplace, prebuildBase, allowWaves, allowLaunchSchematics, allowLaunchLoadout, allowSectorInvasion, allowLegacyLaunchPads, clearSectorOnLose, allowLaunchToNumbered, allowCampaignRules, showRtsAIRule, loadPlanetData.

#### Scenario: Valid environment fields
- **WHEN** a planet has `accessible: true`, `updateLighting: true`, `lightSrcFrom: 0`, `lightSrcTo: 0.8`, `startSector: 0`, `launchCapacityMultiplier: 0.25`, `enemyBuildSpeedMultiplier: 1`
- **THEN** the schema SHALL return a valid result

#### Scenario: Normalized light values clamped to 0-1
- **WHEN** lightSrcFrom, lightSrcTo, lightDstFrom, lightDstTo are between 0 and 1
- **THEN** the schema SHALL validate them correctly

### Requirement: PlanetSchema validates content reference fields
The system SHALL validate content reference fields as strings: parent, generator, statParent, defaultCore, launchMusic, techTree, icon.

#### Scenario: Valid content reference as string
- **WHEN** `parent` is set to a string like `"serpulo"`
- **THEN** the schema SHALL accept the value

#### Scenario: launchCandidates as string array
- **WHEN** `launchCandidates` is an array of planet name strings
- **THEN** the schema SHALL validate each element as a string

#### Scenario: unlockedOnLand as string array
- **WHEN** `unlockedOnLand` is an array of content name strings
- **THEN** the schema SHALL validate each element as a string

#### Scenario: sectorCaptureReplacements as string map
- **WHEN** `sectorCaptureReplacements` is an object mapping block names to block names
- **THEN** the schema SHALL validate it as a record of strings

### Requirement: PlanetHjsonSchema wraps PlanetSchema with content reference
The system SHALL provide PlanetHjsonSchema as a SchemaFn that extends PlanetSchema with a research field matching the pattern in SectorHjsonSchema.

#### Scenario: PlanetHjsonSchema accepts planet with research
- **WHEN** a planet object includes a `research` field with valid research data
- **THEN** the schema SHALL return a valid result

#### Scenario: PlanetHjsonSchema generated via cached context
- **WHEN** PlanetHjsonSchema is called with a ProjectContents context
- **THEN** it SHALL return a memoized object schema

### Requirement: Mesh schema type discriminating
The system SHALL validate planet mesh objects using a discriminated union based on a `type` field, supporting NoiseMesh, SunMesh, HexSkyMesh, MultiMesh, and MatMesh variants with full field validation.

#### Scenario: Valid planet with NoiseMesh
- **WHEN** a planet object includes `mesh: { type: "NoiseMesh", divisions: 4, octaves: 2 }`
- **THEN** the schema SHALL return a valid result

#### Scenario: Valid planet with SunMesh
- **WHEN** a planet object includes `mesh: { type: "SunMesh", divisions: 3, colors: ["ff0000"] }`
- **THEN** the schema SHALL return a valid result

#### Scenario: Valid planet with mesh array (multimesh)
- **WHEN** a planet object includes `mesh: [{ type: "NoiseMesh", divisions: 2, octaves: 1 }, { type: "NoiseMesh", divisions: 3, octaves: 2 }]`
- **THEN** the schema SHALL return a valid result

### Requirement: PlanetSchema fields have i18n metadata
The system SHALL annotate all new planet schema fields with `metadata()` containing i18n translation keys for name and description.

#### Scenario: Metadata present on all new fields
- **WHEN** a field like `minZoom`, `tidalLock`, or `atmosphereColor` is inspected
- **THEN** it SHALL have `metadata.name` set to an i18n key starting with `"editor.planet."`

#### Scenario: Metadata type hints for renderers
- **WHEN** a color field like `atmosphereColor` is inspected
- **THEN** its metadata SHALL be compatible with the hex-color renderer detection
