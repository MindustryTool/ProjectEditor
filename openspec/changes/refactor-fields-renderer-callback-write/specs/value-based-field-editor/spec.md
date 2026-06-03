## ADDED Requirements

### Requirement: SchemaRenderer receives value prop instead of node
The `SchemaRenderer` component type SHALL receive a `value` prop containing the raw deserialized value instead of a `node: HjsonNode` prop.

#### Scenario: value prop is the raw primitive
- **WHEN** a string field renders
- **THEN** `value` SHALL be the actual string (e.g. `"hello"`), not an `HjsonValueNode`

#### Scenario: value prop for number field
- **WHEN** a number field renders
- **THEN** `value` SHALL be the actual number (e.g. `42`), not an `HjsonValueNode`

#### Scenario: value prop for boolean field
- **WHEN** a boolean field renders
- **THEN** `value` SHALL be the actual boolean (`true` or `false`)

#### Scenario: value prop for object fields
- **WHEN** an object field renders
- **THEN** `value` SHALL be the plain JavaScript object (result of `node.valueOf()`)

#### Scenario: value prop for array fields
- **WHEN** an array field renders
- **THEN** `value` SHALL be the array of raw values (result of `node.elements().map(el => el.value)`)

### Requirement: Single onChange callback replaces multiple write helpers
The `SchemaRenderer` type SHALL expose a single `onChange?: (value: unknown) => void` callback that replaces `writePrimitiveValue`, `replaceFieldValue`, and `initializeArrayValue`.

#### Scenario: onChange with string value sets field
- **WHEN** `onChange("newValue")` is called on a string field
- **THEN** the HJSON field SHALL be patched with the new string value

#### Scenario: onChange with undefined removes field
- **WHEN** `onChange(undefined)` is called
- **THEN** the field SHALL be removed from the HJSON document

#### Scenario: onChange with null sets null
- **WHEN** `onChange(null)` is called
- **THEN** the field SHALL be set to `null` in the HJSON document

#### Scenario: onChange with default value removes field
- **WHEN** `onChange` is called with a value equal to the schema default
- **THEN** the field SHALL be removed from the HJSON document

### Requirement: Leaf renderers no longer receive original or onPatch props
The `original` and `onPatch` props SHALL be removed from the `SchemaRenderer` type. These are handled internally by the `onChange` implementation.

#### Scenario: original and onPatch absent
- **WHEN** a leaf renderer (e.g. `StringField`) receives its props
- **THEN** `original` and `onPatch` SHALL be `undefined` (not passed)

#### Scenario: ArrayField and ObjectField still receive onPatch
- **WHEN** `ArrayField` or `ObjectField` renders
- **THEN** they SHALL still receive `original` and `onPatch` for surgical patching of child fields
