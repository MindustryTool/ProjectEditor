## ADDED Requirements

### Requirement: Schema wrapper stripping
The system SHALL provide a function that recursively strips valibot wrapper types (`v.nullish()`, `v.optional()`, `v.nullable()`) to reveal the inner schema for type detection.

#### Scenario: Strips nullish wrapper
- **WHEN** `v.nullish(v.string())` is passed
- **THEN** the inner schema SHALL be `v.string()`

#### Scenario: Strips nested wrappers
- **WHEN** `v.optional(v.nullable(v.number()))` is passed
- **THEN** the inner schema SHALL be `v.number()`

#### Scenario: Non-wrapper schema returns itself
- **WHEN** `v.string()` is passed
- **THEN** the same schema SHALL be returned unchanged

### Requirement: Schema type detection
The system SHALL detect the renderer type from a valibot schema by inspecting its structure.

#### Scenario: String detection
- **WHEN** a `v.string()` schema is detected
- **THEN** the renderer type SHALL be `"string"`

#### Scenario: Number detection
- **WHEN** a `v.number()` schema (including `v.pipe(v.number(), ...)`) is detected
- **THEN** the renderer type SHALL be `"number"`

#### Scenario: Boolean detection
- **WHEN** a `v.boolean()` schema is detected
- **THEN** the renderer type SHALL be `"boolean"`

#### Scenario: Hex color detection by identity
- **WHEN** the schema is `MindustryHexColorSchema` by reference identity
- **THEN** the renderer type SHALL be `"hex-color"`

#### Scenario: Research detection by identity
- **WHEN** the schema is `ResearchSchema` by reference identity
- **THEN** the renderer type SHALL be `"research"`

#### Scenario: Array detection
- **WHEN** a `v.array(...)` schema is detected
- **THEN** the renderer type SHALL be `"array"`

#### Scenario: Object detection
- **WHEN** a `v.object(...)` schema is detected
- **THEN** the renderer type SHALL be `"object"`

#### Scenario: Unknown schema fallback
- **WHEN** a schema does not match any known type
- **THEN** the renderer type SHALL be `"unknown"`

### Requirement: String renderer
The system SHALL render a `v.string()` field as an `<Input>` text field.

#### Scenario: String value displayed
- **WHEN** the HJSON node is a string value
- **THEN** the input SHALL display the string value

#### Scenario: String value changed
- **WHEN** the user types in the input
- **THEN** the HJSON field SHALL be patched with the new string value

### Requirement: Number renderer
The system SHALL render a `v.number()` field as an `<Input type="number">` field, replacing the previous Int/Float/Double renderers.

#### Scenario: Number value displayed
- **WHEN** the HJSON node is a number value
- **THEN** the input SHALL display the number value

#### Scenario: Number value changed
- **WHEN** the user types in the number input
- **THEN** the HJSON field SHALL be patched with the new numeric value

### Requirement: Boolean renderer
The system SHALL render a `v.boolean()` field as a `<Checkbox>`.

#### Scenario: Boolean checked
- **WHEN** the HJSON node is `true`
- **THEN** the checkbox SHALL be checked

#### Scenario: Boolean unchecked
- **WHEN** the HJSON node is `false`
- **THEN** the checkbox SHALL be unchecked

#### Scenario: Boolean toggled
- **WHEN** the user clicks the checkbox
- **THEN** the HJSON field SHALL be patched with the new boolean value

### Requirement: Hex color renderer
The system SHALL render a `MindustryHexColorSchema` field as a color picker with preview swatch.

#### Scenario: Color value displayed
- **WHEN** the HJSON node is a string matching a hex color
- **THEN** the color swatch SHALL show the color and the hex value text SHALL be displayed

#### Scenario: Color changed via picker
- **WHEN** the user selects a new color in the color picker
- **THEN** the HJSON field SHALL be patched with the new hex color string

### Requirement: Research renderer
The system SHALL render a `ResearchSchema` field as a parent name input with a list of requirements, matching the current Research renderer behavior.

#### Scenario: Research as string value
- **WHEN** the HJSON value is a string (parent name only)
- **THEN** the parent input SHALL show the string and no requirements list

#### Scenario: Research as object value
- **WHEN** the HJSON value is an object with `parent` and `requirements`
- **THEN** the parent input SHALL show the parent value and the requirements list SHALL be rendered

#### Scenario: Add requirement
- **WHEN** the user clicks the Add button
- **THEN** a new requirement row SHALL be added with an item picker dialog and a numeric level input

#### Scenario: Remove requirement
- **WHEN** the user clicks the Remove button on a requirement row
- **THEN** the requirement SHALL be removed and the HJSON patched

### Requirement: Array renderer
The system SHALL render a `v.array()` field as a list of items with add/remove controls.

#### Scenario: Empty array
- **WHEN** the array is empty
- **THEN** an "(empty)" indicator SHALL be displayed

#### Scenario: Array items rendered
- **WHEN** the array has items
- **THEN** each item SHALL be rendered using the array's element schema type

#### Scenario: Add item
- **WHEN** the user clicks Add
- **THEN** a new element SHALL be inserted with a default value matching the element schema

#### Scenario: Remove item
- **WHEN** the user clicks Remove on an item
- **THEN** the element SHALL be removed from the HJSON array

### Requirement: Object renderer
The system SHALL render a `v.object()` field as a nested group with indentation, recursively rendering each child field with its own schema-derived renderer.

#### Scenario: Nested object rendered
- **WHEN** an object field contains sub-fields
- **THEN** each sub-field SHALL be rendered with its own schema-derived renderer, indented with a left border

### Requirement: Unknown type fallback
The system SHALL render an unrecognized schema type as a warning message.

#### Scenario: Unknown type shown
- **WHEN** a field's schema type cannot be determined
- **THEN** a yellow warning text SHALL display "Unknown field type"

### Requirement: Conditional field visibility from visibleWhen metadata
The system SHALL conditionally render fields based on `visibleWhen` metadata attached to the field schema.

#### Scenario: Field hidden when condition not met
- **WHEN** a field has `visibleWhen: { field: "toggle", value: true }` metadata and the referenced field `toggle` has value `false`
- **THEN** the field SHALL NOT be rendered

#### Scenario: Field shown when condition is met
- **WHEN** a field has `visibleWhen: { field: "toggle", value: true }` metadata and the referenced field `toggle` has value `true`
- **THEN** the field SHALL be rendered

#### Scenario: Field shown when referenced field is missing
- **WHEN** a field has `visibleWhen: { field: "missingField", value: true }` metadata and the referenced field does not exist in the HJSON node
- **THEN** the field SHALL NOT be rendered (fail closed)

#### Scenario: Field rendered normally when no metadata
- **WHEN** a field has no `visibleWhen` metadata
- **THEN** the field SHALL always be rendered
