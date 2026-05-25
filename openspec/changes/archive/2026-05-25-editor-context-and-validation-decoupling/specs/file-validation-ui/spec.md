## MODIFIED Requirements

### Requirement: MonacoEditor shows inline validation markers
MonacoEditor SHALL NOT trigger validation directly. It SHALL display markers from the validation store. Validation SHALL be triggered by the file-content-store subscriber on content changes. EditorContext SHALL subscribe to the validation store and update markers.

#### Scenario: Error markers shown
- **WHEN** the current file has validation results with severity "error" that include line/column info
- **THEN** MonacoEditor SHALL display red squiggly underlines at those locations with hover messages

#### Scenario: Warning markers shown
- **WHEN** the current file has validation results with severity "warning" that include line/column info
- **THEN** MonacoEditor SHALL display yellow squiggly underlines at those locations with hover messages

#### Scenario: No markers for file-level issues
- **WHEN** validation results have no line/column info
- **THEN** MonacoEditor SHALL NOT display any markers for those results

#### Scenario: Markers provided by EditorContext
- **WHEN** the file content changes (user types)
- **THEN** the file-content-store SHALL trigger validation after debounce
- **AND** the EditorContext SHALL update markers from the validation store
- **AND** MonacoEditor SHALL display the updated markers reactively
