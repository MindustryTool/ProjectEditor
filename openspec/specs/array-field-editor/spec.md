## Requirements

### Requirement: FieldTypes includes Array type mapped to HjsonArrayNode
`FieldTypes` in `FieldRenderer.tsx` SHALL include an `Array` type mapping to `HjsonArrayNode`.

#### Scenario: Array type defined in FieldTypes
- **WHEN** a field with `type: "Array"` is declared
- **THEN** the system SHALL render an array editor UI for that field

### Requirement: Array field renders items from HjsonArrayNode.elements()
When a field has `type: "Array"`, the renderer SHALL iterate `arrayNode.elements()` to render each item using its `ElementInfo` metadata.

#### Scenario: Array field renders current items
- **WHEN** a field has `type: "Array"` and the `HjsonArrayNode` has 3 elements
- **THEN** the renderer SHALL display three item editors, one for each element
- **AND** each editor SHALL have access to the `ElementInfo` for positional patching

### Requirement: Array field provides Add and Remove buttons
The array renderer SHALL provide Add and Remove buttons for mutating the array.

#### Scenario: Add button appends new item
- **WHEN** the user clicks the Add button on an array field
- **THEN** the renderer SHALL call `onPatch` with the result of `arrayNode.insertElement(original, length, newValue)`
- **AND** a new item editor SHALL appear

#### Scenario: Remove button removes item by index
- **WHEN** the user clicks the Remove button on an array item
- **THEN** the renderer SHALL call `onPatch` with the result of `arrayNode.removeElement(original, index)`
- **AND** that item SHALL be removed from the display

### Requirement: Array item changes patch via HjsonArrayNode
When an array item value changes, the renderer SHALL use `arrayNode.patchElement()` for surgical single-item replacement.

#### Scenario: Array item modification uses patchElement
- **WHEN** an array item's value is modified
- **THEN** the renderer SHALL call `arrayNode.patchElement(original, index, HJSON.stringify(newValue))`
- **AND** only the modified item SHALL be replaced in the source string

### Requirement: Array field items render using itemType
Array item editors SHALL use the schema-derived renderer specified by the item schema, passing the raw element value instead of an HjsonNode.

#### Scenario: String array items render as text inputs
- **WHEN** a field has `type: "array"` with `v.string()` item schema
- **THEN** each item SHALL render as a text input using the `String` renderer with the raw string value

#### Scenario: Number array items render as number inputs
- **WHEN** a field has `type: "array"` with `v.number()` item schema
- **THEN** each item SHALL render as a number input using the `Number` renderer with the raw number value
