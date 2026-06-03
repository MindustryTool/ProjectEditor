## MODIFIED Requirements

### Requirement: Renderer receives value prop instead of HjsonNode
The schema renderer functions SHALL receive the actual deserialized value as `value` prop instead of an `HjsonNode` as `node` prop. Renderers SHALL NOT receive `original` or `onPatch` props.

#### Scenario: String renderer displays value
- **WHEN** the value is a string `"hello"`
- **THEN** the input SHALL display `"hello"`

#### Scenario: String renderer calls onChange on edit
- **WHEN** the user types in the input
- **THEN** `onChange(jsonPath, updater)` SHALL be called with the `jsonPath` prop and an updater that patches the value

#### Scenario: Number renderer displays value
- **WHEN** the value is `42`
- **THEN** the input SHALL display `42`

#### Scenario: Number renderer calls onChange on edit
- **WHEN** the user types in the number input
- **THEN** `onChange(jsonPath, updater)` SHALL be called

#### Scenario: Boolean renderer reflects value
- **WHEN** the value is `true`
- **THEN** the checkbox SHALL be checked

#### Scenario: Boolean renderer calls onChange on toggle
- **WHEN** the user clicks the checkbox
- **THEN** `onChange(jsonPath, updater)` SHALL be called

#### Scenario: Color renderer displays hex value
- **WHEN** the value is `"ff0000"`
- **THEN** the color swatch SHALL show red and display `"#ff0000"`

#### Scenario: Color renderer calls onChange on pick
- **WHEN** the user selects a color in the color picker
- **THEN** `onChange(jsonPath, updater)` SHALL be called

### Requirement: Single onChange callback with updater pattern
Each renderer SHALL use a single `onChange?: (jsonPath: string, updater: (node: HjsonNode, original: string) => string | undefined) => void` callback for all mutations, replacing the previous `onChange?: (value: unknown) => void` signature.

#### Scenario: onChange with string updater patches value
- **WHEN** `onChange(jsonPath, (node, original) => (node as HjsonValueNode).patchValue(original, HJSON.stringify("newVal")))` is called
- **THEN** the HJSON field at `jsonPath` SHALL be patched with `"newVal"`

#### Scenario: onChange with undefined updater removes field
- **WHEN** `onChange(jsonPath, (node, original) => undefined)` is called
- **THEN** the field at `jsonPath` SHALL be removed from the HJSON document

#### Scenario: onChange with undefined when value equals default
- **WHEN** `onChange` is called with an updater returning `undefined` AND the serialized value equals the schema's default AND the schema is non-nullable
- **THEN** the field SHALL be removed (no redundant data)

### Requirement: Leaf renderer uses patchValue pattern
Leaf renderers (string, number, boolean, hex-color, picklist, liquids) SHALL use the uniform pattern `(node as HjsonValueNode).patchValue(original, HJSON.stringify(newValue))` in their updater callbacks.

#### Scenario: String renderer updater
- **WHEN** the user types a new string value
- **THEN** the updater SHALL call `(node as HjsonValueNode).patchValue(original, HJSON.stringify(newValue))`

#### Scenario: Number renderer updater
- **WHEN** the user types a new number value
- **THEN** the updater SHALL call `(node as HjsonValueNode).patchValue(original, HJSON.stringify(newValue))`

## REMOVED Requirements

### Requirement: Renderers have original/onPatch props
**Reason**: Replaced by `onChange(jsonPath, updater)` which encapsulates all mutation logic. Renderers no longer need direct access to the source string or write callback.
**Migration**: Use `onChange(jsonPath, (node, original) => ...)` pattern instead.
