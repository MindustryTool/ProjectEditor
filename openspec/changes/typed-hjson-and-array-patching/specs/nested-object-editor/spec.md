## ADDED Requirements

### Requirement: FieldTypes includes Object type mapped to HjsonObjectNode
`FieldTypes` in `FieldRenderer.tsx` SHALL include an `Object` type mapping to `HjsonObjectNode`.

#### Scenario: Object type defined in FieldTypes
- **WHEN** a field with `type: "Object"` is declared
- **THEN** the system SHALL render a nested object editor UI for that field

### Requirement: Object field renders sub-fields from HjsonObjectNode.fields()
When a field has `type: "Object"`, the renderer SHALL iterate `objectNode.fields()` to display each property as a sub-field with its `FieldInfo` metadata.

#### Scenario: Object field renders nested properties
- **WHEN** a field has `type: "Object"` and the `HjsonObjectNode` has fields "a" (number) and "b" (string)
- **THEN** the renderer SHALL display two sub-fields labeled "a" and "b"
- **AND** the "a" sub-field SHALL render as a number input using its `HjsonValueNode<number>`
- **AND** the "b" sub-field SHALL render as a text input using its `HjsonValueNode<string>`

### Requirement: Object field uses path-qualified patch key for nested values
When a nested property changes, the renderer SHALL construct the full dot-path key (`parentField.childField`) and call `objectNode.patchField()` on the root object for surgical patching.

#### Scenario: Nested property change patches via dot-path
- **WHEN** property "b" of field "config" changes
- **THEN** the renderer SHALL call `rootObjectNode.patchField(original, "config.b", newValue)`
- **AND** only the modified property value SHALL be replaced in the source string

### Requirement: Object field supports recursive rendering
An Object field may contain nested Arrays or Objects, and the renderer SHALL use type guards (`isObject()`, `isArray()`, `isString()`, etc.) to determine how to render each sub-field recursively.

#### Scenario: Nested object with array property
- **WHEN** `objectNode.get("items").isArray()` returns `true`
- **THEN** the "items" property SHALL render using the Array field editor with the `HjsonArrayNode`
- **AND** modifications to the array SHALL patch the source via `patchField` at `"parent.items"`

#### Scenario: Nested object with sub-object property
- **WHEN** `objectNode.get("config").isObject()` returns `true`
- **THEN** the "config" property SHALL render using the Object field editor with the `HjsonObjectNode`
- **AND** further nested changes SHALL extend the dot-path recursively
