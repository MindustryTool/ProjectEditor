## ADDED Requirements

### Requirement: Validation result supports field-level targeting

Each validation result MAY include a `field` property to identify which specific field triggered the issue.

#### Scenario: Field-level validation result
- **WHEN** a validator detects an issue on a specific field (e.g., missing `"type"`)
- **THEN** the result SHALL include `field` set to the field name

#### Scenario: File-level validation result
- **WHEN** a validator detects a file-level issue (e.g., "file is empty")
- **THEN** the result SHALL omit the `field` property
