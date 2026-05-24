## ADDED Requirements

### Requirement: Loading state transitions are smooth

The editor entry screen SHALL transition between the loading view and the next screen using a smooth visual effect that includes opacity fade and blur.

#### Scenario: Loading completes and editor is shown
- **WHEN** the editor entry screen transitions from loading to the editor shell
- **THEN** the loading view fades out while the editor content fades in with a blur-to-sharp effect

#### Scenario: Loading completes and no-project screen is shown
- **WHEN** the editor entry screen transitions from loading to the no-project screen
- **THEN** the loading view fades out while the no-project screen fades in with a blur-to-sharp effect

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
