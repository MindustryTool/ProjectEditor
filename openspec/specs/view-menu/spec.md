## ADDED Requirements

### Requirement: View menu exists in editor toolbar
The system SHALL display a "View" dropdown menu in the editor toolbar, positioned between the Files menu and the Export menu.

#### Scenario: View menu is present in toolbar
- **WHEN** the editor page renders
- **THEN** the toolbar SHALL contain a "View" dropdown trigger button between the Files and Export menus

#### Scenario: View menu opens on click
- **WHEN** the user clicks the "View" trigger button
- **THEN** a dropdown SHALL open with "Change Theme" and "Change Language" submenu items

### Requirement: Change Theme submenu
The system SHALL provide a "Change Theme" submenu within the View menu that allows switching between Light, Dark, and Auto (system default) theme modes.

#### Scenario: Theme submenu shows current selection
- **WHEN** the user opens the View menu and hovers over "Change Theme"
- **THEN** a submenu SHALL appear with radio items for "Light", "Dark", and "Auto"
- **AND** the currently active theme mode SHALL be visually indicated (radio selected)

#### Scenario: User switches to Dark theme
- **WHEN** the user selects "Dark" in the Change Theme submenu
- **THEN** the system SHALL apply the dark theme
- **AND** persist the selection to localStorage with key "theme"
- **AND** the radio indicator SHALL move to the "Dark" item

#### Scenario: User switches to Light theme
- **WHEN** the user selects "Light" in the Change Theme submenu
- **THEN** the system SHALL apply the light theme
- **AND** persist the selection to localStorage with key "theme"

#### Scenario: User switches to Auto theme
- **WHEN** the user selects "Auto" in the Change Theme submenu
- **THEN** the system SHALL follow the system color scheme preference
- **AND** persist the selection to localStorage with key "theme"

### Requirement: Change Language submenu
The system SHALL provide a "Change Language" submenu within the View menu that allows switching between available locales.

#### Scenario: Language submenu shows available languages
- **WHEN** the user opens the View menu and hovers over "Change Language"
- **THEN** a submenu SHALL appear with items for each available locale ("English", "Tiếng Việt")

#### Scenario: User switches language
- **WHEN** the user selects "Tiếng Việt" in the Change Language submenu
- **THEN** the system SHALL change the UI language to Vietnamese

#### Scenario: Language change is immediate
- **WHEN** the user selects a new language
- **THEN** all translated UI text SHALL update immediately without page reload

### Requirement: Translation keys for View menu
The system SHALL provide translation entries for all View menu labels in both English and Vietnamese locale files.

#### Scenario: English translations exist
- **WHEN** the language is set to English
- **THEN** the View menu SHALL display "View", "Change Theme", "Light", "Dark", "Auto", "Change Language" in English

#### Scenario: Vietnamese translations exist
- **WHEN** the language is set to Vietnamese
- **THEN** the View menu SHALL display Vietnamese translations for all labels
