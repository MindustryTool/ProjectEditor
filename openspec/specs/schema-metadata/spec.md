## Requirements

### Requirement: Extract metadata from pipe schema
The system SHALL provide a function `getSchemaMetadata(schema)` that extracts metadata annotations from a valibot pipe schema.

#### Scenario: Returns metadata from pipe with v.metadata()
- **WHEN** a `v.pipe(v.string(), v.metadata({ visibleWhen: { field: "x", value: true } }))` schema is passed
- **THEN** the function SHALL return `{ visibleWhen: { field: "x", value: true } }`

#### Scenario: Returns null for schema without metadata
- **WHEN** a `v.pipe(v.string(), v.minLength(1))` schema is passed
- **THEN** the function SHALL return `null`

#### Scenario: Returns null for non-pipe schema
- **WHEN** a `v.string()` schema is passed
- **THEN** the function SHALL return `null`

#### Scenario: Unwraps nullish wrapper before metadata extraction
- **WHEN** `v.nullish(v.pipe(v.string(), v.metadata({ visibleWhen: { field: "x", value: true } })))` is passed
- **THEN** the function SHALL return the metadata from the inner pipe schema

#### Scenario: Multiple metadata actions — last one wins
- **WHEN** a pipe has two `v.metadata()` actions
- **THEN** the function SHALL return the metadata from the last `v.metadata()` action

### Requirement: Detect pipe schema with metadata in type detection
The system SHALL correctly detect the base type of a pipe schema that also has metadata.

#### Scenario: Pipe with metadata still detects as string
- **WHEN** `v.pipe(v.string(), v.metadata({ visibleWhen: { field: "x", value: true } }))` is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"string"`

#### Scenario: Pipe with metadata still detects as number
- **WHEN** `v.pipe(v.number(), v.minValue(0), v.metadata({ visibleWhen: { field: "x", value: true } }))` is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"number"`
