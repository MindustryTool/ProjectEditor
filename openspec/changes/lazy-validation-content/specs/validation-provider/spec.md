## MODIFIED Requirements

### Requirement: ValidationProvider exposes context
The `ValidationProvider` SHALL expose a `ValidationContextValue` with a `validateFile` function via React context.

#### Scenario: useValidationContext returns validateFile
- **WHEN** a component calls `useValidationContext()` inside a `ValidationProvider`
- **THEN** it SHALL receive `{ validateFile: (path: string, content: () => Promise<string>) => void }`

#### Scenario: validateFile runs validators with lazy content
- **WHEN** `validateFile(path, getContent)` is called
- **THEN** the runner SHALL call `registry.getMatches(path)` to check for matching validators
- **WHEN** there are matching validators
- **THEN** the runner SHALL invoke `getContent()` to resolve the content
- **THEN** the runner SHALL run the resolved content against all matched validators
- **WHEN** there are no matching validators
- **THEN** the runner SHALL NOT invoke `getContent()`
- **THEN** no results SHALL be stored

### Requirement: Validation runs on file:write event

#### Scenario: Validation uses lazy content from store
- **WHEN** a `file:write` event triggers validation for a path
- **THEN** `scheduleValidation` SHALL create a `() => Promise<string>` getter that reads and decodes the data from the file store when called
- **THEN** the getter SHALL only be called if `registry.getMatches(path)` returns validators
