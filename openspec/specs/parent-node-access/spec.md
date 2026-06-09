## ADDED Requirements

### Requirement: HjsonNode base class has readonly parent property

`HjsonNode` SHALL declare `readonly parent: HjsonNode | undefined` as a public property, injected via the constructor. All subclasses SHALL pass their parent reference through `super(parent)`.

#### Scenario: Node created without parent has undefined parent
- **WHEN** any `HjsonNode` subclass is constructed without passing a `parent` argument
- **THEN** its `parent` property SHALL return `undefined`

#### Scenario: Node created with parent returns that node
- **WHEN** any `HjsonNode` subclass is constructed with a parent node reference
- **THEN** its `parent` property SHALL return that parent node
- **AND** the property SHALL be `readonly` (cannot be reassigned after construction)

#### Scenario: HjsonMissingNode always has undefined parent
- **WHEN** `parent` is accessed on `HjsonMissingNode.instance`
- **THEN** it SHALL return `undefined`

### Requirement: Structured parser wires parent references

The structured parser (`parseStructured` / `parseStructuredAsync`) SHALL pass the current container node as `parent` when constructing child `HjsonObjectNode`, `HjsonArrayNode`, and `HjsonValueNode` instances.

#### Scenario: Value node under object field has parent
- **WHEN** a value is parsed within an object field
- **THEN** the resulting child node SHALL have its `parent` set to the enclosing `HjsonObjectNode`

#### Scenario: Nested object has parent
- **WHEN** a nested object is parsed inside another object or array
- **THEN** the resulting `HjsonObjectNode` SHALL have its `parent` set to the enclosing parent node

#### Scenario: Array has parent
- **WHEN** an array is parsed inside an object field
- **THEN** the resulting `HjsonArrayNode` SHALL have its `parent` set to the enclosing `HjsonObjectNode`

#### Scenario: Root node has no parent
- **WHEN** parsing a complete HJSON document
- **THEN** the root `HjsonNode` SHALL have `parent` return `undefined`

### Requirement: parent enables upward tree traversal from any node

The `parent` property SHALL enable upward traversal from leaf nodes to root without re-parsing or path-based lookup.

#### Scenario: Walk from value node to root
- **WHEN** traversing `.parent` repeatedly from a deeply nested value node
- **THEN** each step SHALL return the immediate parent
- **AND** the sequence SHALL eventually reach a node with `parent === undefined` (the root)

#### Scenario: Value node chained parent access
- **WHEN** a nested value's `parent.parent` is accessed
- **THEN** it SHALL return the grandparent node

### Requirement: patchRemove on Object/Array removes children (no parent delegation)

`HjsonObjectNode.patchRemove(key)` and `HjsonArrayNode.patchRemove(index)` SHALL remove a child field or element from the container. They SHALL NOT delegate to `this.parent`.

#### Scenario: Object patchRemove removes field from self
- **WHEN** `patchRemove` is called on an `HjsonObjectNode` with a valid key
- **THEN** the field identified by the key SHALL be removed from the source string
- **AND** the operation SHALL NOT involve the object node's parent

#### Scenario: Array patchRemove removes element from self
- **WHEN** `patchRemove` is called on an `HjsonArrayNode` with a valid index
- **THEN** the element at that index SHALL be removed from the source string
- **AND** the operation SHALL NOT involve the array node's parent

### Requirement: patchRemove on ValueNode delegates to parent

`HjsonValueNode.patchRemove(key)` SHALL delegate to `this.parent.patchRemove(original, key)` when a parent exists, to remove the field/element containing this value. When no parent exists, it SHALL remove itself inline.

#### Scenario: Value node with parent delegates removal
- **WHEN** `patchRemove` is called on an `HjsonValueNode` that has a parent
- **THEN** the removal SHALL be delegated to the parent's `patchRemove` method

#### Scenario: Value node without parent removes itself inline
- **WHEN** `patchRemove` is called on a root `HjsonValueNode` (no parent)
- **THEN** the value SHALL be removed inline by slicing its start/end range
