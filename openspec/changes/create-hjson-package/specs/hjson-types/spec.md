## ADDED Requirements

### Requirement: Export HJSON type with parse/stringify methods
The package SHALL export a namespace/object type `HJSON` containing the full API surface.

#### Scenario: HJSON type has parse method
- **WHEN** referencing `HJSON.parse`
- **THEN** its type signature MUST be `<T = unknown>(text: string, reviver?: Reviver, options?: HJSONParseOptions) => T`

#### Scenario: HJSON type has stringify method
- **WHEN** referencing `HJSON.stringify`
- **THEN** its type signature MUST be `(value: any, replacer?: Replacer, space?: Space) => string`

#### Scenario: HJSON type has parseAsync method
- **WHEN** referencing `HJSON.parseAsync`
- **THEN** its type signature MUST be `<T = unknown>(text: string, reviver?: Reviver, options?: HJSONParseOptions) => Promise<T>`

### Requirement: Export HJSONParseOptions interface
The package SHALL export an interface for parser options.

#### Scenario: HJSONParseOptions has keepQuote property
- **WHEN** using `HJSONParseOptions`
- **THEN** it MUST include optional `keepQuote: boolean` property

#### Scenario: HJSONParseOptions has legacyRoot property
- **WHEN** using `HJSONParseOptions`
- **THEN** it MUST include optional `legacyRoot?: boolean` property

### Requirement: Export Reviver and Replacer type aliases
The package SHALL export type aliases matching the `JSON.parse`/`JSON.stringify` callback signatures.

#### Scenario: Reviver type matches JSON.parse reviver
- **WHEN** using the `Reviver` type
- **THEN** it MUST match `(this: any, key: string, value: any) => any`

#### Scenario: Replacer type function matches JSON.stringify replacer
- **WHEN** using the `Replacer` type
- **THEN** it MUST accept both `(string | number)[]` and `(this: any, key: string, value: any) => any` forms

### Requirement: Export HJSONError class type
The package SHALL export the `HJSONError` class type for use in catch clauses.

#### Scenario: HJSONError has readonly properties
- **WHEN** catching `HJSONError`
- **THEN** its instance must have readonly `code: HJSONErrorCode`, `row: number`, `col: number`, `index: number`, `inputFragment: string` properties, and extend `SyntaxError`
