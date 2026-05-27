## Requirements

### Requirement: ValidationResult uses startLine/startColumn/endLine/endColumn for error ranges

`ValidationResult` SHALL expose `startLine`, `startColumn`, `endLine`, and `endColumn` as optional number properties. The `line` and `column` properties SHALL NOT exist on `ValidationResult`. When `endLine` and `endColumn` are not provided, consumers SHALL default them to `startLine` and `startColumn`. All line/column values SHALL be 1-based.

#### Scenario: ValidationResult with full range

- **WHEN** a `ValidationResult` is created with `{ startLine: 2, startColumn: 5, endLine: 2, endColumn: 10 }`
- **THEN** `startLine` SHALL be `2`
- **THEN** `startColumn` SHALL be `5`
- **THEN** `endLine` SHALL be `2`
- **THEN** `endColumn` SHALL be `10`

#### Scenario: ValidationResult without end positions

- **WHEN** a `ValidationResult` is created with `{ startLine: 1, startColumn: 1 }` (no endLine/endColumn)
- **THEN** consumers SHALL treat `endLine` as `startLine` (`1`) and `endColumn` as `startColumn` (`1`)

#### Scenario: line and column are not properties

- **WHEN** accessing `result.line` on a ValidationResult instance
- **THEN** the value SHALL be `undefined`

### Requirement: jsonSyntaxValidator maps HJSONError ranges to ValidationResult

The `jsonSyntaxValidator` SHALL map `HJSONError.startLine`, `startColumn`, `endLine`, `endColumn` to the corresponding `ValidationResult` fields without conversion. All values are 1-based and pass through directly.

#### Scenario: HJSONError with full range maps to ValidationResult

- **WHEN** `HJSONError` is caught with `{ startLine: 3, startColumn: 7, endLine: 3, endColumn: 15 }`
- **THEN** the resulting `ValidationResult` SHALL have `startLine: 3`, `startColumn: 7`, `endLine: 3`, `endColumn: 15`

#### Scenario: HJSONError without end range defaults

- **WHEN** `HJSONError` is caught with `{ startLine: 1, startColumn: 5 }` (no endLine/endColumn)
- **THEN** the resulting `ValidationResult` SHALL have `startLine: 1`, `startColumn: 5`, `endLine: 1`, `endColumn: 5`

### Requirement: Monaco markers use ValidationResult range fields directly

MonacoEditor SHALL use `startLine`, `startColumn`, `endLine`, `endColumn` from `ValidationResult` for `startLineNumber`, `startColumn`, `endLineNumber`, `endColumn` marker fields. When `endLine`/`endColumn` are absent, SHALL default to `startLine`/`startColumn`.

#### Scenario: Marker with full range

- **WHEN** a marker is created from `{ startLine: 2, startColumn: 4, endLine: 2, endColumn: 12 }`
- **THEN** marker SHALL have `startLineNumber: 2`, `startColumn: 4`, `endLineNumber: 2`, `endColumn: 12`

#### Scenario: Marker with single position (no range)

- **WHEN** a marker is created from `{ startLine: 1, startColumn: 8 }` (no endLine/endColumn)
- **THEN** marker SHALL have `startLineNumber: 1`, `startColumn: 8`, `endLineNumber: 1`, `endColumn: 9` (endColumn defaults to startColumn + 1 for a single-character highlight)

### Requirement: Non-HJSON error fallback sets end = start

When the error is not an `HJSONError` and position data is extracted via regex, `endLine`/`endColumn` SHALL default to the extracted start position.

#### Scenario: Generic parse error with line/column

- **WHEN** a generic `SyntaxError` with `"line 1 column 5"` is caught
- **THEN** `ValidationResult` SHALL have `startLine: 1`, `startColumn: 5`, `endLine: 1`, `endColumn: 5`
