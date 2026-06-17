## Purpose
Schema metadata extraction utilities for valibot pipe schemas, enabling annotation-based field metadata.
## Requirements
### Requirement: Extract metadata from pipe schema

The system SHALL provide a function `getSchemaMetadata(schema)` that extracts metadata annotations from a valibot pipe schema.

#### Scenario: Returns metadata from pipe with metadata()

- **WHEN** a `v.pipe(v.string(), metadata({ visibleWhen: { field: "x", value: true } }))` schema is passed
- **THEN** the function SHALL return `{ visibleWhen: { field: "x", value: true } }`

#### Scenario: Returns null for schema without metadata

- **WHEN** a `v.pipe(v.string(), v.minLength(1))` schema is passed
- **THEN** the function SHALL return `null`

#### Scenario: Returns null for non-pipe schema

- **WHEN** a `v.string()` schema is passed
- **THEN** the function SHALL return `null`

#### Scenario: Unwraps nullish wrapper before metadata extraction

- **WHEN** `v.nullish(v.pipe(v.string(), metadata({ visibleWhen: { field: "x", value: true } })))` is passed
- **THEN** the function SHALL return the metadata from the inner pipe schema

#### Scenario: Multiple metadata actions — last one wins

- **WHEN** a pipe has two `metadata()` actions
- **THEN** the function SHALL return the metadata from the last `metadata()` action

### Requirement: Detect pipe schema with metadata in type detection

The system SHALL correctly detect the base type of a pipe schema that also has metadata, **including metadata-based special type
detection**.

#### Scenario: Pipe with metadata still detects as string

- **WHEN** `v.pipe(v.string(), metadata({ visibleWhen: { field: "x", value: true } }))` is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"string"`

#### Scenario: Pipe with metadata still detects as number

- **WHEN** `v.pipe(v.number(), v.minValue(0), metadata({ visibleWhen: { field: "x", value: true } }))` is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"number"`

#### Scenario: Pipe with metadata type annotation detects as special type

- **WHEN** `v.pipe(MindustryHexColorSchema, metadata({ visibleWhen: { field: "gas", value: true } }))` is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"color"` (inner schema's metadata type takes precedence)

### Requirement: Weapon schema metadata extractable

The `getSchemaMetadata` function SHALL work on weapon schema fields wrapped with `metadata()`.

#### Scenario: Weapon field metadata extraction

- **WHEN** a weapon schema field with `metadata({ name: "editor.weapon.reload", description: "editor.weapon.reload-description" })` is passed to `getSchemaMetadata`
- **THEN** the returned metadata SHALL contain `{ name: "editor.weapon.reload", description: "editor.weapon.reload-description" }`

