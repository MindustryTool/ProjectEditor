## ADDED Requirements

### Requirement: useFileContentString hook wraps useFileContent with string decoding
The system SHALL provide a `useFileContentString(path)` React hook that wraps `useFileContent(path)` and decodes the `ArrayBuffer` data to a string using `TextDecoder`.

#### Scenario: Returns decoded string from ArrayBuffer data
- **WHEN** `useFileContentString("mod.hjson")` is called and the underlying `useFileContent` returns `data` as an `ArrayBuffer` containing UTF-8 encoded text
- **THEN** the returned `data` field SHALL be the decoded string (via `TextDecoder().decode(data)`)

#### Scenario: Returns null when data is null
- **WHEN** `useFileContentString("mod.hjson")` is called and the underlying `useFileContent` returns `data` as `null`
- **THEN** the returned `data` field SHALL be `null`

#### Scenario: Returns empty string when data is zero-length ArrayBuffer
- **WHEN** `useFileContentString("mod.hjson")` is called and `data` is an `ArrayBuffer` with `byteLength` of 0
- **THEN** the returned `data` SHALL be `""`

#### Scenario: write accepts string and encodes to ArrayBuffer
- **WHEN** `write("new content")` is called on the result of `useFileContentString`
- **THEN** it SHALL encode the string to `ArrayBuffer` via `TextEncoder.encode()` and pass it to the underlying `useFileContent().write()`

#### Scenario: All other fields pass through unchanged
- **WHEN** `useFileContentString(path)` is called
- **THEN** `currentVersion`, `savedVersion`, `savedAt`, `error`, `isDirty`, `isSaving`, `isLoading`, `isError` SHALL be the same values as returned by `useFileContent(path)`
