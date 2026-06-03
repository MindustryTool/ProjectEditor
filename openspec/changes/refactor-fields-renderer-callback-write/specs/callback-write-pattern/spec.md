## ADDED Requirements

### Requirement: writeBuffer accepts updater callback
The `writeBuffer` store action SHALL accept an updater callback as the third argument in addition to direct `ArrayBuffer` or `string` values. The callback operates on `ArrayBuffer` types only — string encoding is handled by higher-level wrappers like `useFileString`.

#### Scenario: writeBuffer with direct string value
- **WHEN** `writeBuffer(projectId, path, "new content")` is called
- **THEN** the buffer SHALL be set to `TextEncoder.encode("new content").buffer` and `currentVersion` SHALL increment by 1

#### Scenario: writeBuffer with updater callback
- **WHEN** `writeBuffer(projectId, path, (prev) => new Uint8Array([65, 66, 67]).buffer)` is called
- **THEN** the buffer SHALL be set to the returned `ArrayBuffer` and `currentVersion` SHALL increment by 1

#### Scenario: updater receives current data as ArrayBuffer or null
- **WHEN** `writeBuffer(projectId, path, (prev) => ...)` is called
- **THEN** `prev` SHALL be the current `data` value as `ArrayBuffer | null` (never a string)

#### Scenario: updater must return ArrayBuffer
- **WHEN** the updater returns a value
- **THEN** it MUST be an `ArrayBuffer` — string returns are not handled at the store level

### Requirement: useFileString.write accepts updater callback
The `write` function returned by `useFileString(path)` SHALL accept either a direct `string` value or an updater callback `(prev: string | null) => string`.

#### Scenario: write with direct string
- **WHEN** `write("new content")` is called
- **THEN** it SHALL call `writeBuffer(projectId, path, "new content")`

#### Scenario: write with updater callback
- **WHEN** `write((prev) => prev + "!")` is called and current data is `"hello"`
- **THEN** the buffer SHALL be set to `"hello!"`

#### Scenario: updater receives decoded string
- **WHEN** `write((prev) => ...)` is called and the current buffer is a valid UTF-8 `ArrayBuffer`
- **THEN** `prev` SHALL be the decoded string (via `TextDecoder()`)

#### Scenario: updater receives null when no data
- **WHEN** `write((prev) => ...)` is called and the current buffer has no data
- **THEN** `prev` SHALL be `null`
