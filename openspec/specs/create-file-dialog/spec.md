## MODIFIED Requirements

### Requirement: Content type appends .hjson extension

**Old behavior**: Content types (item/block/unit/effect) create files with `.json` extension.

**New behavior**: Content types create files with `.hjson` extension.

#### Scenario: Content type appends .hjson extension
- **WHEN** the user creates an `item`, `block`, `unit`, `liquid`, `status`, `sector`, `env-block`, or `effect` entry with name `example`
- **THEN** the file SHALL be created as `{selectedFolder}/example.hjson`

#### Scenario: File and folder types have no extension
- **WHEN** the user creates a `file` or `folder` entry with name `data`
- **THEN** the file SHALL be created as `{folder}/data` (no extension appended)

#### Scenario: Extension shown inline in input
- **WHEN** the name input has value `example` and type is `item`
- **THEN** an `<InputGroupAddon>` SHALL display `.hjson` at the end of the input
- **WHEN** the type is `file` or `folder`
- **THEN** no extension addon SHALL be shown

### Requirement: Content type selects target folder
Content types SHALL show a folder picker dropdown restricting target folders to content-type-specific subdirectories instead of a template selector.

#### Scenario: Folder picker replaces template selector for content types
- **WHEN** the user selects `item`, `block`, `unit`, `liquid`, `status`, `sector`, `env-block`, or `effect` from the type dropdown
- **THEN** a folder picker dropdown SHALL appear instead of a template selector
- **AND** the folder picker SHALL list the content-type-specific root folder and its subdirectories

#### Scenario: File and folder types have no additional selector
- **WHEN** the user selects `file` or `folder` from the type dropdown
- **THEN** no folder picker SHALL appear

#### Scenario: Content type requires folder selection
- **WHEN** the user selects a content type but has not chosen a folder from the folder picker
- **THEN** the "Create" button SHALL be disabled or an error SHALL be shown

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
- **THEN** it SHALL display a dropdown with options: `file`, `folder`, `item`, `block`, `unit`, `liquid`, `status`, `sector`, `env-block`, `effect`

#### Scenario: Create button creates the entry
- **WHEN** the user enters a name, selects a type, optionally picks a folder, and clicks "Create"
- **THEN** the system SHALL:
  - For `folder`: call `context.fs.mkdir(path)` with the full path
  - For `file`: call `context.fs.writeTextFile(path, "")` with the full path
  - For content types: call `context.fs.writeTextFile(path, "")` with the full path at the selected folder

#### Scenario: Dialog closes on successful creation
- **WHEN** the create operation succeeds
- **THEN** the dialog SHALL close and the newly created file/folder SHALL be selected (for files, the editor SHALL navigate to it)

#### Scenario: Cancel closes dialog
- **WHEN** the user clicks "Cancel" or clicks outside the dialog
- **THEN** the dialog SHALL close without creating anything

#### Scenario: Validation prevents empty name
- **WHEN** the name input is empty and the user clicks "Create"
- **THEN** the dialog SHALL show an error message and SHALL NOT create the entry

#### Scenario: Content type appends extension
- **WHEN** the user creates an `item`, `block`, `unit`, `liquid`, `status`, `sector`, `env-block`, or `effect` entry with name `example`
- **THEN** the file SHALL be created as `{selectedFolder}/example.hjson`
