## ADDED Requirements

### Requirement: Nullable field definition
A `Field` SHALL support a `nullable` boolean property that defaults to `false`.

#### Scenario: Field without nullable defaults to non-nullable
- **WHEN** a `Field` object is defined without the `nullable` property
- **THEN** the field SHALL behave as non-nullable (patching clears value to `null` string)

#### Scenario: Field with nullable: false behaves as non-nullable
- **WHEN** a `Field` object is defined with `nullable: false`
- **THEN** the field SHALL behave as non-nullable (patching clears value to `null` string)

#### Scenario: Field with nullable: true enables key removal
- **WHEN** a `Field` object is defined with `nullable: true`
- **THEN** when the value is cleared (set to `undefined`), the key SHALL be removed from the HJSON source entirely

### Requirement: Remove field from HJSON source
`HjsonObjectNode` SHALL provide a `removeField(original, key)` method that removes a field from the source string.

#### Scenario: Remove existing field
- **WHEN** `removeField` is called for a key that exists in the object
- **THEN** the key and its value SHALL be removed from the source string

#### Scenario: Remove non-existent field is no-op
- **WHEN** `removeField` is called for a key that does not exist in the object
- **THEN** the original source string SHALL be returned unchanged

#### Scenario: Whitespace cleanup after removal
- **WHEN** a field is removed from the middle of an object
- **THEN** any trailing comma and surrounding whitespace/newlines preceding the removed field SHALL also be removed

### Requirement: Nullable field patching behavior
When a field marked `nullable: true` receives `undefined` as its value, `removeField` SHALL be used instead of `patchField`.

#### Scenario: Nullable field clears by removing key
- **WHEN** a nullable field's value is set to `undefined`
- **THEN** the field SHALL be removed from the HJSON source via `removeField`

#### Scenario: Non-nullable field clears by patching to null
- **WHEN** a non-nullable field's value is set to `undefined`
- **THEN** the field SHALL be patched to the literal string `null` (existing behavior preserved)
