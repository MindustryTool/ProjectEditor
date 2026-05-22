## ADDED Requirements

### Requirement: Mod name schema validates lowercase letters and hyphens
The system SHALL provide a reusable Valibot schema `ModNameSchema` that validates a string contains only lowercase letters (`a-z`), digits (`0-9`), and hyphens (`-`), with a minimum length of 1.

#### Scenario: Valid mod name passes
- **WHEN** a value like `"example-mod"` or `"test123"` is validated against ModNameSchema
- **THEN** the schema SHALL return a valid result

#### Scenario: Invalid mod name rejected
- **WHEN** a value containing uppercase letters or spaces (e.g., `"Example Mod"`) is validated
- **THEN** the schema SHALL reject with a validation error

#### Scenario: Empty string rejected
- **WHEN** an empty string `""` is validated
- **THEN** the schema SHALL reject with a validation error
