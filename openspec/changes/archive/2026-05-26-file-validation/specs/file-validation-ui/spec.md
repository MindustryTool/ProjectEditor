## ADDED Requirements

### Requirement: Validation state store holds per-file results
The system SHALL provide a zustand store (`useValidationStore`) that maps file paths to their validation results and tracks the total error/warning count.

#### Scenario: Results stored per path
- **WHEN** a file is validated
- **THEN** its results SHALL be stored in the validation store under its file path key

#### Scenario: Counts are reactive
- **WHEN** validation results change
- **THEN** the store SHALL update derived counts (total errors, warnings, infos) that components can subscribe to

#### Scenario: Clear results on file delete
- **WHEN** a file is deleted from the project
- **THEN** its validation results SHALL be removed from the store

### Requirement: MonacoEditor shows inline validation markers
The MonacoEditor component SHALL display validation markers (squiggly underlines) for the currently open file.

#### Scenario: Error markers shown
- **WHEN** the current file has validation results with severity "error" that include line/column info
- **THEN** MonacoEditor SHALL display red squiggly underlines at those locations with hover messages

#### Scenario: Warning markers shown
- **WHEN** the current file has validation results with severity "warning" that include line/column info
- **THEN** MonacoEditor SHALL display yellow squiggly underlines at those locations with hover messages

#### Scenario: No markers for file-level issues
- **WHEN** validation results have no line/column info
- **THEN** MonacoEditor SHALL NOT display any markers for those results

#### Scenario: Markers update on content change
- **WHEN** the file content changes (user types)
- **THEN** validation SHALL re-run after a debounce and markers SHALL update accordingly

### Requirement: FileExplorer shows validation badges per file
The FileExplorer component SHALL display a small badge on files that have validation issues.

#### Scenario: Error badge on file
- **WHEN** a file has any "error" severity validation results
- **THEN** its row in the file explorer SHALL show a red badge with the error count

#### Scenario: Warning badge on file
- **WHEN** a file has "warning" but no "error" results
- **THEN** its row in the file explorer SHALL show a yellow badge with the warning count

#### Scenario: No badge for clean files
- **WHEN** a file has no validation results (or only "info"/"deprecated")
- **THEN** its row in the file explorer SHALL NOT show any validation badge

#### Scenario: Badge clears when validation passes
- **WHEN** validation re-runs and a file's results become empty
- **THEN** the badge SHALL be removed

### Requirement: StatusBar shows total error/warning count
The StatusBar component SHALL display the total number of errors and warnings across all files on the right side.

#### Scenario: Error and warning counts shown
- **WHEN** the validation store has 3 errors and 2 warnings across all files
- **THEN** the StatusBar SHALL display "3 ✕ 2 ⚠" (or equivalent) on the right side

#### Scenario: Zero issues
- **WHEN** no files have validation issues
- **THEN** the StatusBar SHALL NOT show validation counts (or show "0 errors")

#### Scenario: Counts update reactively
- **WHEN** validation results change (file edited, file added/removed)
- **THEN** the StatusBar counts SHALL update immediately

### Requirement: ExportMenu shows validation preflight
The ExportMenu component SHALL run validation on all files before exporting and warn the user if errors exist.

#### Scenario: Export blocked on errors
- **WHEN** the user clicks "Download" and any file has "error" severity validation results
- **THEN** a dialog SHALL appear listing the errors and offering "Cancel" or "Export anyway"

#### Scenario: Export proceeds when clean
- **WHEN** the user clicks "Download" and no files have "error" severity validation results
- **THEN** the export SHALL proceed without interruption

#### Scenario: Warning-only allows export
- **WHEN** the user clicks "Download" and files have only "warning" (no "error") results
- **THEN** the export SHALL proceed, optionally with a brief non-blocking notice
