## ADDED Requirements

### Requirement: Stringify JavaScript value to HJSON string
The `HJSON.stringify()` function SHALL serialize a JavaScript value to an HJSON-formatted string, producing human-friendly output with HJSON conventions.

#### Scenario: Stringify a plain object
- **WHEN** calling `HJSON.stringify({ key: "value", num: 42 })`
- **THEN** the output MUST be valid HJSON that when parsed returns the same structure

#### Scenario: Stringify uses unquoted keys where valid
- **WHEN** calling `HJSON.stringify({ simpleKey: "val" })`
- **THEN** the output SHOULD use unquoted keys (e.g., `simpleKey: "val"`)

#### Scenario: Stringify quotes keys with special characters
- **WHEN** calling `HJSON.stringify({ "key with spaces": "val" })`
- **THEN** the output MUST quote the key containing spaces

#### Scenario: Stringify with space parameter (indentation)
- **WHEN** calling `HJSON.stringify({ a: { b: 1 } }, null, 2)`
- **THEN** the output MUST use 2-space indentation for nested objects

#### Scenario: Stringify with space as string
- **WHEN** calling `HJSON.stringify({ a: 1 }, null, "\t")`
- **THEN** the output MUST use tab indentation for nested objects

#### Scenario: Stringify detects multi-line strings
- **WHEN** calling `HJSON.stringify({ text: "hello\nworld" })`
- **THEN** the output SHOULD use HJSON multi-line string syntax with `'''`

#### Scenario: Stringify adds trailing comma
- **WHEN** calling `HJSON.stringify({ a: 1, b: 2 })`
- **THEN** the last member line SHOULD end with a trailing comma

#### Scenario: Stringify handles null, boolean, number
- **WHEN** calling `HJSON.stringify({ n: null, b: true, i: 42, f: 3.14 })`
- **THEN** values MUST serialize as `null`, `true`, `42`, `3.14`

#### Scenario: Stringify handles arrays
- **WHEN** calling `HJSON.stringify({ items: [1, 2, 3] })`
- **THEN** the output MUST serialize the array with elements separated by commas

#### Scenario: Stringify handles nested objects
- **WHEN** calling `HJSON.stringify({ outer: { inner: "deep" } })`
- **THEN** the output MUST serialize nested structure correctly

### Requirement: Accept replacer function or array
The `HJSON.stringify()` function SHALL accept an optional replacer parameter, matching `JSON.stringify` semantics.

#### Scenario: Replacer function filters values
- **WHEN** calling `HJSON.stringify({ a: 1, b: 2, c: 3 }, (k, v) => k === "b" ? undefined : v)`
- **THEN** the output MUST exclude key `b`

#### Scenario: Replacer array filters keys
- **WHEN** calling `HJSON.stringify({ a: 1, b: 2, c: 3 }, ["a", "c"])`
- **THEN** the output MUST only include keys `a` and `c`

### Requirement: Respect toJSON() method
The `HJSON.stringify()` function SHALL call `toJSON()` on objects that define it, matching `JSON.stringify` behavior.

#### Scenario: Object with toJSON method
- **WHEN** calling `HJSON.stringify({ toJSON: () => ({ serialized: true }) })`
- **THEN** the output MUST represent the return value of `toJSON()`
