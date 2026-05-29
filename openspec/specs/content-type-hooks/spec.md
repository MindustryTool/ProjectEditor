## ADDED Requirements

### Requirement: Composite content type hooks
The system SHALL provide composite hooks for each Mindustry content type that merge project entries and base API data, returning items with async content loading capability.

#### Scenario: Hook returns project + base entries
- **WHEN** `useBlocks()`, `useUnits()`, `useLiquids()`, `useStatuses()`, `useSectors()` is called
- **THEN** it SHALL return an array of `{ name: string; type: "project" | "base"; path: string; getContent: (fs: ProjectFileSystem) => Promise<unknown> }`
- **WHEN** project entries exist in `content/<type>/`
- **THEN** they SHALL be included with `type: "project"` and `getContent` reading the file via `fs.readTextFile(path)` and parsing as JSON
- **WHEN** base API data is loaded
- **THEN** they SHALL be included with `type: "base"` and `getContent` returning `""` (placeholder)
- **WHEN** no entries exist for a group
- **THEN** that group SHALL be empty

#### Scenario: useItems updated with getContent
- **WHEN** `useItems()` is called
- **THEN** it SHALL return items with `getContent: (fs: ProjectFileSystem) => Promise<unknown>`
- **WHEN** `getContent` is called on a project item
- **THEN** it SHALL read the file via `fs.readTextFile(path)` and parse as JSON
- **WHEN** `getContent` is called on a base item
- **THEN** it SHALL return `""` (placeholder)
