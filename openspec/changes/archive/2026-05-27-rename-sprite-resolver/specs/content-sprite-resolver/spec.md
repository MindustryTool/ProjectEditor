## RENAMED Requirements

### Requirement: resolveJsonContentImage resolves sprite path from JSON content path

**FROM**: `resolveJsonContentImage(path: string): string | null`
**TO**: `resolveContentSprite(path: string): string | null`

Behavior is unchanged — the function SHALL derive a sprite image path from a content JSON file path.

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

**FROM**: `resolveJsonContentImage` exported from `~/lib/utils`
**TO**: `resolveContentSprite` exported from `~/lib/utils`

#### Scenario: Importable from utils
- **WHEN** another module imports `resolveContentSprite` from `~/lib/utils`
- **THEN** the function is available and callable
