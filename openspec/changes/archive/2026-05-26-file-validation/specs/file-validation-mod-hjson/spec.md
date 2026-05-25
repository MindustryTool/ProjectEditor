## ADDED Requirements

### Requirement: Validator validates mod.hjson structure
The system SHALL provide a validator that validates `mod.hjson` against the existing ModHjsonSchema from `@project/validation`.

#### Scenario: Valid mod.hjson
- **WHEN** a `mod.hjson` file contains valid data matching ModHjsonSchema
- **THEN** the validator SHALL return zero results

#### Scenario: Invalid mod name
- **WHEN** the `name` field in `mod.hjson` contains uppercase letters or special characters
- **THEN** the validator SHALL return an error result with the message key `"validation.modHjson.nameInvalid"`

#### Scenario: Missing required fields
- **WHEN** a required field (e.g., `name`, `displayName`) is missing from `mod.hjson`
- **THEN** the validator SHALL return error results for each missing field

#### Scenario: Invalid minGameVersion
- **WHEN** `minGameVersion` is not a number or is less than or equal to 145
- **THEN** the validator SHALL return an error result with the message key `"validation.modHjson.minGameVersionInvalid"`

#### Scenario: Deprecated fields
- **WHEN** deprecated fields are present (e.g., `difficulty`)
- **THEN** the validator SHALL return deprecated-severity results with the message key `"validation.modHjson.fieldDeprecated"`
