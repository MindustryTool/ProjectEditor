## ADDED Requirements

### Requirement: Toolbar with Project and Export menus
The Toolbar component SHALL render a horizontal bar at the top with localized "Project" and "Export" dropdown menu buttons.

#### Scenario: Toolbar renders menus
- **WHEN** the Toolbar is rendered
- **THEN** localized "Project" and "Export" buttons SHALL be visible in the toolbar, rendered via `t()`

#### Scenario: Menu opens on click
- **WHEN** user clicks the "Project" button
- **THEN** a dropdown menu SHALL appear below the button with project management items

#### Scenario: Menu closes on outside click
- **WHEN** a menu is open and user clicks outside it
- **THEN** the menu SHALL close

#### Scenario: Menu stays open when dialog trigger is clicked
- **WHEN** a menu is open and user clicks a dialog-triggering item (e.g., "Create Project", "Open Project")
- **THEN** the dialog SHALL open
- **THEN** the menu SHALL NOT close

### Requirement: Project menu items
The Project menu SHALL contain items for project actions: Create Project, Open Project, Change Project, Project Settings, and Close Project, with labels rendered via translation keys.

#### Scenario: Project menu structure
- **WHEN** the Project menu is open
- **THEN** it SHALL display localized items: "Create Project", "Open Project", "Change Project", "Project Settings", "Close Project"

### Requirement: Export menu items
The Export menu SHALL contain a single export button that triggers a ZIP download using the language-appropriate exporter.

#### Scenario: Export menu structure
- **WHEN** the Export button is rendered
- **THEN** it SHALL display a localized "Export" label rendered via `t()`
- **THEN** it SHALL NOT display "Export as JSON" or "Export as Image" items
- **THEN** it SHALL NOT have a dropdown chevron
