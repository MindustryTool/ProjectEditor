## MODIFIED Requirements

### Requirement: Loading state transitions are smooth

The editor entry screen SHALL transition between the loading view and the next screen using a smooth visual effect that includes opacity fade and blur.

#### Scenario: Loading completes and editor is shown
- **WHEN** the editor entry screen transitions from loading to the editor shell
- **THEN** the loading view fades out while the editor content fades in with a blur-to-sharp effect

#### Scenario: Loading completes and no-project screen is shown
- **WHEN** the editor entry screen transitions from loading to a route without a project context
- **THEN** the loading view fades out while the destination screen fades in with a blur-to-sharp effect

### Requirement: Reduced-motion preferences are respected

When the user has enabled reduced motion, the editor entry transition SHALL minimize or disable motion effects and SHALL avoid blur-heavy transitions.

#### Scenario: Reduced motion enabled
- **WHEN** the user agent indicates `prefers-reduced-motion: reduce`
- **THEN** the transition uses no positional motion and uses either no blur or a minimal blur while still clearly indicating the state change

### Requirement: Transitions do not block readiness

The transition behavior SHALL NOT delay the point at which the editor content can be interacted with once it is ready.

#### Scenario: Content becomes interactive promptly
- **WHEN** the editor content is ready to render
- **THEN** the editor content becomes available for interaction at the start of the transition (or immediately after it appears), without waiting for the full animation to complete

## ADDED Requirements

### Requirement: Editor loads project from URL param

The editor entry screen SHALL read the project ID from the URL route parameter instead of from persisted store state. It SHALL attempt to open the corresponding project record on mount.

#### Scenario: Project ID exists in URL and record exists
- **WHEN** the user navigates to `/$lang/projects/<id>` and a project record with that ID exists
- **THEN** the editor loads the project and transitions to the editor shell

#### Scenario: Project ID exists in URL but record is missing
- **WHEN** the user navigates to `/$lang/projects/<id>` and no project record with that ID exists
- **THEN** the editor redirects to `/$lang/projects` with a loading transition

#### Scenario: No project ID in URL
- **WHEN** the user lands on a route without a project ID
- **THEN** the editor does not attempt to load any project

### Requirement: No lastProjectId store interaction

The editor entry screen SHALL NOT read, write, or depend on `lastProjectId` from any store.

#### Scenario: Store has stale lastProjectId
- **WHEN** the user opens the editor and the persisted store still contains a `lastProjectId` value
- **THEN** that value is ignored and no project is auto-loaded from it