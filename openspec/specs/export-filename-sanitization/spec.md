## ADDED Requirements

### Requirement: Filename sanitization
The system SHALL sanitize export filenames to only contain characters valid across Windows, macOS, and Linux filesystems.

#### Scenario: Default project name is sanitized on dialog open
- **WHEN** the user clicks the Export button
- **THEN** the filename input SHALL be pre-filled with the sanitized version of the project name

#### Scenario: Only alphanumeric, hyphen, underscore, and period are allowed
- **WHEN** a project name contains spaces (e.g., "My Mod")
- **THEN** the sanitized filename SHALL replace each space with a hyphen (e.g., `My-Mod`)
- **WHEN** a project name contains special characters (`!@#$%^&*()+={}[]|<>,.`)
- **THEN** those characters SHALL be replaced with a hyphen

#### Scenario: Consecutive replacements collapse to single hyphen
- **WHEN** a project name has two or more consecutive invalid characters (e.g., "My!!Mod")
- **THEN** the sanitized result SHALL collapse them into a single hyphen (e.g., `My-Mod`)

#### Scenario: Leading and trailing hyphens and periods are trimmed
- **WHEN** a sanitized filename starts with `-` or `.` (e.g., "!MyMod")
- **THEN** the leading chars SHALL be removed (e.g., `MyMod`)
- **WHEN** a sanitized filename ends with `-` or `.` (e.g., "MyMod!")
- **THEN** the trailing chars SHALL be removed (e.g., `MyMod`)

#### Scenario: Filename length is capped
- **WHEN** a project name longer than 200 characters produces a sanitized result over 200 chars
- **THEN** the result SHALL be truncated to 200 characters

#### Scenario: All-invalid name falls back to default
- **WHEN** sanitizing a name consisting entirely of invalid characters (e.g., `!!!`)
- **THEN** the filename SHALL fall back to `"export"`

### Requirement: Real-time input validation
The ExportMenu SHALL validate the user-typed filename on every change and show visual feedback.

#### Scenario: Invalid characters trigger warning
- **WHEN** the user types a character not in `[a-zA-Z0-9._-]`
- **THEN** the input SHALL show a visual indicator (red border)
- **THEN** a small hint text SHALL appear below the input indicating the character was replaced

#### Scenario: Empty filename shows error
- **WHEN** the user clears the input entirely
- **THEN** the input SHALL show an error state with message "Filename cannot be empty"

#### Scenario: Valid filename shows no warning
- **WHEN** the typed filename contains only allowed characters
- **THEN** no warning indicator SHALL be shown

### Requirement: Download uses filename as-typed
The system SHALL download the ZIP using the user-typed filename (before automatic sanitization), preserving user intent.

#### Scenario: Export uses filename from input
- **WHEN** the user clicks Download
- **THEN** the downloaded file SHALL use the filename exactly as displayed in the input (after `.zip` append)
