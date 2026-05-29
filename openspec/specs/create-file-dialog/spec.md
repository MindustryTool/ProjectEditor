## ADDED Requirements

### Requirement: Create file dialog
The system SHALL provide a dialog for creating new files, folders, or content entries in the project tree. The dialog SHALL be accessible via a "+" button on folder rows in the file explorer.

#### Scenario: Dialog opens on plus button click
- **WHEN** the user clicks the "+" button on a folder row
- **THEN** the create file dialog SHALL open with the target folder path set to that folder

#### Scenario: Dialog shows name input
- **WHEN** the create file dialog is open
- **THEN** it SHALL display a text input field for the new entry name, with a placeholder indicating the expected name format

#### Scenario: Dialog shows type dropdown
- **WHEN** the create file dialog is open
- **THEN** it SHALL display a dropdown with options: `file`, `folder`, `item`, `block`, `unit`, `effect`

#### Scenario: Template dropdown appears for content types
- **WHEN** the user selects `item`, `block`, `unit`, or `effect` from the type dropdown
- **THEN** a second dropdown SHALL appear offering template options (a default template for that type)
- **WHEN** the user selects `file` or `folder` from the type dropdown
- **THEN** the template dropdown SHALL NOT be shown

#### Scenario: Create button creates the entry
- **WHEN** the user enters a name, selects a type, optionally picks a template, and clicks "Create"
- **THEN** the system SHALL:
  - For `folder`: call `context.fs.mkdir(path)` with the full path
  - For `file`: call `context.fs.writeTextFile(path, "")` with the full path
  - For content types: call `context.fs.writeTextFile(path, templateContent)` with the full path and the selected template content

#### Scenario: Dialog closes on successful creation
- **WHEN** the create operation succeeds
- **THEN** the dialog SHALL close and the newly created file/folder SHALL be selected (for files, the editor SHALL navigate to it)

#### Scenario: Cancel closes dialog
- **WHEN** the user clicks "Cancel" or clicks outside the dialog
- **THEN** the dialog SHALL close without creating anything

#### Scenario: Validation prevents empty name
- **WHEN** the name input is empty and the user clicks "Create"
- **THEN** the dialog SHALL show an error message and SHALL NOT create the entry

#### Scenario: Content type appends .json extension
- **WHEN** the user creates an `item`, `block`, `unit`, or `effect` entry with name `example`
- **THEN** the file SHALL be created as `{folder}/example.json`

### Requirement: Template selection is optional
The template dropdown in the create file dialog SHALL allow selecting "None (empty file)" as an option, creating the content file with empty content.

#### Scenario: Template dropdown offers "None" option
- **WHEN** the user selects `item`, `block`, `unit`, or `effect` from the type dropdown
- **THEN** the template dropdown SHALL include a "None (empty file)" option at the top, followed by the default template option

#### Scenario: "None" creates empty file
- **WHEN** the user selects "None (empty file)" and clicks "Create"
- **THEN** the system SHALL call `context.fs.writeTextFile(path, "")` with empty content

#### Scenario: Default template still available
- **WHEN** the user selects the default template (e.g., "Item Template") and clicks "Create"
- **THEN** the system SHALL call `context.fs.writeTextFile(path, templateContent)` with the template content
