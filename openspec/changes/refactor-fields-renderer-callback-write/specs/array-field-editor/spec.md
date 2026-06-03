## MODIFIED Requirements

### Requirement: Array field items render using itemType
Array item editors SHALL use the schema-derived renderer specified by the item schema, passing the raw element value instead of an HjsonNode.

#### Scenario: String array items render as text inputs
- **WHEN** a field has type `"array"` with `v.string()` item schema
- **THEN** each item SHALL render as a text input using the `String` renderer with the raw string value

#### Scenario: Number array items render as number inputs
- **WHEN** a field has type `"array"` with `v.number()` item schema
- **THEN** each item SHALL render as a number input using the `Number` renderer with the raw number value
