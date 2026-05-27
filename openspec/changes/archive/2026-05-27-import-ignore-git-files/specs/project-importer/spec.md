## ADDED Requirements

### Requirement: importProject excludes git-related entries
The system SHALL filter out entries related to git version control from the import result, including the `.git/` directory contents and any `.gitignore`, `.gitattributes`, `.gitmodules` files.

#### Scenario: Filters out .git directory entries
- **WHEN** the zip contains entries under a `.git/` directory (e.g., `.git/HEAD`, `.git/objects/...`)
- **THEN** those entries SHALL NOT be included in the returned `ImportResult.entries`

#### Scenario: Filters out .gitignore files
- **WHEN** the zip contains an entry named `.gitignore` at any depth (e.g., `.gitignore`, `MyMod/.gitignore`)
- **THEN** that entry SHALL NOT be included in the returned `ImportResult.entries`

#### Scenario: Filters out .gitattributes files
- **WHEN** the zip contains an entry named `.gitattributes`
- **THEN** that entry SHALL NOT be included in the returned `ImportResult.entries`

#### Scenario: Filters out .gitmodules files
- **WHEN** the zip contains an entry named `.gitmodules`
- **THEN** that entry SHALL NOT be included in the returned `ImportResult.entries`

#### Scenario: Non-git hidden files are preserved
- **WHEN** the zip contains hidden files not related to git (e.g., `.DS_Store`, `.editorconfig`)
- **THEN** those entries SHALL still be included in the returned `ImportResult.entries`
