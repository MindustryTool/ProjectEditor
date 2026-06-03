## ADDED Requirements

### Requirement: HjsonValueNode provides patchValue method
`HjsonValueNode` SHALL provide a `patchValue(original: string, newValue: string): string` method that surgically replaces the value node's content in the source string.

#### Scenario: patchValue replaces value in source
- **WHEN** `patchValue` is called with an original source `"{a: 42}"` and newValue `"100"`
- **THEN** it SHALL return `"{a: 100}"`, replacing only the value portion at the node's position

#### Scenario: patchValue with multi-line content
- **WHEN** `patchValue` is called with a source containing a multi-line string value and newValue `"\"new text\""`
- **THEN** it SHALL replace only the value portion, preserving surrounding text

#### Scenario: patchValue on nested value
- **WHEN** the node is a value inside `{a: {b: "hello"}}` at path `a.b`
- **THEN** `patchValue(original, '"world"')` SHALL return `{a: {b: "world"}}`

#### Scenario: patchValue with HJSON.stringify output
- **WHEN** the value `42` is serialized via `HJSON.stringify(42)` producing `"42"`
- **THEN** `patchValue(original, "42")` SHALL replace the value with `42`
