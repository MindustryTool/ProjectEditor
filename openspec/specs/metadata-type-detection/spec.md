## Requirements

### Requirement: Detect schema type from metadata annotation
The system SHALL provide a mechanism to detect a schema's "special type" (e.g., "color", "research", "effect") from `v.metadata({ type: "..." })` annotations rather than from an external registry.

#### Scenario: Detects "color" from MindustryHexColorSchema metadata
- **WHEN** `MindustryHexColorSchema` is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"color"`

#### Scenario: Detects "color" through nullish wrapper
- **WHEN** `v.nullish(MindustryHexColorSchema)` is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"color"`

#### Scenario: Detects "research" from ResearchSchema metadata
- **WHEN** `ResearchSchema` (invoked) is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"research"`

#### Scenario: Detects "effect" from EffectSchema metadata
- **WHEN** `EffectSchema` (invoked) is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"effect"`

#### Scenario: No metadata returns unknown
- **WHEN** a schema without a `v.metadata({ type: "..." })` annotation is passed
- **THEN** `detectSchemaType` SHALL fall back to valibot base type detection

#### Scenario: Pipe with metadata still detects underlying type
- **WHEN** `v.pipe(v.string(), v.metadata({ visibleWhen: { field: "x", value: true } }))` is passed to `detectSchemaType`
- **THEN** the returned type SHALL be `"string"` (metadata `type` field is absent, so it falls through)
