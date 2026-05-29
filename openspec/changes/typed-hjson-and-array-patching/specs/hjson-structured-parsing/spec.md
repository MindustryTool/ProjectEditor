## MODIFIED Requirements

### Requirement: Unified Structured Node API
The `HjsonNode` interface SHALL provide a unified way to access objects, arrays, and primitive values. `FieldInfo` and `ElementInfo` SHALL accept a type parameter `T` defaulting to `unknown` to type their `value` property.

#### Scenario: Object access
- **WHEN** a `HjsonNode` represents an object
- **THEN** it SHALL provide a `get(key)` method to retrieve a child node by key (string)
- **AND** it SHALL provide a `get(index)` method to retrieve a child node by numeric index (returns `HjsonMissingNode`)
- **AND** it SHALL provide an `entries()` method to iterate over key-node pairs
- **AND** it SHALL provide an `at(key)` method to retrieve child `FieldInfo` by key
- **AND** it SHALL provide a `path(pathStr)` method to retrieve `FieldInfo<string | number | boolean | null | unknown> | ElementInfo<unknown> | undefined` for a field by dot-path syntax

#### Scenario: Array access
- **WHEN** a `HjsonNode` represents an array
- **THEN** it SHALL provide a `get(index)` method to retrieve a child `HjsonNode` by numeric index
- **AND** it SHALL provide an `at(index)` method to retrieve child `ElementInfo` by index
- **AND** it SHALL provide an `elements()` method to iterate over its elements
- **AND** it SHALL provide a `path(pathStr)` method to retrieve `FieldInfo<unknown> | ElementInfo<unknown> | undefined` for an element by dot-path syntax

### Requirement: Type-Safe Conversion and Checking with type guards
`HjsonNode` SHALL provide methods to check the type of the underlying data and convert it to primitive types safely. `HjsonValueNode` SHALL be generic over its value type. Type guard methods (`isString`, `isNumber`, `isBoolean`) SHALL narrow the TypeScript type to the corresponding `HjsonValueNode<T>`.

#### Scenario: Type checking with guards
- **WHEN** `node.isObject()`, `node.isArray()`, `node.isString()`, etc., are called
- **THEN** they SHALL return `true` if the node matches the type, and `false` otherwise
- **AND** they SHALL narrow the TypeScript type via `this is ...` return type

#### Scenario: Safe conversion
- **WHEN** `node.asString()`, `node.asNumber()`, `node.asBoolean()`, etc., are called
- **THEN** they SHALL return the underlying value if the type matches
- **AND** they SHALL return a default value or `undefined` if the type does not match

#### Scenario: Generic asValue
- **WHEN** `node.asValue<T>()` is called on a `HjsonValueNode`
- **THEN** the return type SHALL be `T | undefined`

#### Scenario: isString narrows to HjsonValueNode<string>
- **WHEN** `node.isString()` returns `true`
- **THEN** TypeScript SHALL narrow the node to `HjsonValueNode<string>`
- **AND** `node.valueOf()` SHALL be typed as `string`

### Requirement: HjsonResult<T> resolves to typed node
The `HjsonResult<T>` conditional type SHALL resolve to nodes with appropriate value types.

#### Scenario: HjsonResult resolves for object type
- **WHEN** `T extends Record<string, unknown>`
- **THEN** `HjsonResult<T>` SHALL resolve to `HjsonObjectNode`

#### Scenario: HjsonResult resolves for array type
- **WHEN** `T extends unknown[]`
- **THEN** `HjsonResult<T>` SHALL resolve to `HjsonArrayNode`

#### Scenario: HjsonResult resolves for primitive type
- **WHEN** `T` is a primitive type
- **THEN** `HjsonResult<T>` SHALL resolve to `HjsonValueNode<T>`

### Requirement: FieldInfo and ElementInfo are generic
`FieldInfo<T>` and `ElementInfo<T>` SHALL use type parameter `T` for their `value` property, defaulting to `unknown`.

#### Scenario: FieldInfo typed value access
- **WHEN** inspecting a `FieldInfo<string>`
- **THEN** `value` SHALL be typed as `string`

#### Scenario: ElementInfo typed value access
- **WHEN** inspecting an `ElementInfo<number>`
- **THEN** `value` SHALL be typed as `number`
