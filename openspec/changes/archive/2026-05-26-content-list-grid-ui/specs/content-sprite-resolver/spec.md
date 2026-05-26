## ADDED Requirements

### Requirement: resolveJsonContentImage resolves sprite path from JSON content path
The helper function `resolveJsonContentImage(path: string): string | null` SHALL derive a sprite image path from a content JSON file path.

#### Scenario: Valid content JSON path
- **WHEN** given a path like `content/items/copper.json`
- **THEN** it returns `sprites/copper.png`

#### Scenario: Non-content path returns null
- **WHEN** given a path like `mod.hjson` or `content/foo.txt`
- **THEN** it returns `null`

#### Scenario: No subpath after content/ returns null
- **WHEN** given a path like `content/` or `content`
- **THEN** it returns `null`

### Requirement: Helper is exported from ~/lib/utils
The function SHALL be exported from `~/lib/utils` for reuse across the codebase.

#### Scenario: Importable from utils
- **WHEN** another module imports `resolveJsonContentImage` from `~/lib/utils`
- **THEN** the function is available and callable
