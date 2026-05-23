## ADDED Requirements

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

### Requirement: Exporter selection by language
The system SHALL select the correct exporter based on `project.language`.

#### Scenario: JSON language uses JsonExporter
- **WHEN** `project.language` is `"json"`
- **THEN** the system SHALL use `JsonExporter` for export

#### Scenario: Java or JavaScript language shows unsupported error
- **WHEN** `project.language` is `"java"` or `"javascript"`
- **THEN** the export SHALL throw or return an error indicating the language is not yet supported

### Requirement: Export button triggers export and download
The ExportMenu SHALL render a single button that triggers export using the language-appropriate exporter and downloads the resulting ZIP.

#### Scenario: Single export button renders
- **WHEN** the toolbar is rendered
- **THEN** a single "Export" button SHALL be visible (no dropdown chevron)

#### Scenario: Clicking export triggers download
- **WHEN** the user clicks the Export button
- **THEN** the exporter for the current project language SHALL be invoked
- **THEN** the resulting ZIP SHALL be downloaded as a file named `<project-name>.zip`

#### Scenario: Export errors are surfaced
- **WHEN** export fails (e.g., unsupported language or filesystem error)
- **THEN** the error SHALL be surfaced to the user (console or alert)
