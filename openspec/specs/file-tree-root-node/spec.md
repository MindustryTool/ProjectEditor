## ADDED Requirements

### Requirement: File tree wrapped in root node
The file explorer SHALL display the entire project file tree wrapped under a single root folder node representing the project name.

#### Scenario: Root node displayed as top-level folder
- **WHEN** the file explorer renders with an active project
- **THEN** all project files and folders SHALL be nested under a single root folder node at the top of the tree

#### Scenario: Root node shows project name
- **WHEN** the root node is rendered
- **THEN** it SHALL display the project name (from `context.project.name` or `context.project.displayName`)

#### Scenario: Root node is expandable/collapsible
- **WHEN** the user clicks the root folder node
- **THEN** the root node SHALL expand to show all project children, or collapse if already expanded

#### Scenario: Root node shows folder icon
- **WHEN** the root node is rendered
- **THEN** it SHALL display a folder icon (closed when collapsed, open when expanded)

#### Scenario: Root node has action buttons
- **WHEN** the user hovers over the root node
- **THEN** it SHALL display the "+" create button (and SHALL NOT show rename/delete buttons since it represents the project root)

#### Scenario: No selection highlight on root node
- **WHEN** the user clicks the root node
- **THEN** it SHALL expand/collapse without changing the `?path=` URL parameter or file selection
