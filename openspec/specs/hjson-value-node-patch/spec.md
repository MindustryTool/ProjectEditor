## Requirements

### Requirement: HjsonValueNode provides patchValue method
`HjsonValueNode` SHALL provide a `patchValue(original: string, newValue: unknown): string` method that surgically replaces the value node's content in the source string. The `newValue` parameter SHALL accept `unknown` and be serialized via compact HJSON (`hjsonStringify(v, null, undefined)`) internally.

#### Scenario: patchValue accepts unknown values
- **WHEN** `patchValue` is called with an original source `"{a: 42}"` and newValue `100`
- **THEN** it SHALL return `"{a: 100}"`, replacing only the value portion at the node's position

#### Scenario: patchValue with raw string auto-serializes
- **WHEN** `patchValue` is called with a source containing `{a: "hello"}` and newValue `"world"`
- **THEN** it SHALL return `{a: world}`, serializing the raw string through HJSON

#### Scenario: patchValue with object value auto-serializes
- **WHEN** `patchValue` is called with newValue being a plain object `{b: 1}`
- **THEN** it SHALL return `{a: {b:1,c:hello,}}`, serializing via compact HJSON
