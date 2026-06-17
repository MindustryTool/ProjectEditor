## ADDED Requirements

### Requirement: NameContext provides content name to field renderers
The system SHALL provide a React context (`NameContext`) that supplies the content's `name` property (from `activeValues['name']`) to all field renderer components in the rendering tree.

#### Scenario: Context provides name from activeValues
- **WHEN** `activeValues['name']` is `"copper-wall"`
- **THEN** the context value SHALL be `{ name: "copper-wall" }`

#### Scenario: Context defaults to empty string when name is missing
- **WHEN** `activeValues` does not contain a `name` property
- **THEN** the context value SHALL be `{ name: "" }`

#### Scenario: Wraps FieldsRenderer children
- **WHEN** FieldsRenderer renders its field components
- **THEN** they SHALL be wrapped in a `NameContext.Provider`

### Requirement: TextureField uses NameContext instead of path parsing
TextureField SHALL use the `useNameContext()` hook to get the content name, replacing the current `path.split("/").pop().split(".")[0]` logic for texture path construction.

#### Scenario: TextureField reads name from context
- **WHEN** TextureField renders with context value `{ name: "copper-wall" }` and schema format `"@"`
- **THEN** the constructed sprite path SHALL use `"copper-wall"` instead of the parsed filename

#### Scenario: TextureField renders null when name is empty and format is "$"
- **WHEN** context name is `""` and schema format is `"$"`
- **THEN** TextureField SHALL render `null`

### Requirement: TexturesField uses NameContext instead of path parsing
TexturesField SHALL use the `useNameContext()` hook to get the content name, replacing the current `path.split("/").pop().split(".")[0]` logic for texture path construction.

#### Scenario: TexturesField reads name from context
- **WHEN** TexturesField renders with context value `{ name: "my-unit" }` and schema format `"@"`
- **THEN** the constructed sprite paths SHALL use `"my-unit"` instead of the parsed filename

#### Scenario: TexturesField handles empty name gracefully
- **WHEN** context name is `""`
- **THEN** TexturesField SHALL still render with empty sprite names (no crash)
