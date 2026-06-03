## MODIFIED Requirements

### Requirement: ValidationProvider manages listener lifecycle
The system SHALL provide a `ValidationProvider` React component that registers validation listeners on mount, creates a long-lived validation worker client, and unregisters listeners, clears pending debounce timers, and disposes worker resources on unmount.

#### Scenario: Provider subscribes to EventBus on mount
- **WHEN** `ValidationProvider` is rendered
- **THEN** it SHALL subscribe to EventBus events `file:write` and `file:create` to detect file content changes

#### Scenario: Provider initializes validation worker on mount
- **WHEN** `ValidationProvider` is rendered
- **THEN** it SHALL create or connect to a `threads.js` validation worker client before dispatching validation work

#### Scenario: Provider cleans up on unmount
- **WHEN** `ValidationProvider` is unmounted
- **THEN** it SHALL unsubscribe from EventBus events, clear any pending debounce timers, and terminate the validation worker client

#### Scenario: Validation runs on file:write event
- **WHEN** a `file:write` event is emitted with `{ path }`
- **THEN** the listener SHALL read latest file content from the file store and schedule a worker-backed validation request after debounce

#### Scenario: Validation runs on file:create event
- **WHEN** a `file:create` event is emitted with `{ path }`
- **THEN** the listener SHALL read latest file content from the file store and schedule a worker-backed validation request after debounce

#### Scenario: Validation runs on file load from disk
- **WHEN** a file finishes loading into the file store (`loading` transitions from `true` to `false`)
- **THEN** the listener SHALL read the file content from the file store and schedule a worker-backed validation request after debounce

#### Scenario: Validation request includes serialized context snapshot
- **WHEN** a file validation request is dispatched
- **THEN** `ValidationProvider` SHALL include the file path, resolved content string, request identifier, and latest serializable validation context snapshot in the worker payload

#### Scenario: Validation results stored via store
- **WHEN** worker validation completes for the latest request of a path
- **THEN** results SHALL be stored via `useValidationStore.getState().setResults(path, results)`

#### Scenario: Validation errors handled gracefully
- **WHEN** worker validation throws an error or rejects
- **THEN** an error-level result SHALL be stored with the error message

### Requirement: Validation context from React Query items cache
The `ValidationProvider` SHALL build a serializable validation context snapshot from current project content reference data and pass that snapshot to the validation worker for schema-based cross-file validation.

#### Scenario: Snapshot includes current project references
- **WHEN** `ValidationProvider` prepares validation work
- **THEN** it SHALL derive snapshot data from current project content sources needed by validation schemas

#### Scenario: Worker receives snapshot-backed context
- **WHEN** validation runs
- **THEN** the worker SHALL reconstruct validation context lookups from the provided snapshot instead of reading React Query or Zustand state directly

### Requirement: Validation clears on file removal
The listener SHALL clear validation results when a file is deleted.

#### Scenario: Clear on file:delete event
- **WHEN** a `file:delete` event is emitted with `{ path }`
- **THEN** the listener SHALL call `useValidationStore.getState().clearResults(path)`

### Requirement: Retain hydration persistence listener
The `ValidationProvider` SHALL retain the hydration persistence listener to re-validate persisted results on rehydration.

#### Scenario: Hydration triggers file read
- **WHEN** the validation store finishes hydration and has persisted results
- **THEN** `readFile()` SHALL be called for each path, which triggers the loading-to-loaded detection and schedules worker-backed validation

### Requirement: ValidationProvider exposes context
The `ValidationProvider` SHALL expose a `ValidationContextValue` with a `validateFile` function via React context.

#### Scenario: useValidationContext returns validateFile
- **WHEN** a component calls `useValidationContext()` inside a `ValidationProvider`
- **THEN** it SHALL receive `{ validateFile: (path: string, content: () => Promise<string>) => Promise<void> }`

#### Scenario: validateFile delegates to worker validation
- **WHEN** `validateFile(path, getContent)` is called
- **THEN** `ValidationProvider` SHALL resolve `getContent()`, build the latest validation context snapshot, and submit the request through the validation worker

### Requirement: ValidationProvider ignores stale worker responses
The `ValidationProvider` SHALL ignore worker responses that do not match the latest dispatched request for a file or batch operation.

#### Scenario: Newer edit supersedes older response
- **WHEN** two validation requests are sent for same file and older response returns last
- **THEN** only the newer response SHALL update validation store state
