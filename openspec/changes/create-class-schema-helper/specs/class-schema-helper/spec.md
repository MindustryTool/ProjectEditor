## ADDED Requirements

### Requirement: createClassHjsonSchema factory function

The system SHALL export a `createClassHjsonSchema` function from `@project/schema` that creates a class-based HjsonSchema with automatic base schema merging and metadata inheritance.

#### Scenario: Creates a complete HjsonSchema with base + variant merge

- **WHEN** `createClassHjsonSchema` is called with a classMap, baseSchema entries, and a type string
- **THEN** the returned `SchemaFn` produces a `v.pipe(v.object({...}), metadata({ type }))` schema that merges base entries with variant entries from classMap.get()

#### Scenario: Variant fields inherit base metadata

- **WHEN** a variant field has the same name as a base field and the variant field has no metadata action
- **THEN** the merged entry SHALL wrap the variant field with metadata inherited from the base field

#### Scenario: Variant fields with explicit metadata are not overwritten

- **WHEN** a variant field has its own metadata action
- **THEN** the base metadata SHALL NOT be applied to that field

#### Scenario: Extra fields are appended after variant merge

- **WHEN** `extra` parameter is provided
- **THEN** the extra entries SHALL be added to the object schema after the variant entries, allowing them to override both base and variant

#### Scenario: Works with lazy schema wrapping

- **WHEN** `createClassHjsonSchema` is used
- **THEN** the result SHALL be wrapped in `v.lazy()` so the class map is resolved per-input

### Requirement: Metadata inheritance utility

The system SHALL provide a `inheritField` utility (or equivalent internal logic) that extracts metadata from a base schema field and reapplies it onto a replacement field.

#### Scenario: Metadata is extracted from pipe actions

- **WHEN** a base field has metadata attached via `v.pipe(field, metadata({...}))`
- **THEN** the metadata SHALL be extracted and reapplied to the replacement field via `v.pipe(replacement, metadata(baseMeta))`

#### Scenario: No-op when base has no metadata

- **WHEN** the base field has no metadata action
- **THEN** the replacement field SHALL be returned as-is

### Requirement: Dead code removal

The system SHALL remove unused `extend()` function and `register()` method from ClassMap.

#### Scenario: extend function removed

- **WHEN** the module is loaded
- **THEN** `extend` SHALL NOT be exported or available for use

#### Scenario: register method removed

- **WHEN** a ClassMap instance is created
- **THEN** it SHALL NOT have a `register` method
