## ADDED Requirements

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
