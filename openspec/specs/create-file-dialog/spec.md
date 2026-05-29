## MODIFIED Requirements

### Requirement: Content type appends .json extension

**Old behavior**: Content types (item/block/unit/effect) create files with `.json` extension.

**New behavior**: Content types create files with `.hjson` extension.

#### Scenario: Content type appends .hjson extension
- **WHEN** the user creates an `item`, `block`, `unit`, `liquid`, `status`, `sector`, `env-block`, or `effect` entry with name `example`
- **THEN** the file SHALL be created as `{folder}/example.hjson`

#### Scenario: File and folder types have no extension
- **WHEN** the user creates a `file` or `folder` entry with name `data`
- **THEN** the file SHALL be created as `{folder}/data` (no extension appended)

#### Scenario: Extension shown inline in input
- **WHEN** the name input has value `example` and type is `item`
- **THEN** an `<InputGroupAddon>` SHALL display `.hjson` at the end of the input
- **WHEN** the type is `file` or `folder`
- **THEN** no extension addon SHALL be shown

### Requirement: Template dropdown appears for content types

**Old behavior**: All content types show a template dropdown with a default template and "None" option.

**New behavior**: All content types with composite hooks show a grouped selector with project/base items for template cloning. `effect` type (no base data) retains the old dropdown behavior.

#### Scenario: Content type shows item selector
- **WHEN** the user selects `item`, `block`, `unit`, `liquid`, `status`, `sector`, or `env-block` from the type dropdown
- **THEN** a grouped selector SHALL appear with:
  - "None (empty file)" as the first option
  - "Project" group listing project entries (from the corresponding composite hook)
  - "Base" group listing base game entries (from the corresponding composite hook)
- **WHEN** no items exist in a group
- **THEN** that group SHALL NOT be shown

#### Scenario: Effect type shows template dropdown
- **WHEN** the user selects `effect` from the type dropdown
- **THEN** a template dropdown SHALL appear with "None (empty file)" and the default template for that type

#### Scenario: Clone from project item
- **WHEN** the user selects a project item from the selector and clicks "Create"
- **THEN** the system SHALL read the selected item's file content via `context.fs.readTextFile(path)` and write it to the new path

#### Scenario: Clone from base item
- **WHEN** the user selects a base game item from the selector and clicks "Create"
- **THEN** the system SHALL create the file with empty content (async placeholder for future API integration)

### Requirement: Template loading is async

**Old behavior**: Template content was generated synchronously from factory functions.

**New behavior**: Template content loading is async to support file reads and future API calls.

#### Scenario: Create awaits template content
- **WHEN** the user clicks "Create" with any template selected
- **THEN** the system SHALL await the template content loading before writing the file

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

#### Scenario: Template selector appears for content types
- **WHEN** the user selects `item`, `block`, `unit`, `liquid`, `status`, `sector`, or `env-block` from the type dropdown
- **THEN** a grouped selector SHALL appear listing project and base entries
- **WHEN** the user selects `effect` from the type dropdown
- **THEN** a template dropdown SHALL appear with "None (empty file)" and the default template
- **WHEN** the user selects `file` or `folder` from the type dropdown
- **THEN** the template selector SHALL NOT be shown

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

#### Scenario: Content type appends extension
- **WHEN** the user creates an `item`, `block`, `unit`, `liquid`, `status`, `sector`, `env-block`, or `effect` entry with name `example`
- **THEN** the file SHALL be created as `{folder}/example.hjson`

### Requirement: Template selection is optional
The template dropdown in the create file dialog SHALL allow selecting "None (empty file)" as an option, creating the content file with empty content.

#### Scenario: Template selector offers "None" option
- **WHEN** the user selects any content type from the type dropdown
- **THEN** the template selector SHALL include a "None (empty file)" option at the top

#### Scenario: "None" creates empty file
- **WHEN** the user selects "None (empty file)" and clicks "Create"
- **THEN** the system SHALL call `context.fs.writeTextFile(path, "")` with empty content

#### Scenario: Template content loaded via getContent
- **WHEN** the user selects a project entry as template and clicks "Create"
- **THEN** the system SHALL call `item.getContent(context.fs)` and write the result to the new path
- **WHEN** the user selects a base entry as template and clicks "Create"
- **THEN** the system SHALL create the file with empty content (placeholder for future API integration)
