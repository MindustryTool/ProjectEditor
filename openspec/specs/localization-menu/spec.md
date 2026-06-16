## ADDED Requirements

### Requirement: Localization menu exists in editor toolbar
The system SHALL display a "Localization" dropdown menu in the editor toolbar, positioned after the Export menu.

#### Scenario: Localization menu is present in toolbar
- **WHEN** the editor page renders
- **THEN** the toolbar SHALL contain a "Localization" dropdown trigger button after the Export menu

#### Scenario: Localization menu opens with items
- **WHEN** the user clicks the "Localization" trigger button
- **THEN** a dropdown SHALL open with a "Create New Locale" item

#### Scenario: Create Locale opens dialog without closing menu
- **WHEN** user clicks "Create New Locale" in the Localization menu
- **THEN** a dialog SHALL open for creating a new locale
- **THEN** the menu SHALL NOT close

### Requirement: Translation keys for Localization menu
The system SHALL provide translation entries for the Localization menu label in both English and Vietnamese locale files.

#### Scenario: English translation exists
- **WHEN** the language is set to English
- **THEN** the Localization menu trigger SHALL display "Localization"

#### Scenario: Vietnamese translation exists
- **WHEN** the language is set to Vietnamese
- **THEN** the Localization menu trigger SHALL display the Vietnamese translation
