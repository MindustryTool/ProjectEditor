## ADDED Requirements

### Requirement: onChange is identity-stable
The `onChange` function passed to renderers SHALL maintain a stable identity across renders (never changes reference).

#### Scenario: onChange identity is constant
- **WHEN** a FieldsRenderer re-renders
- **THEN** the `onChange` function reference SHALL remain the same as the previous render

#### Scenario: onChange calls latest write
- **WHEN** `onChange` is invoked
- **THEN** it SHALL call the most current `write` function from `useFileString`, even if `write` changed between renders

### Requirement: onChange signature
`onChange` SHALL have the signature `(jsonPath: string, updater: (node: HjsonNode, original: string) => string | undefined) => void`.

#### Scenario: onChange with string updater
- **WHEN** `onChange("health", (node, original) => (node as HjsonValueNode).patchValue(original, "100"))` is called
- **THEN** the file content SHALL be updated with the value at the path replaced

#### Scenario: onChange with undefined updater removes field
- **WHEN** `onChange("health", (node, original) => undefined)` is called
- **THEN** the field at path `"health"` SHALL be removed from the source content

#### Scenario: onChange navigates nested path
- **WHEN** `onChange("items[0].name", updater)` is called
- **THEN** the updater SHALL receive the `HjsonNode` at `items[0].name` and the original source string

### Requirement: Removal extracts parent from jsonPath
When the updater returns `undefined`, the system SHALL extract the parent path and field name from `jsonPath` to call `removeField`/`removeElement` on the parent node.

#### Scenario: Top-level field removal
- **WHEN** `jsonPath` is `"health"` and updater returns `undefined`
- **THEN** the system SHALL call `rootObjectNode.removeField(original, "health")`

#### Scenario: Nested field removal
- **WHEN** `jsonPath` is `"items[0].name"` and updater returns `undefined`
- **THEN** the system SHALL navigate to `root.path("items[0]")` and call `parentNode.removeField(original, "name")`

#### Scenario: Array element removal via undefined
- **WHEN** `jsonPath` is `"items[2]"` and updater returns `undefined`
- **THEN** the system SHALL navigate to `root.path("items")` and call `arrayNode.removeElement(original, 2)`
