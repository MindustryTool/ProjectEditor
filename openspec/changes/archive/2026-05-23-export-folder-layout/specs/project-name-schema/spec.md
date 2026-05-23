## ADDED Requirements

### Requirement: Project name allows only valid filename characters
The `ProjectInfoSchema` SHALL restrict the `name` field to characters valid across Windows, macOS, and Linux filenames.

#### Scenario: Only alphanumeric, hyphen, underscore, and period are valid
- **WHEN** validating a project name containing spaces or special characters (e.g., `"My Mod!"`)
- **THEN** validation SHALL fail

#### Scenario: Valid names pass validation
- **WHEN** validating a name consisting only of `[a-zA-Z0-9._-]` (e.g., `"My-Mod_v2.patch"`)
- **THEN** validation SHALL succeed

#### Scenario: Empty name still fails
- **WHEN** validating an empty name
- **THEN** validation SHALL fail

#### Scenario: Existing projects with invalid names are auto-sanitized on load
- **WHEN** loading a project whose name contains invalid characters
- **THEN** the name SHALL be sanitized: invalid characters replaced with `-`, consecutive hyphens collapsed, leading/trailing `-` and `.` trimmed
- **THEN** a warning SHALL be logged indicating the name was altered
- **THEN** the project SHALL still load successfully
