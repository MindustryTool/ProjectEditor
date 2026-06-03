## Purpose
Provide source-preserving HJSON formatting that normalizes valid documents while retaining comments, layout-sensitive content, and recoverably invalid source spans.

## Requirements

### Requirement: Public HJSON formatter API
The HJSON library SHALL provide a public `HJSON.format(text, options?)` API for formatting source text, and the package entry point SHALL export the formatter option types required to call it.

#### Scenario: Format API is available from package entry point
- **WHEN** a consumer imports `HJSON` from `@project/hjson`
- **THEN** `HJSON.format` SHALL be callable with a source string
- **AND** the formatter options type SHALL be exported from the package entry point

### Requirement: Formatter normalizes valid HJSON deterministically
When the input is valid HJSON, the formatter SHALL produce a stable layout for objects, arrays, key/value separators, indentation, and trailing delimiters.

#### Scenario: Valid document formats to stable output
- **WHEN** `HJSON.format` is called with valid HJSON containing mixed inline and multiline object or array layout
- **THEN** it SHALL return a consistently formatted HJSON document
- **AND** formatting the returned document again SHALL produce the exact same text

#### Scenario: Formatted valid document remains parseable
- **WHEN** a valid HJSON document is formatted
- **THEN** the formatted result SHALL still parse successfully with the strict HJSON parser
- **AND** the parsed value SHALL be equivalent to the parsed value of the original valid input

### Requirement: Formatter preserves comments and protected string content
The formatter SHALL preserve comments, blank lines, and multiline string payloads while normalizing surrounding structure.

#### Scenario: Comments survive formatting
- **WHEN** a document containing line comments, inline comments, or blank lines is formatted
- **THEN** those comments and blank-line separations SHALL remain present in the formatted output

#### Scenario: Multiline string payload is preserved
- **WHEN** a document containing a multiline string is formatted
- **THEN** the string's textual payload SHALL remain unchanged
- **AND** only surrounding indentation or container layout MAY change

### Requirement: Formatter preserves malformed source without data loss
The formatter SHALL operate on recoverably invalid or partial HJSON input without discarding source text. Any source span that cannot be safely normalized SHALL be emitted exactly once and in its original order.

#### Scenario: Recoverable invalid object content is preserved
- **WHEN** `HJSON.format` is called on HJSON containing malformed object or array content that the formatter cannot safely rewrite
- **THEN** the formatter SHALL return a string instead of dropping the malformed span
- **AND** the malformed source span SHALL appear verbatim in the output

#### Scenario: Trailing invalid source is preserved
- **WHEN** the input contains valid HJSON followed by trailing invalid or partial source text
- **THEN** the trailing source text SHALL remain present in the formatted output
- **AND** the formatter SHALL preserve its relative order after the formatted valid portion
