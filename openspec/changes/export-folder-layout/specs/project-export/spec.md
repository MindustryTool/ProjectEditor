## ADDED Requirements

### Requirement: JsonExporter nests export files under project-name folder
`JsonExporter` SHALL prefix every ZIP entry path with the project name, so extracting the ZIP creates a self-contained folder.

#### Scenario: All ZIP entries are prefixed with project name
- **WHEN** `JsonExporter.export()` is called with a project named `"MyMod"`
- **THEN** every ZIP entry name SHALL start with `MyMod/` (e.g., `MyMod/mod.json`, `MyMod/content/items.json`)

#### Scenario: Project name is not sanitized by exporter
- **WHEN** `JsonExporter.export()` reads the project name
- **THEN** it SHALL use the name as-is without additional sanitization
- **THEN** it SHALL rely on `ProjectInfoSchema` validation to guarantee valid characters
