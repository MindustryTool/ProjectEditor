## ADDED Requirements

### Requirement: Nested object edits preserve object structure
When a rendered field is backed by `HjsonObjectNode`, edits to nested content SHALL patch targeted child fields and SHALL NOT replace the entire object value during normal editing flows.

#### Scenario: Nested primitive child patches targeted field
- **WHEN** a primitive child field inside an object is edited
- **THEN** the renderer SHALL patch only that child field in the object's source text
- **AND** the containing object SHALL remain otherwise unchanged

#### Scenario: Nested structural child delegates to structural patching
- **WHEN** an object child field itself renders as an object or array editor
- **THEN** further edits SHALL continue through structural patch operations for that child content
- **AND** the renderer SHALL not replace the whole parent object as shortcut
