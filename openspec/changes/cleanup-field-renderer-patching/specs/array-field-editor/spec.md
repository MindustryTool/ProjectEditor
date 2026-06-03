## ADDED Requirements

### Requirement: Array edits preserve array structure
Array field editing SHALL use structural array patch operations and SHALL NOT replace the entire array value during normal editing flows.

#### Scenario: Array item update patches one element
- **WHEN** an existing array item is modified
- **THEN** the renderer SHALL patch only the targeted element in the source text
- **AND** the rest of the array SHALL remain unchanged

#### Scenario: Array add or remove patches array structurally
- **WHEN** the user adds or removes an array item
- **THEN** the renderer SHALL update the source text through insert/remove array patch operations
- **AND** the renderer SHALL not rewrite the whole array as replacement value

### Requirement: Array initialization patches from parent field context
If a schema expects an array but current field is missing or not an array node, the editor SHALL initialize that field through parent field patching before array item editing continues.

#### Scenario: Missing array field is initialized structurally
- **WHEN** an array field is rendered and current node is missing or not an array
- **THEN** the parent field SHALL be patched with default array content
- **AND** the array renderer SHALL not depend on a generic whole-value replacement helper
