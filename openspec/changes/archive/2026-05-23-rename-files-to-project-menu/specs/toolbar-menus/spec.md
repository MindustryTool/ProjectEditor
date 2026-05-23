## MODIFIED Requirements

### Requirement: Toolbar with Project and Export menus
The Toolbar component SHALL render a horizontal bar at the top with localized "Project" and "Export" dropdown menu buttons.

**Reason:** FilesMenu renamed to ProjectMenu; menu items changed from file operations to project operations.

#### Scenario: Toolbar renders menus
- **WHEN** the Toolbar is rendered
- **THEN** localized "Project" and "Export" buttons SHALL be visible in the toolbar, rendered via `t()`

#### Scenario: Menu opens on click
- **WHEN** user clicks the "Project" button
- **THEN** a dropdown menu SHALL appear below the button with project management items

#### Scenario: Menu closes on outside click
- **WHEN** a menu is open and user clicks outside it
- **THEN** the menu SHALL close

### Requirement: Project menu items (replaces Files menu)
The Project menu SHALL contain items for project CRUD operations: Create Project, Open Project, Change Project, and Close Project, with labels rendered via translation keys.

**Reason:** Replaced file operations (Open File, Save, Save As) with project-level operations.

#### Scenario: Project menu structure
- **WHEN** the Project menu is open
- **THEN** it SHALL display localized items: "Create Project", "Open Project", "Change Project", "Close Project"

## REMOVED Requirements

### Requirement: Files menu items
**Reason:** Replaced by Project menu with project-level actions instead of file-level actions.
**Migration:** Use `ProjectMenu` component instead of `FilesMenu`; file-level operations are handled by FileExplorer and Editor components.
