## Purpose
Provide structured HJSON parsing APIs with source positions, typed node access, and tolerant formatter-facing parsing support for incomplete or recoverably invalid input.

## Requirements

### Requirement: Dedicated structured parsing API
The HJSON library SHALL provide dedicated functions `parseStructured` and `parseStructuredAsync` that return a structured representation of the HJSON input, including positional metadata, without requiring manual configuration of the `structured` option flag.

#### Scenario: Parse to structured nodes
- **WHEN** `HJSON.parseStructured(text)` is called
- **THEN** it SHALL return a `HjsonNode` representing the root of the document
- **AND** the result SHALL include metadata for keys and values (start/end positions)

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

### Requirement: ElementInfo extends InfoBase with replaceValue
`ElementInfo` SHALL include a `replaceValue(original: string, newValue: string): string` method that replaces the element's value in the original source string using positional slicing.

#### Scenario: Replace array element value
- **WHEN** `elementInfo.replaceValue(original, '"new-value"')` is called
- **THEN** it SHALL return `original` with the element's value range replaced by `"new-value"`
- **AND** the replacement SHALL be based on `valueStart.index` and `valueEnd.index`

### Requirement: HjsonArrayNode provides element mutation methods
`HjsonArrayNode` SHALL provide `patchElement`, `insertElement`, and `removeElement` methods for surgically modifying array elements in the original source string.

#### Scenario: patchElement replaces element value by index
- **WHEN** `arrayNode.patchElement(original, 0, '"replaced"')` is called
- **THEN** it SHALL return the source string with the element at index 0 replaced

#### Scenario: removeElement removes element by index with comma cleanup
- **WHEN** `arrayNode.removeElement(original, 0)` is called
- **THEN** it SHALL return the source string with the element and its surrounding comma removed

### Requirement: HjsonObjectNode and HjsonArrayNode provide comment patching
`HjsonObjectNode` and `HjsonArrayNode` SHALL provide methods to patch, insert, and remove comments associated with fields or elements.

#### Scenario: Patch comment before a field
- **WHEN** `objectNode.patchComment(original, "name", "# new comment")` is called
- **THEN** the comment before the `name` field SHALL be replaced

#### Scenario: Add comment before a field that has no comment
- **WHEN** `objectNode.patchComment(original, "name", "# added comment")` is called on a field without a preceding comment
- **THEN** the comment SHALL be inserted before the field

### Requirement: HJSONError uses startLine/startColumn/endLine/endColumn
`HJSONError` SHALL expose `startLine`, `startColumn`, `endLine`, and `endColumn` as readonly number properties. The `row` and `col` properties SHALL NOT exist on `HJSONError`. When `endLine` and `endColumn` are not provided to the constructor, they SHALL default to `startLine` and `startColumn`.

#### Scenario: Error created with explicit positions
- **WHEN** `new HJSONError(code, { startLine: 1, startColumn: 6, endLine: 1, endColumn: 14, index: 5, inputFragment: "..." })` is constructed
- **THEN** `err.startLine` SHALL be `1`
- **THEN** `err.startColumn` SHALL be `6`
- **THEN** `err.endLine` SHALL be `1`
- **THEN** `err.endColumn` SHALL be `14`

#### Scenario: Error created without end positions defaults to start
- **WHEN** `new HJSONError(code, { startLine: 2, startColumn: 3, index: 10, inputFragment: "..." })` is constructed (no endLine/endColumn)
- **THEN** `err.endLine` SHALL be `2` (defaults to startLine)
- **THEN** `err.endColumn` SHALL be `3` (defaults to startColumn)

#### Scenario: row and col are not properties
- **WHEN** accessing `err.row` on an HJSONError instance
- **THEN** the value SHALL be `undefined`

#### Scenario: index is preserved
- **WHEN** `new HJSONError(code, { startLine: 1, startColumn: 5, index: 4, inputFragment: "..." })` is constructed
- **THEN** `err.index` SHALL be `4`

### Requirement: Error message format
The `HJSONError.message` string SHALL include `startLine:startColumn` in its formatted message, replacing the former `row:col` format.

#### Scenario: Message includes startLine:startColumn
- **WHEN** `new HJSONError(HJSONErrorCode.UnexpectedToken, { startLine: 3, startColumn: 10, index: 42, inputFragment: "@bad" })` is constructed
- **THEN** `err.message` SHALL include the substring `"3:10"` to indicate the error position

### Requirement: Tokenizer error method uses end positions
The tokenizer's internal `error()` method SHALL pass `endLine`/`endColumn` derived from the current position and the error context. For single-character errors, `endLine`/`endColumn` SHALL equal `startLine`/`startColumn`.

#### Scenario: Tokenizer error at current position
- **WHEN** the tokenizer encounters an invalid character at position `(line: 5, col: 8)`
- **THEN** the thrown `HJSONError` SHALL have `startLine: 5, startColumn: 8, endLine: 5, endColumn: 8`

### Requirement: Parser errors use token end positions
Parser error construction SHALL compute `endLine`/`endColumn` from the available token's value length. For tokens with known value extent (numbers, strings, etc.), `endColumn` SHALL be `startColumn + value.length`. `endLine` SHALL account for newlines in the value.

#### Scenario: Parser error with token value extent
- **WHEN** an invalid number `"12.34.56"` is encountered at position `(line: 1, col: 4)`
- **THEN** the thrown `HJSONError` SHALL have `endColumn` of approximately `4 + "12.34.56".length` (accounting for the token's full extent)

### Requirement: Path-based tree traversal via path()
`HjsonNode` SHALL provide a `path(pathStr: string): FieldInfo | ElementInfo | undefined` method that traverses the node tree using dot/bracket path syntax (e.g., `"a.d[2].c"`) and returns the `FieldInfo` or `ElementInfo` for the final segment, or `undefined` if any segment cannot be resolved.

#### Scenario: Single key path returns FieldInfo for the field
- **WHEN** `node.path("fieldName")` is called on an object node whose entries contain `"fieldName"`
- **THEN** it SHALL return a `FieldInfo` with `.key` = `"fieldName"` and `.value` containing the child node

#### Scenario: Deep object path returns FieldInfo for the deepest field
- **WHEN** `node.path("a.b.c")` is called on a node with nested objects `{ a: { b: { c: "val" } } }`
- **THEN** it SHALL return a `FieldInfo` with `.key` = `"c"` and `.value.valueOf()` = `"val"`

#### Scenario: Array index bracket notation returns ElementInfo
- **WHEN** `node.path("items[0]")` is called on a node with array `{ items: [42] }`
- **THEN** it SHALL return an `ElementInfo` with `.index` = `0` and `.value.valueOf()` = `42`

#### Scenario: Mixed dot and bracket paths
- **WHEN** `node.path("a.d[2].c")` is called on a node with nested structure `{ a: { d: [0, 0, { c: "x" }] } }`
- **THEN** it SHALL return a `FieldInfo` with `.key` = `"c"` and `.value.valueOf()` = `"x"`

#### Scenario: Missing segment returns undefined
- **WHEN** `node.path("a.nonexistent.b")` is called and `"nonexistent"` does not exist as a key
- **THEN** it SHALL return `undefined`

#### Scenario: Path on value node returns undefined
- **WHEN** `node.path("anything")` is called on a value node
- **THEN** it SHALL return `undefined`

#### Scenario: Empty path returns undefined
- **WHEN** `node.path("")` is called on any node
- **THEN** it SHALL return `undefined`

### Requirement: Tolerant structured parsing for formatter workflows
The HJSON library SHALL support a tolerant structured parsing mode for formatter workflows. In tolerant mode, recoverable syntax problems SHALL be recorded in the structured result instead of causing immediate data loss.

#### Scenario: Recoverable invalid content produces structured result
- **WHEN** tolerant structured parsing is used on an HJSON document with recoverable malformed content
- **THEN** the parse result SHALL still include the surrounding structured document content
- **AND** the malformed region SHALL be represented as a preserved source segment or formatter-opaque node
- **AND** recoverable parse issues SHALL be available to the formatter

### Requirement: Structured formatter input preserves exact source spans
The formatter-facing structured result SHALL preserve exact source ranges for recognized values and for source segments that cannot be safely normalized.

#### Scenario: Valid fields retain exact ranges
- **WHEN** tolerant structured parsing reads a valid object field or array element
- **THEN** the structured result SHALL retain exact source positions needed to rewrite only that field or element

#### Scenario: Invalid segment retains raw text
- **WHEN** tolerant structured parsing encounters an invalid or partial segment
- **THEN** the structured result SHALL retain the raw source text for that segment without modification
- **AND** the preserved segment SHALL remain available in original source order relative to neighboring valid nodes

### Requirement: Strict structured parsing remains unchanged by default
Existing strict structured parsing behavior SHALL remain the default for current parsing APIs.

#### Scenario: Strict parsing still throws on invalid input
- **WHEN** `HJSON.parseStructured` is called without enabling tolerant formatting behavior on invalid HJSON
- **THEN** it SHALL continue to throw the same parsing error behavior as before
