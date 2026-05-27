## ADDED Requirements

### Requirement: Dedicated structured parsing API
The HJSON library SHALL provide dedicated functions `parseStructured` and `parseStructuredAsync` that return a structured representation of the HJSON input, including positional metadata, without requiring manual configuration of the `structured` option flag.

#### Scenario: Parse to structured nodes
- **WHEN** `HJSON.parseStructured(text)` is called
- **THEN** it SHALL return a `StructuredNode` representing the root of the document
- **AND** the result SHALL include metadata for keys and values (start/end positions)

### Requirement: Unified Structured Node API
The `StructuredNode` interface SHALL provide a unified way to access objects, arrays, and primitive values, similar to Jackson's `JsonNode`.

#### Scenario: Object access
- **WHEN** a `StructuredNode` represents an object
- **THEN** it SHALL provide a `get(key)` method to retrieve a child node by key
- **AND** it SHALL provide an `entries()` method to iterate over key-node pairs

#### Scenario: Array access
- **WHEN** a `StructuredNode` represents an array
- **THEN** it SHALL provide an `at(index)` method to retrieve a child node by index
- **AND** it SHALL provide an `elements()` method to iterate over its elements

### Requirement: Type-Safe Conversion and Checking
`StructuredNode` SHALL provide methods to check the type of the underlying data and convert it to primitive types safely.

#### Scenario: Type checking
- **WHEN** `node.isObject()`, `node.isArray()`, `node.isString()`, etc., are called
- **THEN** they SHALL return `true` if the node matches the type, and `false` otherwise

#### Scenario: Safe conversion
- **WHEN** `node.asString()`, `node.asNumber()`, `node.asBoolean()`, etc., are called
- **THEN** they SHALL return the underlying value if the type matches
- **AND** they SHALL return a default value or `undefined` if the type does not match

### Requirement: Chaining and Path Access
`StructuredNode` SHALL support chaining access to nested elements with minimal boilerplate.

#### Scenario: Chained get
- **WHEN** `node.get("foo").get("bar").asString()` is called
- **THEN** it SHALL return the string value of the nested property if it exists
- **AND** it SHALL return a "missing node" or `undefined` gracefully if any part of the path does not exist
