## ADDED Requirements

### Requirement: File explorer context provides shared tree state
The system SHALL provide a React context (`FileExplorerContext`) that makes tree state and action callbacks available to all `TreeNodeItem` descendants without prop drilling.

#### Scenario: Context provides selected path
- **WHEN** a `TreeNodeItem` reads from context
- **THEN** it SHALL receive the current `selectedPath` value from the nearest `FileExplorerContext.Provider`

#### Scenario: Context provides editing path
- **WHEN** a `TreeNodeItem` reads from context
- **THEN** it SHALL receive the current `editingPath` value and an `onEditingPathChange` setter

#### Scenario: Context provides create action
- **WHEN** a `TreeNodeItem` reads from context
- **THEN** it SHALL receive an `onCreateRequest` callback to trigger the create dialog for its path

#### Scenario: Context provides delete action
- **WHEN** a `TreeNodeItem` reads from context
- **THEN** it SHALL receive an `onDeleteRequest` callback to trigger the delete confirmation

#### Scenario: Context provides issue counts
- **WHEN** a `TreeNodeItem` reads from context
- **THEN** it SHALL receive the `totalIssueCount` record for validation badges
