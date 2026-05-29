## Delta: create-file-dialog

These requirements replace or extend the existing `create-file-dialog` spec.

### Modified: Content type extension

**Old requirement**: Content types (`item`, `block`, `unit`, `effect`) create files with `.json` extension.

**New requirement**: Content types create files with `.hjson` extension.

#### Scenario: Content type appends .hjson extension
- **WHEN** the user creates an `item`, `block`, `unit`, or `effect` entry with name `example`
- **THEN** the file SHALL be created as `{folder}/example.hjson`

#### Scenario: File and folder types have no extension
- **WHEN** the user creates a `file` or `folder` entry with name `data`
- **THEN** the file SHALL be created as `{folder}/data` (no extension appended)

#### Scenario: Preview shows correct extension
- **WHEN** the name input has value `example` and type is `item`
- **THEN** the full path preview SHALL display `{targetPath}/example.hjson`
- **WHEN** the type is `file`
- **THEN** the full path preview SHALL display `{targetPath}/example`

### Modified: Item template selection

**Old requirement**: Item type shows a template dropdown with "None (empty file)" and "Item Template" options.

**New requirement**: Item type shows a grouped select listing items from the project and base game for template cloning.

#### Scenario: Item type shows item selector
- **WHEN** the user selects `item` from the type dropdown
- **THEN** a grouped selector SHALL appear with:
  - "None (empty file)" as the first option
  - "Items (Project)" group listing project items (from `useItems({ project: true })`)
  - "Items (Base)" group listing base game items (from `useItems({ base: true })`)
- **WHEN** no items exist in a group
- **THEN** that group SHALL NOT be shown

#### Scenario: Clone from project item
- **WHEN** the user selects a project item from the selector and clicks "Create"
- **THEN** the system SHALL read the selected item's file content via `context.fs.readTextFile(path)` and write it to the new path

#### Scenario: Clone from base item
- **WHEN** the user selects a base game item from the selector and clicks "Create"
- **THEN** the system SHALL create the file with empty content (async placeholder for future API integration)

#### Scenario: Template loading is async
- **WHEN** the user clicks "Create" with a template selected
- **THEN** the system SHALL await the template content loading before writing the file

### Unchanged: Block / Unit / Effect template behavior

Block, unit, and effect types retain the current behavior: "None (empty file)" + their respective template function from `templates.ts`. No selector changes.
