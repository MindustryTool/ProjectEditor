## ADDED Requirements

### Requirement: Toolbar with Files and Export menus
The Toolbar component SHALL render a horizontal bar at the top with localized "Files" and "Export" dropdown menu buttons.

#### Scenario: Toolbar renders menus
- **WHEN** the Toolbar is rendered
- **THEN** localized "Files" and "Export" buttons SHALL be visible in the toolbar, rendered via `t()`

#### Scenario: Menu opens on click
- **WHEN** user clicks the "Files" button
- **THEN** a dropdown menu SHALL appear below the button with menu items

#### Scenario: Menu closes on outside click
- **WHEN** a menu is open and user clicks outside it
- **THEN** the menu SHALL close

### Requirement: Files menu items
The Files menu SHALL contain placeholder items for project file operations, with labels rendered via translation keys.

#### Scenario: Files menu structure
- **WHEN** the Files menu is open
- **THEN** it SHALL display localized items: "Open File", "Save", "Save As"

### Requirement: Export menu items
The Export menu SHALL contain placeholder items for project export operations, with labels rendered via translation keys.

#### Scenario: Export menu structure
- **WHEN** the Export menu is open
- **THEN** it SHALL display localized items: "Export as JSON", "Export as Image"
