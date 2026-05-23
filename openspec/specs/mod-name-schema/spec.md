## ADDED Requirements

### Requirement: Mod name schema validates lowercase letters and hyphens
The system SHALL provide a reusable Valibot schema `ModNameSchema` that validates a string contains only lowercase letters (`a-z`), digits (`0-9`), hyphens (`-`), and spaces (` `), with a minimum length of 1.

#### Scenario: Valid mod name passes
- **WHEN** a value like `"example-mod"`, `"test123"`, or `"my cool mod"` is validated against ModNameSchema
- **THEN** the schema SHALL return a valid result

#### Scenario: Invalid mod name rejected
- **WHEN** a value containing uppercase letters (e.g., `"Example mod"`) is validated
- **THEN** the schema SHALL reject with a validation error

#### Scenario: Empty string rejected
- **WHEN** an empty string `""` is validated
- **THEN** the schema SHALL reject with a validation error
