## ADDED Requirements

### Requirement: Throw typed HJSONError on invalid input
The parser SHALL throw an `HJSONError` (extending `SyntaxError`) when input is not valid HJSON, with detailed positional and code information.

#### Scenario: Unexpected token error
- **WHEN** parsing `{key: @invalid}`
- **THEN** an `HJSONError` MUST be thrown with `code` set to `HJSONErrorCode.UnexpectedToken`, `row` indicating the line number, `col` indicating the column, and `index` the character offset

#### Scenario: Unterminated string error
- **WHEN** parsing `{key: "unclosed}`
- **THEN** an `HJSONError` MUST be thrown with `code` = `HJSONErrorCode.UnterminatedString`

#### Scenario: Unterminated multi-line string error
- **WHEN** parsing `{key: '''\nhello}`
- **THEN** an `HJSONError` MUST be thrown with `code` = `HJSONErrorCode.UnterminatedMultilineString`

#### Scenario: Expected value error (empty input)
- **WHEN** parsing ``
- **THEN** an `HJSONError` MUST be thrown with `code` = `HJSONErrorCode.ExpectedValue`

#### Scenario: Expected comma or closing brace
- **WHEN** parsing `{a: 1 b: 2}`
- **THEN** an `HJSONError` MUST be thrown with `code` = `HJSONErrorCode.ExpectedCommaOrClosingBrace`

#### Scenario: Duplicate key error
- **WHEN** parsing `{a: 1, a: 2}`
- **THEN** an `HJSONError` MUST be thrown with `code` = `HJSONErrorCode.DuplicateKey`

#### Scenario: Invalid number format
- **WHEN** parsing `{n: 12.34.56}`
- **THEN** an `HJSONError` MUST be thrown with `code` = `HJSONErrorCode.InvalidNumber`

#### Scenario: Unexpected end of input
- **WHEN** parsing `{a: `
- **THEN** an `HJSONError` MUST be thrown with `code` = `HJSONErrorCode.UnexpectedEndOfInput`

### Requirement: Error includes input fragment
The `HJSONError` SHALL include a `inputFragment` property with the offending source snippet for context.

#### Scenario: Input fragment captures surrounding characters
- **WHEN** parsing produces an error
- **THEN** `error.inputFragment` MUST be a string containing the problematic section of the input

### Requirement: HJSONErrorCode constants are typed
The `HJSONErrorCode` const object SHALL be typed with a matching TypeScript union type.

#### Scenario: ErrorCode const object exists
- **WHEN** importing `HJSONErrorCode`
- **THEN** it MUST be a const object with each key mapping to a string value

#### Scenario: ErrorCode type is a strict union
- **WHEN** using `HJSONErrorCode` in a type annotation
- **THEN** the error code value SHALL be assignable to a variable of type `HJSONErrorCode`
