## ADDED Requirements

### Requirement: Tokenizer falls back to unquoted string when number-like value contains non-numeric characters

The tokenizer SHALL detect when a digit-prefixed value is actually an unquoted string by checking if the character immediately following a parsed number is a valid unquoted string body character (alphanumeric, `_`, `$`, `-`, `.`, `+`, `/`). If so, the tokenizer MUST reset its position and re-read the entire value as an unquoted string token.

#### Scenario: Version string with multiple dots and hyphen
- **WHEN** the tokenizer encounters `name: 4.4.1-duct`
- **THEN** it SHALL produce a string token with value `"4.4.1-duct"` without errors

#### Scenario: Multi-dot number-like string
- **WHEN** the tokenizer encounters `12.34.56`
- **THEN** it SHALL produce a string token with value `"12.34.56"`

#### Scenario: Digits followed by alpha suffix
- **WHEN** the tokenizer encounters `123abc`
- **THEN** it SHALL produce a string token with value `"123abc"`

#### Scenario: Pure number still parses as number
- **WHEN** the tokenizer encounters `3.14`
- **THEN** it SHALL produce a number token with value `"3.14"`

#### Scenario: Hex number still parses as number
- **WHEN** the tokenizer encounters `0xFF`
- **THEN** it SHALL produce a number token with value `"0xFF"`

#### Scenario: Negative number still parses as number
- **WHEN** the tokenizer encounters `-42`
- **THEN** it SHALL produce a number token with value `"-42"`

#### Scenario: Full HJSON document with digit-prefixed string value
- **WHEN** the tokenizer/parser encounters `type: Duct\nname: 4.4.1-duct`
- **THEN** it SHALL parse successfully to `{ type: "Duct", name: "4.4.1-duct" }`
