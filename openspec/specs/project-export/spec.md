## Requirements

### Requirement: Exporter interface
The `@project/core` package SHALL define an `Exporter` interface with a method that accepts `ProjectContext` and returns a ZIP `Uint8Array`.

#### Scenario: Exporter interface contract
- **WHEN** an exporter implements the `Exporter` interface
- **THEN** it MUST provide an `export(context: ProjectContext): Promise<Uint8Array>` method

### Requirement: JsonExporter collects all files and creates ZIP
The `@project/core` package SHALL provide a `JsonExporter` class that implements `Exporter`, recursively reads all files from the project filesystem, and returns a ZIP archive.

#### Scenario: JsonExporter exports all files
- **WHEN** `JsonExporter.export()` is called with a `ProjectContext` containing files
- **THEN** it SHALL recursively read every file under the project root
- **THEN** it SHALL return a `Uint8Array` containing a valid ZIP archive with all files

#### Scenario: JsonExporter preserves directory structure
- **WHEN** files exist in subdirectories
- **THEN** the ZIP entries SHALL include the relative path from the project root (e.g., `scripts/main.js` not just `main.js`)

#### Scenario: JsonExporter with empty project
- **WHEN** the project has no files
- **THEN** it SHALL return a ZIP archive containing no entries

### Requirement: JsonExporter nests export files under project-name folder
`JsonExporter` SHALL prefix every ZIP entry path with the project name, so extracting the ZIP creates a self-contained folder.

#### Scenario: All ZIP entries are prefixed with project name
- **WHEN** `JsonExporter.export()` is called with a project named `"MyMod"`
- **THEN** every ZIP entry name SHALL start with `MyMod/` (e.g., `MyMod/mod.json`, `MyMod/content/items.json`)

#### Scenario: Project name is not sanitized by exporter
- **WHEN** `JsonExporter.export()` reads the project name
- **THEN** it SHALL use the name as-is without additional sanitization
- **THEN** it SHALL rely on `ProjectInfoSchema` validation to guarantee valid characters

### Requirement: Exporter selection by language
The system SHALL select the correct exporter based on `project.language`.

#### Scenario: JSON language uses JsonExporter
- **WHEN** `project.language` is `"json"`
- **THEN** the system SHALL use `JsonExporter` for export

#### Scenario: Java or JavaScript language shows unsupported error
- **WHEN** `project.language` is `"java"` or `"javascript"`
- **THEN** the export SHALL throw or return an error indicating the language is not yet supported

### Requirement: Export button triggers export and download
The ExportMenu SHALL render a button that opens an export dialog, allowing the user to customize the filename before downloading.

#### Scenario: Single export button renders
- **WHEN** the toolbar is rendered
- **THEN** a single "Export" button SHALL be visible (no dropdown chevron)

#### Scenario: Clicking export opens dialog instead of immediate download
- **WHEN** the user clicks the Export button
- **THEN** a dialog SHALL open with a filename input pre-filled with a sanitized version of the project name, a Download button, and a Cancel button
- **THEN** no download SHALL occur until the user clicks Download in the dialog

#### Scenario: Filename input shows validation feedback
- **WHEN** the dialog is open
- **THEN** the filename input SHALL validate characters as the user types
- **THEN** characters outside `[a-zA-Z0-9._-]` SHALL be visually flagged with a warning

#### Scenario: Download button triggers export with custom filename
- **WHEN** the user clicks the Download button in the dialog
- **THEN** the exporter for the current project language SHALL be invoked
- **THEN** the resulting ZIP SHALL be downloaded with the filename specified in the dialog input

#### Scenario: Cancel button closes dialog without download
- **WHEN** the user clicks Cancel in the dialog
- **THEN** the dialog SHALL close
- **THEN** no download SHALL occur

#### Scenario: Export errors are surfaced
- **WHEN** export fails (e.g., unsupported language or filesystem error)
- **THEN** the error SHALL be surfaced to the user
- **THEN** the dialog SHALL remain open

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
