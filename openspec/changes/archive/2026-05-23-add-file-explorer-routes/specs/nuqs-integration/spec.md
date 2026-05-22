## ADDED Requirements

### Requirement: NuqsAdapter wraps the app
The system SHALL wrap the application with the nuqs TanStack Router adapter to enable URL query state management.

#### Scenario: NuqsAdapter is mounted
- **WHEN** the app renders
- **THEN** the root route component SHALL wrap children with `<NuqsAdapter>` from `nuqs/adapters/tanstack-router`

### Requirement: nuqs is installed
The system SHALL have `nuqs` as a project dependency.

#### Scenario: nuqs in package.json
- **WHEN** dependencies are installed
- **THEN** `nuqs` SHALL be present in the project's dependencies
