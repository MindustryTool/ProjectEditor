# lazy-validation-content Specification

## Purpose
The system SHALL provide lazy content resolution in the validation runner so file content is only decoded when there are registered validators matching a given file path.

## Requirements
### Requirement: Content is resolved lazily from a getter
The `ValidationRunner` SHALL accept content as a `() => Promise<string>` getter instead of a pre-resolved `string`, and SHALL only resolve the getter when there are matched validators for the given path.

#### Scenario: Runner calls getter only when validators match
- **WHEN** `validate(path, getContent, context)` is called with a path that has matching validators in the registry
- **THEN** the runner SHALL invoke `getContent()` to produce the content string
- **THEN** the runner SHALL pass the resolved content string to each matched validator

#### Scenario: Runner does not call getter when no validators match
- **WHEN** `validate(path, getContent, context)` is called with a path that has no matching validators
- **THEN** the runner SHALL NOT invoke `getContent()`
- **THEN** the runner SHALL return an empty results array

#### Scenario: Runner calls getter once per path irrespective of validator count
- **WHEN** `validate(path, getContent, context)` is called and there are 3 matching validators
- **THEN** the runner SHALL invoke `getContent()` exactly once
- **THEN** the same resolved content SHALL be passed to all matched validators

#### Scenario: Runner error when getter rejects
- **WHEN** `validate(path, getContent, context)` is called and `getContent()` rejects or throws
- **THEN** the runner SHALL catch the error and return it as a validation error result for that path

### Requirement: ValidatorFn receives resolved content
The `ValidatorFn` type SHALL continue to receive `content` as a resolved `string` parameter, unchanged from its current signature.

#### Scenario: Validator receives string content
- **WHEN** a validator function is invoked
- **THEN** its `content` parameter SHALL be a `string` (resolved by the runner from the lazy getter)

### Requirement: validateAll accepts lazy content getters
The `validateAll` method SHALL accept file entries with `content: () => Promise<string>` and apply the same lazy resolution logic.

#### Scenario: validateAll resolves per-file
- **WHEN** `validateAll(files, context)` is called
- **THEN** each file's content getter SHALL be resolved only if its path has matching validators
