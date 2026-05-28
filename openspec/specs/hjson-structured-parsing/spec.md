## ADDED Requirements

### Requirement: Dedicated structured parsing API
The HJSON library SHALL provide dedicated functions `parseStructured` and `parseStructuredAsync` that return a structured representation of the HJSON input, including positional metadata, without requiring manual configuration of the `structured` option flag.

#### Scenario: Parse to structured nodes
- **WHEN** `HJSON.parseStructured(text)` is called
- **THEN** it SHALL return a `HjsonNode` representing the root of the document
- **AND** the result SHALL include metadata for keys and values (start/end positions)

### Requirement: Unified Structured Node API
The `HjsonNode` interface SHALL provide a unified way to access objects, arrays, and primitive values, similar to Jackson's `JsonNode`.

#### Scenario: Object access
- **WHEN** a `HjsonNode` represents an object
- **THEN** it SHALL provide a `get(key)` method to retrieve a child node by key (string)
- **AND** it SHALL provide a `get(index)` method to retrieve a child node by numeric index (returns `HjsonMissingNode`)
- **AND** it SHALL provide an `entries()` method to iterate over key-node pairs
- **AND** it SHALL provide an `at(key)` method to retrieve child `FieldInfo` by key
- **AND** it SHALL provide a `path(pathStr)` method to retrieve `FieldInfo | ElementInfo | undefined` for a field by dot-path syntax

#### Scenario: Array access
- **WHEN** a `HjsonNode` represents an array
- **THEN** it SHALL provide a `get(index)` method to retrieve a child `HjsonNode` by numeric index
- **AND** it SHALL provide an `at(index)` method to retrieve child `ElementInfo` by index
- **AND** it SHALL provide an `elements()` method to iterate over its elements
- **AND** it SHALL provide a `path(pathStr)` method to retrieve `FieldInfo | ElementInfo | undefined` for an element by dot-path syntax

### Requirement: Type-Safe Conversion and Checking
`HjsonNode` SHALL provide methods to check the type of the underlying data and convert it to primitive types safely.

#### Scenario: Type checking
- **WHEN** `node.isObject()`, `node.isArray()`, `node.isString()`, etc., are called
- **THEN** they SHALL return `true` if the node matches the type, and `false` otherwise

#### Scenario: Safe conversion
- **WHEN** `node.asString()`, `node.asNumber()`, `node.asBoolean()`, etc., are called
- **THEN** they SHALL return the underlying value if the type matches
- **AND** they SHALL return a default value or `undefined` if the type does not match

### Requirement: Unified field/element access via at()

`HjsonNode.at()` SHALL accept both `string` and `number` arguments — `at(string)` returns positional metadata for an object field, `at(number)` returns positional metadata for an array element.

#### Scenario: Access object field info by name via at()
- **WHEN** `at("fieldName")` is called on a `HjsonNode` representing an object
- **THEN** it SHALL return the `FieldInfo` for that field
- **AND** it SHALL return `undefined` if the field does not exist

#### Scenario: Access array element info by index via at()
- **WHEN** `at(0)` is called on a `HjsonNode` representing an array
- **THEN** it SHALL return the `ElementInfo` for that index
- **AND** it SHALL return `undefined` if the index is out of bounds

#### Scenario: at() with wrong argument type returns undefined
- **WHEN** `at(number)` is called on an object node or `at(string)` on an array node
- **THEN** it SHALL return `undefined`

### Requirement: Shared base interface for position metadata

A base interface (`InfoBase`) SHALL be provided with `start: Position` and `end: Position` that both `FieldInfo` and `ElementInfo` extend.

#### Scenario: FieldInfo extends InfoBase
- **WHEN** inspecting a `FieldInfo` object
- **THEN** it SHALL satisfy the `InfoBase` contract with `start` and `end` properties

#### Scenario: ElementInfo extends InfoBase
- **WHEN** inspecting an `ElementInfo` object
- **THEN** it SHALL satisfy the `InfoBase` contract with `start` and `end` properties

### Requirement: info() method on all node types

`HjsonNode` SHALL provide an `info()` method returning `InfoBase | undefined`, giving uniform access to positional metadata for the node regardless of its concrete type.

#### Scenario: info() returns positions when available
- **WHEN** `info()` is called on any parsed `HjsonNode`
- **THEN** it SHALL return an `InfoBase` with `start` and `end` reflecting the node's position in the source

#### Scenario: info() returns undefined when no position stored
- **WHEN** `info()` is called on a node constructed without position data
- **THEN** it SHALL return `undefined`

### Requirement: Chaining and Path Access
`HjsonNode` SHALL support chaining access to nested elements with the `path()` method or chained `get()` calls.

#### Scenario: Chained get
- **WHEN** `node.get("foo").get("bar").asString()` is called
- **THEN** it SHALL return the string value of the nested property if it exists
- **AND** it SHALL return a "missing node" or `undefined` gracefully if any part of the path does not exist

#### Scenario: Path access
- **WHEN** `node.path("foo.bar[0].baz")` is called
- **THEN** it SHALL return the `FieldInfo` or `ElementInfo` for the final segment
- **AND** it SHALL return `undefined` if any part of the path does not exist
- **AND** the returned info SHALL have a `.value` property containing the target node
