## MODIFIED Requirements

### Requirement: Status bar displays live project info
The `StatusBar` component SHALL compose three sub-components (`StatusBarLeft`, `StatusBarCenter`, `StatusBarRight`) as slot children. Each sub-component subscribes to its own store slices independently and SHALL be defined in its own spec:
- `status-bar-left/spec.md` — project name and file count
- `status-bar-center/spec.md` — editor status indicator
- `status-bar-right/spec.md` — validation error/warning counts and document type icons

#### Scenario: Status bar with project data
- **WHEN** a project is open
- **THEN** the left section SHALL display the project name and file count, the center SHALL display "Ready", and the right SHALL display validation counts and icons

#### Scenario: Status bar with no project
- **WHEN** no project is open
- **THEN** the left section SHALL display an empty project name, the center SHALL display "Ready", and the right SHALL NOT show validation counts
