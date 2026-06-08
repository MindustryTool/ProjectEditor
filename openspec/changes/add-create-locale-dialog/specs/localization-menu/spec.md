## MODIFIED Requirements

### Requirement: Localization menu opens with create locale item
The system SHALL display a "Localization" dropdown menu in the editor toolbar, positioned after the Export menu.

#### Scenario: Localization menu is present in toolbar
- **WHEN** the editor page renders
- **THEN** the toolbar SHALL contain a "Localization" dropdown trigger button after the Export menu

#### Scenario: Localization menu opens with create locale item
- **WHEN** the user clicks the "Localization" trigger button
- **THEN** a dropdown SHALL open with a "Create New Locale" menu item
