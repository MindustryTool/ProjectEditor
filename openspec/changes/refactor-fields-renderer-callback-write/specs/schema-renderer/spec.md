## ADDED Requirements

### Requirement: Renderer receives value prop instead of HjsonNode
The schema renderer functions SHALL receive the actual deserialized value as `value` prop instead of an `HjsonNode` as `node` prop.

#### Scenario: String renderer displays value
- **WHEN** the value is a string `"hello"`
- **THEN** the input SHALL display `"hello"`

#### Scenario: String renderer calls onChange on edit
- **WHEN** the user types in the input
- **THEN** `onChange(newValue)` SHALL be called with the new string

#### Scenario: Number renderer displays value
- **WHEN** the value is `42`
- **THEN** the input SHALL display `42`

#### Scenario: Number renderer calls onChange on edit
- **WHEN** the user types in the number input
- **THEN** `onChange(newValue)` SHALL be called with the new number

#### Scenario: Boolean renderer reflects value
- **WHEN** the value is `true`
- **THEN** the checkbox SHALL be checked

#### Scenario: Boolean renderer calls onChange on toggle
- **WHEN** the user clicks the checkbox
- **THEN** `onChange(newValue)` SHALL be called with the new boolean

#### Scenario: Color renderer displays hex value
- **WHEN** the value is `"ff0000"`
- **THEN** the color swatch SHALL show red and display `"#ff0000"`

#### Scenario: Color renderer calls onChange on pick
- **WHEN** the user selects a color in the color picker
- **THEN** `onChange(newHex)` SHALL be called

### Requirement: Single onChange callback
Each renderer SHALL use a single `onChange?: (value: unknown) => void` callback for all mutations, replacing the previous `writePrimitiveValue`, `replaceFieldValue`, and `initializeArrayValue` props.

#### Scenario: onChange with value replaces field
- **WHEN** `onChange("newVal")` is called
- **THEN** the HJSON field SHALL be patched with `"newVal"`

#### Scenario: onChange with undefined removes field
- **WHEN** `onChange(undefined)` is called
- **THEN** the field SHALL be removed from the HJSON document

#### Scenario: onChange with schema default removes field
- **WHEN** `onChange` is called with a value equal to the schema's default
- **THEN** the field SHALL be removed (no redundant data)

## MODIFIED Requirements

### Requirement: String renderer
The system SHALL render a `v.string()` field as an `<Input>` text field, receiving the value directly instead of an HjsonNode.

#### Scenario: String value displayed
- **WHEN** the value is a string
- **THEN** the input SHALL display the string value

#### Scenario: String value changed
- **WHEN** the user types in the input
- **THEN** `onChange(newValue)` SHALL be called with the new string value

### Requirement: Number renderer
The system SHALL render a `v.number()` field as an `<Input type="number">` field, receiving the value directly.

#### Scenario: Number value displayed
- **WHEN** the value is a number
- **THEN** the input SHALL display the number value

#### Scenario: Number value changed
- **WHEN** the user types in the number input
- **THEN** `onChange(newValue)` SHALL be called with the new numeric value

### Requirement: Boolean renderer
The system SHALL render a `v.boolean()` field as a `<Checkbox>`, receiving the boolean value directly.

#### Scenario: Boolean checked
- **WHEN** the value is `true`
- **THEN** the checkbox SHALL be checked

#### Scenario: Boolean unchecked
- **WHEN** the value is `false`
- **THEN** the checkbox SHALL be unchecked

#### Scenario: Boolean toggled
- **WHEN** the user clicks the checkbox
- **THEN** `onChange(newValue)` SHALL be called with the new boolean value

### Requirement: Hex color renderer
The system SHALL render a `MindustryHexColorSchema` field as a color picker with preview swatch, receiving the hex string directly.

#### Scenario: Color value displayed
- **WHEN** the value is a string matching a hex color (e.g. `"ff0000"`)
- **THEN** the color swatch SHALL show the color and the hex value text SHALL be displayed

#### Scenario: Color changed via picker
- **WHEN** the user selects a new color in the color picker
- **THEN** `onChange(newHex)` SHALL be called with the new hex color string

### Requirement: Research renderer
The system SHALL render a `ResearchSchema` field, receiving the value directly (string or object).

#### Scenario: Research as string value
- **WHEN** the value is a string (parent name only)
- **THEN** the parent input SHALL show the string and no requirements list

#### Scenario: Research as object value
- **WHEN** the value is an object with `parent` and `requirements`
- **THEN** the parent input SHALL show the parent value and the requirements list SHALL be rendered

#### Scenario: Add requirement
- **WHEN** the user clicks the Add button
- **THEN** a new requirement row SHALL be added

#### Scenario: Remove requirement
- **WHEN** the user clicks the Remove button on a requirement row
- **THEN** the requirement SHALL be removed

### Requirement: Array renderer
The system SHALL render a `v.array()` field, receiving the array of raw values as `value`.

#### Scenario: Empty array
- **WHEN** the array is empty
- **THEN** no items SHALL be displayed

#### Scenario: Array items rendered
- **WHEN** the array has items
- **THEN** each item SHALL be rendered using the array's element schema type with its raw value

#### Scenario: Add item
- **WHEN** the user clicks Add
- **THEN** a new element SHALL be inserted with a default value

#### Scenario: Remove item
- **WHEN** the user clicks Remove on an item
- **THEN** the element SHALL be removed from the HJSON array

### Requirement: Object renderer
The system SHALL render a `v.object()` field as a nested group, receiving the plain object as `value`.

#### Scenario: Nested object rendered
- **WHEN** an object field contains sub-fields
- **THEN** each sub-field SHALL be rendered with its own schema-derived renderer, indented with a left border
