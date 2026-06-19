## ADDED Requirements

### Requirement: Quote flag on HJSONParseOptions

`HJSONParseOptions` SHALL include a `quote?: boolean` field. When `true`, all string values serialized during structured node patching SHALL be double-quoted (JSON mode). When `false` or omitted, the default HJSON bareword behavior SHALL be used.

#### Scenario: Default (quote not set) uses HJSON bareword mode
- **WHEN** `HJSON.parseStructured(text)` is called without a `quote` option
- **THEN** the resulting node's serialization methods SHALL use default HJSON quoting (bareword where safe, double-quoted otherwise)

#### Scenario: quote: true forces all strings to be quoted
- **WHEN** `HJSON.parseStructured(text, null, { quote: true })` is called and then a field value is patched with a bareword-safe string like "hello"
- **THEN** the patched output SHALL contain `"hello"` (with double quotes) instead of `hello` (bareword)

#### Scenario: quote: false preserves HJSON bareword mode
- **WHEN** `HJSON.parseStructured(text, null, { quote: false })` is called and then a field is patched with a bareword-safe string
- **THEN** the patched output SHALL keep the string as a bareword

#### Scenario: quote: true quotes strings with special characters
- **WHEN** `HJSON.parseStructured(text, null, { quote: true })` is called and a string containing special characters is patched
- **THEN** the value SHALL be double-quoted with proper JSON escape sequences

### Requirement: HjsonSerializeOptions interface

An internal `HjsonSerializeOptions` interface SHALL be defined with a `quote: boolean` field. This options object SHALL be immutable (frozen) and shared by reference across all `HjsonNode` instances produced from the same parse call.

#### Scenario: Options object is frozen
- **WHEN** a parse call produces `HjsonNode` instances
- **THEN** all nodes from that parse SHALL share the same frozen options object reference

### Requirement: parseWithCache includes options in cache key

`HJSON.parseWithCache(content, options?)` SHALL incorporate the `quote` option into its cache key, so that parses with different `quote` values produce distinct cached results.

#### Scenario: Different quote options produce different cache entries
- **WHEN** `parseWithCache("a: hello", { quote: true })` is called, then `parseWithCache("a: hello", { quote: false })` is called
- **THEN** the second call SHALL NOT reuse the cached result from the first call

#### Scenario: Identical options reuse cache
- **WHEN** `parseWithCache("a: hello", { quote: true })` is called twice
- **THEN** the second call SHALL return the cached result
