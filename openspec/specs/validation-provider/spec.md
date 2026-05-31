# validation-provider Specification

## Purpose
The system SHALL provide a `ValidationProvider` React component that manages the file content validation listener lifecycle and provides validation context via React Query.
## Requirements
### Requirement: ValidationProvider manages listener lifecycle
The system SHALL provide a `ValidationProvider` React component that registers validation listeners on mount and unregisters on unmount.

#### Scenario: Provider subscribes to EventBus on mount
- **WHEN** `ValidationProvider` is rendered
- **THEN** it SHALL subscribe to EventBus events `file:write` and `file:create` to detect file content changes

#### Scenario: Provider cleans up on unmount
- **WHEN** `ValidationProvider` is unmounted
- **THEN** it SHALL unsubscribe from EventBus events and clear any pending debounce timers

#### Scenario: Validation runs on file:write event
- **WHEN** a `file:write` event is emitted with `{ path }`
- **THEN** the listener SHALL read the file content from the file store and schedule validation after debounce

#### Scenario: Validation runs on file:create event
- **WHEN** a `file:create` event is emitted with `{ path }`
- **THEN** the listener SHALL read the file content from the file store and schedule validation after debounce

#### Scenario: Validation runs on file load from disk
- **WHEN** a file finishes loading into the file store (`loading` transitions from `true` to `false`)
- **THEN** the listener SHALL read the file content from the file store and schedule validation after debounce

#### Scenario: Validation uses in-memory buffer data
- **WHEN** validation runs for a file
- **THEN** it SHALL decode the `data` field from the store entry as text

#### Scenario: Validation results stored via store
- **WHEN** validation completes
- **THEN** results SHALL be stored via `useValidationStore.getState().setResults(path, results)`

#### Scenario: Validation errors handled gracefully
- **WHEN** validation throws an error
- **THEN** an error-level result SHALL be stored with the error message

### Requirement: Validation context from React Query items cache

The `ValidationProvider` SHALL create a `ValidationRunner` with a `ValidationContext` whose `getItems()` reads from the React Query cache keyed by `["items", projectId]`.

#### Scenario: Items fetched from content/item/ directory
- **WHEN** `ValidationProvider` mounts
- **THEN** it SHALL query `content/item/` directory via `useQuery` and cache results under `["items", projectId]`

#### Scenario: getItems reads from query cache
- **WHEN** validation runs
- **THEN** `getItems()` SHALL return items from `queryClient.getQueryData(["items", projectId])`

### Requirement: Validation clears on file removal
The listener SHALL clear validation results when a file is deleted.

#### Scenario: Clear on file:delete event
- **WHEN** a `file:delete` event is emitted with `{ path }`
- **THEN** the listener SHALL call `useValidationStore.getState().clearResults(path)`

### Requirement: Retain hydration persistence listener
The `ValidationProvider` SHALL retain the hydration persistence listener to re-validate persisted results on rehydration.

#### Scenario: Hydration triggers file read
- **WHEN** the validation store finishes hydration and has persisted results
- **THEN** `readFile()` SHALL be called for each path, which triggers the loading→loaded detection and runs validation

### Requirement: ValidationProvider exposes context
The `ValidationProvider` SHALL expose a `ValidationContextValue` with a `validateFile` function via React context.

#### Scenario: useValidationContext returns validateFile
- **WHEN** a component calls `useValidationContext()` inside a `ValidationProvider`
- **THEN** it SHALL receive `{ validateFile: (path, content) => void }`

#### Scenario: validateFile runs validators
- **WHEN** `validateFile(path, content)` is called
- **THEN** the runner SHALL validate the content against all registered validators for that path
- **THEN** results SHALL be stored via `useValidationStore.getState().setResults(path, results)`

