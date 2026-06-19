## MODIFIED Requirements

### Requirement: Dedicated structured parsing API

The HJSON library SHALL provide dedicated functions `parseStructured` and `parseStructuredAsync` that return a structured representation of the HJSON input, including positional metadata, without requiring manual configuration of the `structured` option flag.

#### Scenario: Parse to structured nodes
- **WHEN** `HJSON.parseStructured(text, reviver?, options?)` is called
- **THEN** it SHALL return a `HjsonNode` representing the root of the document
- **AND** the result SHALL include metadata for keys and values (start/end positions)
- **AND** the `options.quote` SHALL control serialization behavior of the returned nodes

### Requirement: FieldInfo and ElementInfo are generic with replaceValue

`FieldInfo<T>` and `ElementInfo<T>` SHALL use type parameter `T` for their `value` property, defaulting to `unknown`. Both SHALL provide a `replaceValue(original: string, newValue: unknown): string` method that replaces the value in the source string. The `newValue` parameter SHALL accept `unknown` and be serialized via compact HJSON (`hjsonStringify(v, null, undefined)`) internally. The serialization SHALL respect the `quote` option from the parse call.

#### Scenario: FieldInfo typed value access
- **WHEN** inspecting a `FieldInfo<string>`
- **THEN** `value` SHALL be typed as `string`

#### Scenario: ElementInfo typed value access
- **WHEN** inspecting an `ElementInfo<number>`
- **THEN** `value` SHALL be typed as `number`

#### Scenario: replaceValue accepts unknown and serializes objects
- **WHEN** `replaceValue(original, { key: "val" })` is called
- **THEN** the value SHALL be serialized to compact HJSON before replacement
- **AND** the serialization SHALL respect the configured quote style

#### Scenario: replaceValue with raw string
- **WHEN** `replaceValue(original, "hello")` is called
- **THEN** the string SHALL be serialized by HJSON (producing an unquoted bareword by default, or respecting the configured quote style)
