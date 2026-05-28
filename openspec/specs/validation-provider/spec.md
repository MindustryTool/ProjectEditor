# validation-provider Specification

## Purpose
The system SHALL provide a `ValidationProvider` React component that manages the file content validation listener lifecycle and provides validation context via React Query.

## Requirements

### Requirement: ValidationProvider manages listener lifecycle

The system SHALL provide a `ValidationProvider` React component that registers the file content validation listener on mount and unregisters on unmount.

#### Scenario: Provider registers listener on mount
- **WHEN** `ValidationProvider` is rendered
- **THEN** it SHALL subscribe to `useFileContentStore` to detect file content changes

#### Scenario: Provider cleans up on unmount
- **WHEN** `ValidationProvider` is unmounted
- **THEN** it SHALL unsubscribe from `useFileContentStore` and clear any pending debounce timers

#### Scenario: Validation runs on file version change
- **WHEN** `writeBuffer(path, content)` increments `currentVersion`
- **THEN** the listener SHALL schedule validation after 500ms debounce

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
