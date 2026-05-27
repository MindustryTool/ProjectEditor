## ADDED Requirements

### Requirement: HJSONError uses startLine/startColumn/endLine/endColumn
`HJSONError` SHALL expose `startLine`, `startColumn`, `endLine`, and `endColumn` as readonly number properties. The `row` and `col` properties SHALL NOT exist on `HJSONError`. When `endLine` and `endColumn` are not provided to the constructor, they SHALL default to `startLine` and `startColumn`.

#### Scenario: Error created with explicit positions
- **WHEN** `new HJSONError(code, { startLine: 1, startColumn: 6, endLine: 1, endColumn: 14, index: 5, inputFragment: "..." })` is constructed
- **THEN** `err.startLine` SHALL be `1`
- **THEN** `err.startColumn` SHALL be `6`
- **THEN** `err.endLine` SHALL be `1`
- **THEN** `err.endColumn` SHALL be `14`

#### Scenario: Error created without end positions defaults to start
- **WHEN** `new HJSONError(code, { startLine: 2, startColumn: 3, index: 10, inputFragment: "..." })` is constructed (no endLine/endColumn)
- **THEN** `err.endLine` SHALL be `2` (defaults to startLine)
- **THEN** `err.endColumn` SHALL be `3` (defaults to startColumn)

#### Scenario: row and col are not properties
- **WHEN** accessing `err.row` on an HJSONError instance
- **THEN** the value SHALL be `undefined`

#### Scenario: index is preserved
- **WHEN** `new HJSONError(code, { startLine: 1, startColumn: 5, index: 4, inputFragment: "..." })` is constructed
- **THEN** `err.index` SHALL be `4`

### Requirement: Error message format
The `HJSONError.message` string SHALL include `startLine:startColumn` in its formatted message, replacing the former `row:col` format.

#### Scenario: Message includes startLine:startColumn
- **WHEN** `new HJSONError(HJSONErrorCode.UnexpectedToken, { startLine: 3, startColumn: 10, index: 42, inputFragment: "@bad" })` is constructed
- **THEN** `err.message` SHALL include the substring `"3:10"` to indicate the error position

### Requirement: Tokenizer error method uses end positions
The tokenizer's internal `error()` method SHALL pass `endLine`/`endColumn` derived from the current position and the error context. For single-character errors, `endLine`/`endColumn` SHALL equal `startLine`/`startColumn`.

#### Scenario: Tokenizer error at current position
- **WHEN** the tokenizer encounters an invalid character at position `(line: 5, col: 8)`
- **THEN** the thrown `HJSONError` SHALL have `startLine: 5, startColumn: 8, endLine: 5, endColumn: 8`

### Requirement: Parser errors use token end positions
Parser error construction SHALL compute `endLine`/`endColumn` from the available token's value length. For tokens with known value extent (numbers, strings, etc.), `endColumn` SHALL be `startColumn + value.length`. `endLine` SHALL account for newlines in the value.

#### Scenario: Parser error with token value extent
- **WHEN** an invalid number `"12.34.56"` is encountered at position `(line: 1, col: 4)`
- **THEN** the thrown `HJSONError` SHALL have `endColumn` of approximately `4 + "12.34.56".length` (accounting for the token's full extent)
