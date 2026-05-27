## ADDED Requirements

### Requirement: Parse HJSON string to JavaScript value
The parser SHALL accept an HJSON-formatted string and return the corresponding JavaScript value, supporting all HJSON syntax features.

#### Scenario: Parse standard JSON object
- **WHEN** the input is `{"key": "value", "num": 42}`
- **THEN** the result MUST be `{ key: "value", num: 42 }`

#### Scenario: Parse object with unquoted keys
- **WHEN** the input is `{key: "value", flag: true}`
- **THEN** the result MUST be `{ key: "value", flag: true }`

#### Scenario: Parse object with trailing comma
- **WHEN** the input is `{a: 1, b: 2,}`
- **THEN** the result MUST be `{ a: 1, b: 2 }`

#### Scenario: Parse with single-line comments
- **WHEN** the input is `{ // comment\n key: "val" }`
- **THEN** the result MUST be `{ key: "val" }`

#### Scenario: Parse with multi-line comments
- **WHEN** the input is `{ /* comment */ key: "val" }`
- **THEN** the result MUST be `{ key: "val" }`

#### Scenario: Parse unquoted string value
- **WHEN** the input is `{key: hello world}`
- **THEN** the result MUST be `{ key: "hello world" }`

#### Scenario: Parse multi-line string (Python-style)
- **WHEN** the input is "{\n  text: '''\n    hello\n    world\n    '''\n}"
- **THEN** the result MUST be `{ text: "hello\nworld" }`

#### Scenario: Parse numeric values (all HJSON forms)
- **WHEN** the input is `{int: 42, neg: -10, float: 3.14, exp: 5e2, hex: 0xFF}`
- **THEN** the result MUST be `{ int: 42, neg: -10, float: 3.14, exp: 500, hex: 255 }`

#### Scenario: Parse root braced object (optional braces around entire file)
- **WHEN** the input is "key: val\nnum: 42"
- **THEN** the result MUST be `{ key: "val", num: 42 }`

#### Scenario: Parse nested objects
- **WHEN** the input is `{outer: {inner: "deep"}}`
- **THEN** the result MUST be `{ outer: { inner: "deep" } }`

#### Scenario: Parse arrays with mixed types
- **WHEN** the input is `[1, "two", true, null]`
- **THEN** the result MUST be `[1, "two", true, null]`

### Requirement: Provide typed parse API with generics
The `HJSON.parse<T>()` function SHALL accept a type parameter for the return type, defaulting to `unknown`.

#### Scenario: Generic parse with explicit return type
- **WHEN** calling `HJSON.parse<MyConfig>('{"host": "localhost"}')`
- **THEN** the return type MUST be `MyConfig`

#### Scenario: Default return type is unknown
- **WHEN** calling `HJSON.parse('{}')` without a type argument
- **THEN** the return type MUST be `unknown`

### Requirement: Accept reviver function
The `HJSON.parse` function SHALL accept an optional reviver callback following the `JSON.parse` signature `(key, value) => any`.

#### Scenario: Reviver transforms parsed values
- **WHEN** calling `HJSON.parse('{"d": "2024-01-01"}', (k, v) => k === "d" ? new Date(v) : v)`
- **THEN** the `d` field MUST be a `Date` instance

#### Scenario: Reviver called on all keys
- **WHEN** reviver is provided
- **THEN** it MUST be called for each key/value pair at every nesting level, plus the root with key `""`

### Requirement: Async parse API
The `HJSON.parseAsync()` function SHALL return a `Promise` that resolves with the parsed value, yielding to the event loop during processing.

#### Scenario: Async parse returns correct value
- **WHEN** calling `await HJSON.parseAsync('{"key": "val"}')`
- **THEN** the result MUST be `{ key: "val" }`

#### Scenario: Async parse rejects on invalid input
- **WHEN** calling `await HJSON.parseAsync('{invalid')`
- **THEN** the promise MUST reject with an `HJSONError`

### Requirement: Accept parse options
The `HJSON.parse` and `HJSON.parseAsync` functions SHALL accept an optional options object as the second/third parameter.

#### Scenario: Parse with keepQuote option
- **WHEN** calling `HJSON.parse('{key: "val"}', null, { keepQuote: true })`
- **THEN** unquoted string values MUST be preserved as unquoted (behavior TBD by spec)

#### Scenario: Parse with legacyRoot option
- **WHEN** calling `HJSON.parse('{"key": "val"}', null, { legacyRoot: false })`
- **THEN** the input MUST be wrapped in braces automatically to maintain backward compatibility
