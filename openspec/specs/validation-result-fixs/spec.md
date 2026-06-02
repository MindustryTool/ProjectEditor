## ADDED Requirements

### Requirement: ValidationResult includes fixs array
The `ValidationResult` interface SHALL include an optional `fixs` array providing auto-fix suggestions for detected issues.

#### Scenario: Fix with messageKey and action
- **WHEN** a validator produces a result with `fixs: [{messageKey: "fix-add-missing-field", messageParams: {field: "name"}, action: async () => { ... }}]`
- **THEN** the consumer SHALL be able to display the fix description via `t(result.fixs[0].messageKey, result.fixs[0].messageParams)`
- **THEN** calling `result.fixs[0].action()` SHALL execute the fix asynchronously

#### Scenario: Fix action is async
- **WHEN** `result.fixs[0].action()` is called
- **THEN** it SHALL return a `Promise<void>`

#### Scenario: Fixs field is optional
- **WHEN** a validation result has no fixes available
- **THEN** `fixs` SHALL be `undefined`
- **THEN** existing code SHALL not break when accessing `result.fixs`

### Requirement: Fix messageKey uses same generic type as ValidationResult
The `fixs` items' `messageKey` field SHALL use the same generic `Tkey` type parameter as the parent `ValidationResult`.

#### Scenario: Consistent key typing
- **WHEN** `ValidationResult<TranslationKey>` is used
- **THEN** `fixs[0].messageKey` SHALL also be of type `TranslationKey`

### Requirement: Consumable fixs from ValidationErrorList
The system SHALL display fix suggestions alongside validation errors when available.

#### Scenario: Fix button shown for results with fixs
- **WHEN** a `ValidationResult` has a non-empty `fixs` array
- **THEN** the error item SHALL render a clickable "fix" button for each fix
- **WHEN** the button is clicked
- **THEN** `action()` SHALL be called
