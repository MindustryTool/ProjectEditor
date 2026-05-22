## ADDED Requirements

### Requirement: Status bar displays project info
The StatusBar component SHALL render a horizontal bar at the bottom showing project name, file count, and a status indicator.

#### Scenario: Status bar with project data
- **WHEN** the StatusBar receives projectName, fileCount, and status props
- **THEN** it SHALL display the project name on the left, status text in the center, and file count on the right

#### Scenario: Status bar without props
- **WHEN** the StatusBar is rendered without props
- **THEN** it SHALL display default values: "No project", "Ready", and "0 files"
