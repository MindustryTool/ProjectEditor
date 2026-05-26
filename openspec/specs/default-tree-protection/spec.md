## ADDED Requirements

### Requirement: Default project tree accessible on ProjectFileSystem
The system SHALL expose the `DefaultProjectFileTree` instance used during project initialization as a public property on `ProjectFileSystem`.

#### Scenario: defaultProjectTree property exists
- **WHEN** a `ProjectFileSystem` instance is created via `createProjectFileSystem`
- **THEN** it SHALL have a public `defaultProjectTree` property referencing the `jsonProjectTree` singleton

#### Scenario: defaultProjectTree contains the original tree
- **WHEN** accessing `projectFileSystem.defaultProjectTree`
- **THEN** its `projectTree` SHALL contain the same root-level nodes as the `jsonProjectTree` used during initialization (e.g., `mod.hjson`, `content/`, `maps/`)

### Requirement: isDefaultPath utility identifies default tree paths
The system SHALL provide a utility function `isDefaultPath(tree: DefaultProjectFileTree, path: string): boolean` that checks whether a given relative path exactly matches a node in the default project tree.

#### Scenario: Default file path matches
- **WHEN** checking path `"mod.hjson"` against the default tree
- **THEN** `isDefaultPath` SHALL return `true`

#### Scenario: Default folder path matches
- **WHEN** checking path `"content"` against the default tree
- **THEN** `isDefaultPath` SHALL return `true`

#### Scenario: Nested default folder path matches
- **WHEN** checking path `"content/items"` against the default tree
- **THEN** `isDefaultPath` SHALL return `true`

#### Scenario: User-created file does not match
- **WHEN** checking path `"content/items/custom-item.hjson"` against the default tree
- **THEN** `isDefaultPath` SHALL return `false`

#### Scenario: Non-existent path does not match
- **WHEN** checking path `"nonexistent-file.txt"` against the default tree
- **THEN** `isDefaultPath` SHALL return `false`
