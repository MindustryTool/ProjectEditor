## ADDED Requirements

### Requirement: Validator validates content JSON files
The system SHALL provide a validator that validates content JSON files (items, blocks, liquids, units, etc.) against basic structural rules.

#### Scenario: Valid JSON syntax
- **WHEN** a content JSON file contains valid JSON syntax
- **THEN** the validator SHALL return zero results

#### Scenario: Invalid JSON syntax
- **WHEN** a content JSON file contains invalid JSON syntax (e.g., trailing comma, unquoted key)
- **THEN** the validator SHALL return an error result with the message key `"validation.content.invalidJson"` and the line/column of the parse error

#### Scenario: Missing required fields per type
- **WHEN** a content JSON entry is missing a required field (e.g., `type` for content items, `name` for blocks)
- **THEN** the validator SHALL return an error result with the message key `"validation.content.missingField"`

#### Scenario: Unknown content type
- **WHEN** a content entry has a `type` that is not recognized
- **THEN** the validator SHALL return a warning result with the message key `"validation.content.unknownType"`

#### Scenario: Duplicate entry names
- **WHEN** two entries in the same content file have the same `name` field
- **THEN** the validator SHALL return an error result with the message key `"validation.content.duplicateName"`
