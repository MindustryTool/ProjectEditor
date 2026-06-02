## ADDED Requirements

### Requirement: Tolerant structured parsing for formatter workflows
The HJSON library SHALL support a tolerant structured parsing mode for formatter workflows. In tolerant mode, recoverable syntax problems SHALL be recorded in the structured result instead of causing immediate data loss.

#### Scenario: Recoverable invalid content produces structured result
- **WHEN** tolerant structured parsing is used on an HJSON document with recoverable malformed content
- **THEN** the parse result SHALL still include the surrounding structured document content
- **AND** the malformed region SHALL be represented as a preserved source segment or formatter-opaque node
- **AND** recoverable parse issues SHALL be available to the formatter

### Requirement: Structured formatter input preserves exact source spans
The formatter-facing structured result SHALL preserve exact source ranges for recognized values and for source segments that cannot be safely normalized.

#### Scenario: Valid fields retain exact ranges
- **WHEN** tolerant structured parsing reads a valid object field or array element
- **THEN** the structured result SHALL retain exact source positions needed to rewrite only that field or element

#### Scenario: Invalid segment retains raw text
- **WHEN** tolerant structured parsing encounters an invalid or partial segment
- **THEN** the structured result SHALL retain the raw source text for that segment without modification
- **AND** the preserved segment SHALL remain available in original source order relative to neighboring valid nodes

### Requirement: Strict structured parsing remains unchanged by default
Existing strict structured parsing behavior SHALL remain the default for current parsing APIs.

#### Scenario: Strict parsing still throws on invalid input
- **WHEN** `HJSON.parseStructured` is called without enabling tolerant formatting behavior on invalid HJSON
- **THEN** it SHALL continue to throw the same parsing error behavior as before
