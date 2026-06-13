## MODIFIED Requirements

### Requirement: Template dropdown appears for content types

**Old behavior**: All content types show a template dropdown with a default template and "None" option.

**New behavior**: Template selection is removed. Content types SHALL show a folder picker dropdown restricting target folders to content-type-specific subdirectories. The template selector SHALL NOT appear.

#### Scenario: Folder picker replaces template selector for content types
- **WHEN** the user selects `item`, `block`, `unit`, `liquid`, `status`, `sector`, `env-block`, or `effect` from the type dropdown
- **THEN** a folder picker dropdown SHALL appear instead of a template selector
- **AND** the folder picker SHALL list the content-type-specific root folder and its subdirectories

#### Scenario: File and folder types have no additional selector
- **WHEN** the user selects `file` or `folder` from the type dropdown
- **THEN** no folder picker SHALL appear

### Requirement: Create button creates the entry

**Old behavior**: For content types, the system writes template content to the new file.

**New behavior**: For content types, the system writes empty content to the new file at the selected folder.

#### Scenario: Content type creates empty file at selected folder
- **WHEN** the user enters a name, selects a content type, picks a folder from the folder picker, and clicks "Create"
- **THEN** the system SHALL create the file at `{selectedFolder}/{name}.hjson` with empty content `""`

#### Scenario: Content type enforces extension
- **WHEN** the user creates an `item`, `block`, `unit`, `liquid`, `status`, `sector`, `env-block`, or `effect` entry with name `example`
- **THEN** the file SHALL be created as `{selectedFolder}/example.hjson`

## REMOVED Requirements

### Requirement: Template dropdown appears for content types

**Reason**: Replaced by content-folder-picker and file-import-upload capabilities. Users now select a target folder instead of cloning from a template, and can import files from disk.

**Migration**: The folder picker is shown for content types instead of the template selector. Users can import files from disk using the "Import File" button.

### Requirement: Template loading is async

**Reason**: Async template loading infrastructure (refs, callbacks, `getContent`) is removed along with the TemplateSelector component.

**Migration**: Removed entirely. File creation uses empty content for new files or reads the imported file directly.

### Requirement: Template selection is optional

**Reason**: Template selection UI is removed.

**Migration**: Users can import existing files from disk instead of cloning from templates.
