## Requirements

### Requirement: FieldInfo is generic over value type
`FieldInfo` SHALL accept a type parameter `T` that types the `value` property, defaulting to `unknown` for backward compatibility.

#### Scenario: FieldInfo with typed value
- **WHEN** a `FieldInfo<string>` is created via `createFieldInfo`
- **THEN** the `value` property SHALL be typed as `string`
- **AND** consumers SHALL NOT need to cast the value

#### Scenario: FieldInfo without explicit type
- **WHEN** a `FieldInfo` is used without a type parameter
- **THEN** the `value` property SHALL default to `unknown`

### Requirement: ElementInfo is generic over value type
`ElementInfo` SHALL accept a type parameter `T` that types the `value` property, defaulting to `unknown`.

#### Scenario: ElementInfo with typed value
- **WHEN** an `ElementInfo<number>` is created via `createElementInfo`
- **THEN** the `value` property SHALL be typed as `number`
- **AND** consumers SHALL NOT need to cast the value

### Requirement: createFieldInfo and createElementInfo pass through type
The factory functions `createFieldInfo` and `createElementInfo` SHALL infer the type parameter from the `value` argument.

#### Scenario: createFieldInfo infers type from argument
- **WHEN** `createFieldInfo("count", 42, start, end, vStart, vEnd)` is called
- **THEN** the returned `FieldInfo` SHALL have `value` typed as `number`

#### Scenario: createElementInfo infers type from argument
- **WHEN** `createElementInfo(0, "hello", start, end, vStart, vEnd)` is called
- **THEN** the returned `ElementInfo` SHALL have `value` typed as `string`

### Requirement: HjsonValueNode is generic over value type
`HjsonValueNode` SHALL accept a type parameter `T` representing the primitive value it holds, defaulting to `unknown`.

#### Scenario: HjsonValueNode with string value
- **WHEN** a `HjsonValueNode<string>` is constructed
- **THEN** `asString()` SHALL return the string value
- **AND** `valueOf()` SHALL return the string value typed as `T`

#### Scenario: HjsonValueNode.value preserves type
- **WHEN** `node.valueOf()` is called on a `HjsonValueNode<number>`
- **THEN** the return type SHALL be `number`

### Requirement: Primitive type guard methods on HjsonNode
`HjsonNode` SHALL declare abstract `isString()`, `isNumber()`, and `isBoolean()` methods that narrow the node type to `HjsonValueNode` of the corresponding primitive.

#### Scenario: isString guards string value
- **WHEN** `node.isString()` returns `true`
- **THEN** the narrowed type SHALL be `HjsonValueNode<string>`
- **AND** `node.valueOf()` SHALL return a `string`

#### Scenario: isNumber guards number value
- **WHEN** `node.isNumber()` returns `true`
- **THEN** the narrowed type SHALL be `HjsonValueNode<number>`
- **AND** `node.valueOf()` SHALL return a `number`

#### Scenario: isBoolean guards boolean value
- **WHEN** `node.isBoolean()` returns `true`
- **THEN** the narrowed type SHALL be `HjsonValueNode<boolean>`
- **AND** `node.valueOf()` SHALL return a `boolean`

#### Scenario: Type guards work in if-blocks
- **WHEN** `if (node.isString()) { node.valueOf() }` is used
- **THEN** TypeScript SHALL infer `node` as `HjsonValueNode<string>` inside the block

### Requirement: All HjsonNode subclasses implement primitive type guards
`HjsonObjectNode`, `HjsonArrayNode`, `HjsonValueNode`, and `HjsonMissingNode` SHALL each implement `isString()`, `isNumber()`, and `isBoolean()`.

#### Scenario: HjsonValueNode returns correct guard
- **WHEN** `isString()` is called on an `HjsonValueNode` holding a string
- **THEN** it SHALL return `true`
- **WHEN** `isString()` is called on an `HjsonValueNode` holding a number
- **THEN** it SHALL return `false`

#### Scenario: Non-value nodes return false for all primitive guards
- **WHEN** `isString()` is called on any `HjsonObjectNode`, `HjsonArrayNode`, or `HjsonMissingNode`
- **THEN** it SHALL return `false`
