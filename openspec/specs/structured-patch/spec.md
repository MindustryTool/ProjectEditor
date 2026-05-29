## ADDED Requirements

### Requirement: ElementInfo provides replaceValue for array elements
`ElementInfo` SHALL provide a `replaceValue(original: string, newValue: string): string` method that replaces the element's value in the original source string using positional slicing, mirroring `FieldInfo.replaceValue`.

#### Scenario: Replace string element at index
- **WHEN** `elementInfo.replaceValue(original, '"new-value"')` is called on an `ElementInfo` with `valueStart.index` and `valueEnd.index` matching a string element
- **THEN** the returned string SHALL have the element replaced with `"new-value"`
- **AND** all other content in `original` SHALL be unchanged

### Requirement: HjsonArrayNode provides patchElement for replacing elements
`HjsonArrayNode` SHALL provide a `patchElement(original: string, index: number, newValue: string): string` method that replaces an array element at the given index in the source string.

#### Scenario: Replace existing element by index
- **WHEN** `arrayNode.patchElement(original, 0, '"replaced"')` is called on an array `[a, b, c]`
- **THEN** the returned string SHALL be `[replaced, b, c]`

#### Scenario: patchElement with out-of-bounds index returns original unchanged
- **WHEN** `arrayNode.patchElement(original, 99, '"x"')` is called
- **THEN** the returned string SHALL equal `original`

### Requirement: HjsonArrayNode provides insertElement for inserting elements
`HjsonArrayNode` SHALL provide an `insertElement(original: string, index: number, newValue: string): string` method that inserts a new element before the given index. When index equals the array length, the element SHALL be appended.

#### Scenario: Insert element at beginning of array
- **WHEN** `arrayNode.insertElement(original, 0, '"new"')` is called on an array `[a, b]`
- **THEN** the returned string SHALL be `[new, a, b]`

#### Scenario: Insert element at end (append)
- **WHEN** `arrayNode.insertElement(original, 2, '"new"')` is called on an array `[a, b]` (length 2)
- **THEN** the returned string SHALL be `[a, b, new]`

#### Scenario: Insert element preserves trailing comma style
- **WHEN** `arrayNode.insertElement(original, 1, '"new"')` is called on an array `[a, b,]`
- **THEN** the returned string SHALL be `[a, new, b,]`

### Requirement: HjsonArrayNode provides removeElement for removing elements
`HjsonArrayNode` SHALL provide a `removeElement(original: string, index: number): string` method that removes an element at the given index from the source string, cleaning up surrounding commas.

#### Scenario: Remove first element
- **WHEN** `arrayNode.removeElement(original, 0)` is called on an array `[a, b, c]`
- **THEN** the returned string SHALL be `[b, c]`

#### Scenario: Remove last element with trailing comma
- **WHEN** `arrayNode.removeElement(original, 1)` is called on an array `[a, b,]`
- **THEN** the returned string SHALL be `[a,]`
