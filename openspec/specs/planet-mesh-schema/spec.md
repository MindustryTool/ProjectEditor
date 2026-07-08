## Requirements

### Requirement: Mesh schema validates NoiseMesh fields
The system SHALL validate a NoiseMesh object with fields: type, seed, divisions, radius, octaves, persistence, scale, mag, color1, color2, colorOct, colorPersistence, colorScale, colorThreshold.

#### Scenario: Valid NoiseMesh with all fields
- **WHEN** a NoiseMesh has `{ type: "NoiseMesh", divisions: 6, octaves: 4, radius: 1, persistence: 0.5, scale: 1, mag: 0.5, color1: "ffffff", color2: "000000", colorOct: 2, colorPersistence: 0.5, colorScale: 1, colorThreshold: 0.5 }`
- **THEN** the schema SHALL return a valid result

#### Scenario: NoiseMesh defaults to zero seed and 1 division
- **WHEN** a NoiseMesh has only `{ divisions: 4, octaves: 2 }`
- **THEN** seed SHALL default to 0, radius SHALL default to 1

#### Scenario: NoiseMesh rejects invalid hex colors
- **WHEN** color1 or color2 is not a valid hex string
- **THEN** the schema SHALL reject with a validation error

### Requirement: Mesh schema validates SunMesh fields
The system SHALL validate a SunMesh object with type, divisions, octaves, persistence, scl, pow, mag, colorScale, and colors array.

#### Scenario: Valid SunMesh with colors array
- **WHEN** a SunMesh has `{ type: "SunMesh", divisions: 4, octaves: 2, colors: ["ff0000", "00ff00", "0000ff"] }`
- **THEN** the schema SHALL return a valid result

#### Scenario: SunMesh defaults persistence to 0.5
- **WHEN** a SunMesh has only `{ type: "SunMesh", divisions: 2, colors: ["ffffff"] }`
- **THEN** persistence SHALL default to 0.5, scl to 1, pow to 1

### Requirement: Mesh schema validates HexSkyMesh fields
The system SHALL validate a HexSkyMesh object with type, seed, speed, radius, divisions, color, octaves, persistence, scale, thresh.

#### Scenario: Valid HexSkyMesh
- **WHEN** a HexSkyMesh has `{ type: "HexSkyMesh", divisions: 6, color: "4cb2ff", speed: 0.5 }`
- **THEN** the schema SHALL return a valid result

#### Scenario: HexSkyMesh defaults divisions to 3
- **WHEN** a HexSkyMesh has only `{ type: "HexSkyMesh" }`
- **THEN** divisions SHALL default to 3, radius to 1, seed to 0

### Requirement: Mesh schema validates MatMesh with nested mesh
The system SHALL validate a MatMesh object with type, mesh (nested mesh object), and mat (generic matrix object).

#### Scenario: Valid MatMesh with nested mesh
- **WHEN** a MatMesh has `{ type: "MatMesh", mesh: { type: "NoiseMesh", divisions: 4, octaves: 2 }, mat: {} }`
- **THEN** the schema SHALL return a valid result

### Requirement: Mesh schema validates MultiMesh with array of meshes
The system SHALL validate a MultiMesh object with type and meshes array.

#### Scenario: Valid MultiMesh with mesh array
- **WHEN** a MultiMesh has `{ type: "MultiMesh", meshes: [{ type: "NoiseMesh", divisions: 2, octaves: 1 }, { type: "HexSkyMesh", divisions: 4 }] }`
- **THEN** the schema SHALL return a valid result

### Requirement: Mesh fields have i18n metadata
The system SHALL annotate all mesh schema fields with `metadata()` containing i18n translation keys.

#### Scenario: Metadata on NoiseMesh color fields
- **WHEN** a NoiseMesh field like `color1` or `divisions` is inspected
- **THEN** it SHALL have `metadata.name` set to an i18n key starting with `"editor.planet.mesh."`
