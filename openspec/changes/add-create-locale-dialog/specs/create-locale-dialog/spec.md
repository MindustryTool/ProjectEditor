## ADDED Requirements

### Requirement: Create New Locale menu item in LocalizationMenu
The system SHALL display a "Create New Locale" menu item in the LocalizationMenu dropdown.

#### Scenario: Menu item is visible
- **WHEN** the user opens the LocalizationMenu dropdown
- **THEN** the dropdown SHALL contain a "Create New Locale" menu item

### Requirement: Create Locale dialog opens on click
The system SHALL open a dialog when the user clicks the "Create New Locale" menu item.

#### Scenario: Dialog opens
- **WHEN** the user clicks the "Create New Locale" menu item
- **THEN** a dialog SHALL open titled "Create New Locale"

### Requirement: Dialog content is a separate component
The dialog content SHALL be defined in a separate component (`CreateLocaleDialogContent`) to prevent hooks from executing when the dialog is closed.

#### Scenario: Hooks not run when dialog closed
- **WHEN** the dialog is closed
- **THEN** no dialog-related hooks SHALL be active

### Requirement: Locale picker shows available locales
The dialog SHALL display a picker showing locale codes from `SUPPORTED_LOCALES` that have not yet been created in the current project.

#### Scenario: Locale picker shows uncreated locales
- **WHEN** the dialog opens and the project has existing locale files for `en`, `vi`
- **THEN** the locale picker SHALL list all `SUPPORTED_LOCALES` entries except `en` and `vi`

### Requirement: Source bundle picker (optional)
The dialog SHALL provide an optional second picker to choose a source bundle file from the project's `bundles/` directory.

#### Scenario: Source bundle picker shows existing bundles
- **WHEN** the dialog opens and the project has bundle files
- **THEN** the source bundle picker SHALL list all `bundle*.properties` files in the `bundles/` directory

#### Scenario: Source bundle picker can be left empty
- **WHEN** the user does not select a source bundle
- **THEN** the system SHALL create the new bundle file with no keys (empty file)

### Requirement: Create action scaffolds new bundle
When the user clicks Create, the system SHALL:
- If a source bundle is selected: read its content, extract all valid entry keys via `parseBundle()`, and write them to the new bundle file with empty string values
- If no source bundle is selected: create an empty bundle file

#### Scenario: Create with source bundle copies keys as empty values
- **WHEN** the user selects locale `vi` and source bundle `bundles/bundle.properties` which contains keys `item.copper`, `item.lead`
- **WHEN** the user clicks Create
- **THEN** the system SHALL create file `bundles/bundle_vi.properties` with entries `item.copper=`, `item.lead=`

#### Scenario: Create without source bundle creates empty file
- **WHEN** the user selects locale `vi` and no source bundle
- **WHEN** the user clicks Create
- **THEN** the system SHALL create file `bundles/bundle_vi.properties` with no content
