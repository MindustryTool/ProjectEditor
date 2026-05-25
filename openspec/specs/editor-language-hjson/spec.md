## ADDED Requirements

### Requirement: HJSON language registration
The system SHALL register a custom `hjson` language with Monaco Editor using the Monarch tokenizer, providing syntax highlighting for `.hjson` files.

#### Scenario: Language registered before editor mount
- **WHEN** the Monaco Editor instance is created with language `hjson`
- **THEN** the `hjson` language SHALL already be registered via `monaco.languages.register`
- **AND** a Monarch tokenizer SHALL be set via `monaco.languages.setMonarchTokensProvider`

### Requirement: HJSON tokenization rules
The HJSON Monarch grammar SHALL provide syntax highlighting for the following HJSON constructs.

#### Scenario: Comments
- **WHEN** HJSON content contains `#` or `//` line comments
- **THEN** the comment text SHALL be rendered in the comment color (typically green/gray)

#### Scenario: Keys
- **WHEN** HJSON content contains key names (text before `:` or `=`)
- **THEN** the key names SHALL be rendered in the key/identifier color (typically blue/cyan)

#### Scenario: String values
- **WHEN** HJSON content contains string values in double or single quotes
- **THEN** the string values SHALL be rendered in the string color (typically orange)

#### Scenario: Numeric values
- **WHEN** HJSON content contains numeric values (integers, floats)
- **THEN** the numeric values SHALL be rendered in the number color (typically green)

#### Scenario: Boolean and null values
- **WHEN** HJSON content contains `true`, `false`, or `null`
- **THEN** these keywords SHALL be rendered in the keyword color (typically purple)

#### Scenario: Brace and bracket delimiters
- **WHEN** HJSON content contains `{`, `}`, `[`, `]`
- **THEN** the delimiters SHALL be rendered with matching bracket highlighting

### Requirement: HJSON language configuration
The HJSON language SHALL be configured with basic language settings for Monaco Editor.

#### Scenario: Bracket matching
- **WHEN** the cursor is adjacent to `{`, `}`, `[`, or `]`
- **THEN** Monaco SHALL highlight the matching bracket

#### Scenario: Auto-closing brackets
- **WHEN** a user types `{` or `[`
- **THEN** Monaco SHALL automatically insert the closing `}` or `]`

#### Scenario: Comment toggling
- **WHEN** a user presses the comment toggle shortcut (Ctrl+/ or Cmd+/)
- **THEN** Monaco SHALL toggle `#` line comments for the selected lines

### Requirement: HJSON validation (informative)
The HJSON language MAY surface syntax errors via Monaco's marker API.

#### Scenario: Invalid HJSON syntax
- **WHEN** the HJSON content contains invalid syntax (e.g., missing closing brace)
- **THEN** Monaco MAY display a squiggly underline on the problematic line
- **AND** an error marker MAY appear in the editor gutter
