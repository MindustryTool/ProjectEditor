## ADDED Requirements

### Requirement: Resizable left panel
The left Panel SHALL be resizable via a drag handle on its right edge.

#### Scenario: Drag to resize left panel
- **WHEN** user mousedowns on the left panel drag handle and moves mouse horizontally
- **THEN** the left panel width SHALL follow the mouse position
- **WHEN** user releases mouse
- **THEN** the left panel width SHALL remain at the new size

#### Scenario: Left panel has minimum width
- **WHEN** user attempts to drag the left panel below 200px
- **THEN** the resize SHALL stop at 200px minimum width

### Requirement: Resizable right panel
The right Panel SHALL be resizable via a drag handle on its left edge.

#### Scenario: Drag to resize right panel
- **WHEN** user mousedowns on the right panel drag handle and moves mouse horizontally
- **THEN** the right panel width SHALL follow the mouse position
- **WHEN** user releases mouse
- **THEN** the right panel width SHALL remain at the new size

#### Scenario: Right panel has minimum width
- **WHEN** user attempts to drag the right panel below 200px
- **THEN** the resize SHALL stop at 200px minimum width

### Requirement: Panel accepts children as content
The Panel component SHALL render its children within the panel body area.

#### Scenario: Panel renders content
- **WHEN** children are passed to Panel
- **THEN** they SHALL be rendered inside the panel body below any header
