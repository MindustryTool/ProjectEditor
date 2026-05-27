## Requirements

### Requirement: importProject parses zip and finds mod.hjson
The system SHALL provide an `importProject(zipData)` function that accepts a `Uint8Array` (zip file bytes), extracts its entries using `extractZip()`, finds the `mod.hjson` file, and returns the project metadata along with scoped file entries.

#### Scenario: Finds mod.hjson in a flat zip
- **WHEN** the zip contains `mod.hjson` at the top level (e.g., `mod.hjson`, `content/blocks.json`)
- **THEN** the root folder SHALL be `""` (empty string — zip root is project root)
- **AND** the returned entries SHALL include all files with their original paths

#### Scenario: Finds mod.hjson in a nested folder
- **WHEN** the zip contains `mod.hjson` inside a subfolder (e.g., `MyMod/mod.hjson`, `MyMod/content/blocks.json`)
- **THEN** the root folder SHALL be `"MyMod/"`
- **AND** the returned entries SHALL have paths relative to `MyMod/` (e.g., `content/blocks.json`)

#### Scenario: Returns parsed project info from mod.hjson
- **WHEN** `mod.hjson` is found and contains valid project metadata (e.g., `name: "MyMod"`, `minGameVersion: "146"`)
- **THEN** the returned result SHALL include a project name derived from the `name` field
- **AND** the language SHALL default to `"json"` (Mindustry mod format)

#### Scenario: Throws if mod.hjson is missing
- **WHEN** the zip does not contain any file named `mod.hjson`
- **THEN** the function SHALL throw an error with message `"No mod.hjson found in zip"`

### Requirement: importProject returns structured result
The system SHALL return an `ImportResult` object containing the project name, language, and the parsed file entries scoped to the project root.

#### Scenario: Result contains name, language, and entries
- **WHEN** `importProject` completes successfully
- **THEN** the result SHALL have a `name` field (string)
- **AND** a `language` field (`"json"`)
- **AND** an `entries` field (array of `{ name: string; data: Uint8Array }`)

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
