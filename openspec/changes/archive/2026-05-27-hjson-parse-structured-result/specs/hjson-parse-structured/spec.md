## ADDED Requirements

### Requirement: Structured parse option
`HJSON.parse()` SHALL accept an optional `structured` property in its options object. When `structured: true`, the return type SHALL be `StructuredResult<T>` instead of `T`. When `structured` is `false` or omitted, the existing plain-JS-value behavior SHALL be preserved.

#### Scenario: Default parse returns plain value
- **WHEN** `HJSON.parse('{"a": 1}')` is called without `structured` option
- **THEN** the result SHALL be a plain object `{ a: 1 }`

#### Scenario: Structured parse returns StructuredResult
- **WHEN** `HJSON.parse('{"a": 1}', undefined, { structured: true })` is called
- **THEN** the result SHALL be an instance of `StructuredObject`

### Requirement: StructuredResult type shape
The `StructuredResult<T>` type SHALL be a union: `T extends Record<string, unknown> ? StructuredObject<T> : T`. Primitive or array results SHALL return the plain value even in structured mode (position data only applies to object members).

#### Scenario: Primitive returns plain value in structured mode
- **WHEN** `HJSON.parse('42', undefined, { structured: true })` is called
- **THEN** the result SHALL be the plain number `42`

#### Scenario: Array returns plain array in structured mode
- **WHEN** `HJSON.parse('[1, 2, 3]', undefined, { structured: true })` is called
- **THEN** the result SHALL be the plain array `[1, 2, 3]`

### Requirement: FieldInfo positions for object members
`StructuredObject<T>` SHALL provide position metadata for each member field. Each `FieldInfo` SHALL contain:
- `key`: The field key as a string
- `value`: The field value
- `start`: Source position of the entire member (`{ row, col, index }`)
- `end`: Source position of the entire member
- `valueStart`: Source position of the member's value
- `valueEnd`: Source position of the member's value

All position fields SHALL use the same `SourceLocation` coordinate format (row/col/index) as the existing AST nodes.

#### Scenario: Field positions are correct for simple object
- **WHEN** `HJSON.parse('{ "a": 42 }', undefined, { structured: true })` is called
- **THEN** the result SHALL have one field `"a"` with `start` = position of `"a"`, `end` = position after `42`, `valueStart` = position of `42`, `valueEnd` = position after `42`

### Requirement: Get fields by key
`StructuredObject<T>` SHALL support retrieving `FieldInfo` by key via a `field(key: string): FieldInfo | undefined` method.

#### Scenario: Get existing field
- **WHEN** `result.field("a")` is called on structured parse of `{ "a": 1 }`
- **THEN** the result SHALL be a `FieldInfo` with `key: "a"` and `value: 1`

#### Scenario: Get non-existent field returns undefined
- **WHEN** `result.field("bogus")` is called
- **THEN** the result SHALL be `undefined`

### Requirement: Iterate all fields
`StructuredObject<T>` SHALL support iterating all `FieldInfo` entries via `fields(): IterableIterator<FieldInfo>`.

#### Scenario: Iterate fields
- **WHEN** `Array.from(result.fields())` is called on structured parse of `{ "a": 1, "b": 2 }`
- **THEN** the result SHALL contain two `FieldInfo` entries with keys `"a"` and `"b"`

### Requirement: Recursive nested field positions
Nested objects SHALL also be `StructuredObject` instances, with their own per-member position metadata.

#### Scenario: Nested object fields have positions
- **WHEN** `HJSON.parse('{ "outer": { "inner": 1 } }', undefined, { structured: true })` is called
- **THEN** `result.value("outer")` SHALL be a `StructuredObject` with field `"inner"` having correct position metadata

### Requirement: Value access on StructuredObject
`StructuredObject<T>` SHALL expose the underlying plain JS value via `valueOf(): T` and `toJSON(): T` methods, and SHALL be directly usable where `T` is expected via standard valueOf/toJSON coercion.

#### Scenario: valueOf returns plain object
- **WHEN** `HJSON.parse('{ "a": 1 }', undefined, { structured: true })` is called
- **THEN** `result.valueOf()` SHALL return `{ a: 1 }`

### Requirement: Reviver function support in structured mode
When `structured: true` and a reviver is provided, the reviver SHALL receive the plain JS values (not `StructuredObject` instances) during the conversion process, consistent with `JSON.parse` behavior. The final result SHALL still be wrapped in `StructuredObject`.

#### Scenario: Reviver with structured mode
- **WHEN** `HJSON.parse('{ "a": 1 }', (key, val) => typeof val === 'number' ? val * 2 : val, { structured: true })` is called
- **THEN** `result.valueOf()` SHALL return `{ a: 2 }`
