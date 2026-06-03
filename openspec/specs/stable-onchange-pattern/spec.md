## Requirements

### Requirement: onChange is identity-stable
The `onChange` function passed to renderers SHALL maintain a stable identity across renders (never changes reference).

#### Scenario: onChange identity is constant
- **WHEN** a FieldsRenderer re-renders
- **THEN** the `onChange` function reference SHALL remain the same as the previous render

#### Scenario: onChange calls latest write
- **WHEN** `onChange` is invoked
- **THEN** it SHALL call the most current `write` function from `useFileString`

### Requirement: onChange navigates to parent
`onChange` SHALL navigate to the parent node of `jsonPath` and pass `(parent, key, original, root)` to the updater, not the value node and `original` only.

#### Scenario: onChange passes parent and key
- **WHEN** `onChange("items[0].name", updater)` is called
- **THEN** the updater SHALL receive the parent node at `items[0]`, key `"name"`, and the original source string

#### Scenario: onChange passes root for removal
- **WHEN** `onChange("health", updater)` is called where updater calls `removeByJsonPath`
- **THEN** the parent SHALL be the root `HjsonObjectNode` and key SHALL be `"health"`
