## MODIFIED Requirements

### Requirement: Array Add and Remove use onChange updater pattern
The array renderer SHALL use the `onChange(jsonPath, updater)` pattern for Add and Remove operations instead of calling `onPatch` directly.

#### Scenario: Add button appends new item
- **WHEN** the user clicks the Add button on an array field
- **THEN** the renderer SHALL call `onChange(jsonPath, (node, original) => (node as HjsonArrayNode).insertElement(original, length, HJSON.stringify(defaultValue)))`
- **AND** a new item editor SHALL appear

#### Scenario: Remove button removes item by index
- **WHEN** the user clicks the Remove button on an array item
- **THEN** the renderer SHALL call `onChange(jsonPath, (node, original) => (node as HjsonArrayNode).removeElement(original, index))`
- **AND** that item SHALL be removed from the display

### Requirement: Array item changes use onChange updater
When an array item value changes, the renderer SHALL use `onChange` with element-specific jsonPath.

#### Scenario: Array item modification uses element jsonPath
- **WHEN** an array item's value is modified
- **THEN** the renderer SHALL call `onChange(jsonPath + "[" + index + "]", updater)` where updater patches the specific element
- **AND** only the modified item SHALL be replaced in the source string

## ADDED Requirements

### Requirement: SchemaArrayItemEditor receives new onChange type
`SchemaArrayItemEditor` SHALL accept the new `onChange(jsonPath, updater)` callback type instead of `onChange(value)`.

#### Scenario: String item renders directly with updater
- **WHEN** an array item schema type is `"string"`
- **THEN** the editor SHALL call `onChange(jsonPath, (node, original) => (node as HjsonValueNode).patchValue(original, HJSON.stringify(e.target.value)))` on input change

#### Scenario: Complex item passes onChange to child renderer
- **WHEN** an array item schema type is non-string
- **THEN** the editor SHALL pass `onChange` directly to the child renderer with the correct `jsonPath`
