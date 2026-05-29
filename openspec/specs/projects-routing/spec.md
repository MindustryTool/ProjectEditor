# projects-routing Specification

## Purpose
TBD - created by archiving change move-last-project-id-to-url. Update Purpose after archive.
## Requirements

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

### Requirement: Projects page renders project picker

The system SHALL provide a `/projects` route under each locale (`/$lang/projects`) that renders the project picker UI allowing users to create, import, or open projects.

#### Scenario: Navigating to projects page
- **WHEN** the user navigates to `/$lang/projects`
- **THEN** the project picker screen is displayed with create, import, and project list sections

#### Scenario: Creating a project from projects page
- **WHEN** the user creates a new project from the projects page
- **THEN** the user is navigated to `/$lang/projects/<new-project-id>` where the editor loads

#### Scenario: Opening a project from projects page
- **WHEN** the user clicks on a project in the project list
- **THEN** the user is navigated to `/$lang/projects/<project-id>` where the editor loads

### Requirement: Editor opens via project URL

The system SHALL load the editor with a specific project when the user navigates to `/$lang/projects/:id`.

#### Scenario: Valid project ID in URL
- **WHEN** the user navigates to `/$lang/projects/<id>` and `<id>` matches an existing project record
- **THEN** the editor loads that project's content and displays the editor shell

#### Scenario: Invalid or missing project ID
- **WHEN** the user navigates to `/$lang/projects/<id>` and `<id>` does not match any existing project
- **THEN** the user is redirected to `/$lang/projects` and a notification is shown

### Requirement: No persisted lastProjectId

The system SHALL NOT persist a `lastProjectId` in any storage layer. Project selection is determined solely by the URL.

#### Scenario: App restart without URL param
- **WHEN** the user opens the app and navigates to any route without a project ID in the URL
- **THEN** no project is auto-loaded and the project picker is shown if the route is `/projects`

#### Scenario: Direct link to a project
- **WHEN** the user opens a direct link to `/$lang/projects/<id>`
- **THEN** the specified project is loaded regardless of which project was previously open

### Requirement: Create/import navigates to project URL

All project creation and import flows SHALL navigate to the project URL instead of storing a last-project reference.

#### Scenario: Creating new project from toolbar
- **WHEN** the user creates a new project from the toolbar Project menu
- **THEN** the user is navigated to `/$lang/projects/<new-project-id>`

#### Scenario: Importing project from toolbar
- **WHEN** the user imports a project zip from the toolbar Project menu
- **THEN** the user is navigated to `/$lang/projects/<imported-project-id>`

#### Scenario: Opening existing project from toolbar
- **WHEN** the user opens an existing project from the toolbar Project menu
- **THEN** the user is navigated to `/$lang/projects/<project-id>`

