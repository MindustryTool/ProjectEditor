## MODIFIED Requirements

### Requirement: Export menu items
The Export menu SHALL contain a single export button that triggers a ZIP download using the language-appropriate exporter.

#### Scenario: Export menu structure
- **WHEN** the Export button is rendered
- **THEN** it SHALL display a localized "Export" label rendered via `t()`
- **THEN** it SHALL NOT display "Export as JSON" or "Export as Image" items
- **THEN** it SHALL NOT have a dropdown chevron

## REMOVED Requirements

### Requirement: Export menu items
**Reason**: Replaced by unified single-button export that dispatches to the language-appropriate exporter. Image export was a placeholder with no implementation or use case.

**Migration**: The Export button now triggers `getExporter(project.language).export(context)` and downloads the resulting ZIP. All existing behavior is replaced.
