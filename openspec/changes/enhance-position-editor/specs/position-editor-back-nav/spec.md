## ADDED Requirements

### Requirement: Back button in PositionSidebar
The `PositionSidebar` component SHALL render a persistent "Back to text editor" button at the top of the sidebar that is always visible (not scrolled away).

#### Scenario: Back button renders at top
- **WHEN** the position editor is open and sidebar is visible
- **THEN** a button labeled with the text editor navigation action SHALL be displayed at the top of the sidebar
- **AND** the button SHALL remain visible regardless of sidebar scroll position

#### Scenario: Back button navigates to text editor
- **WHEN** user clicks the back button
- **THEN** the system SHALL call `setPath({ path, type: "text", jsonPath: null })` using the `usePath` hook
- **AND** the editor SHALL switch from sprite editor view to the text/HJSON editor view

#### Scenario: Back button with correct file path
- **WHEN** user clicks the back button
- **THEN** the path used in `setPath` SHALL match the current file path being edited
- **AND** the file SHALL remain open in the text editor
