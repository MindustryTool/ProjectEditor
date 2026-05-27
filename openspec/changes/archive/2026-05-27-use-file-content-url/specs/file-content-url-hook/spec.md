## ADDED Requirements

### Requirement: useFileContentImageUrl hook manages blob URL lifecycle for images
The system SHALL provide a `useFileContentImageUrl(data)` React hook that creates a `Blob` with `image/png` type from the given `ArrayBuffer` and returns a memoized `blob:` URL, automatically revoking the previous URL on data change and on unmount.

#### Scenario: Returns null when data is null
- **WHEN** `useFileContentImageUrl(null)` is called
- **THEN** the returned value SHALL be `null`

#### Scenario: Returns blob URL when data is provided
- **WHEN** `useFileContentImageUrl(buffer)` is called with a non-null `ArrayBuffer`
- **THEN** the returned value SHALL be a string starting with `"blob:"`

#### Scenario: Revokes previous URL when data changes
- **WHEN** the `data` argument changes from one non-null `ArrayBuffer` to another
- **THEN** the previous object URL SHALL be revoked (via `URL.revokeObjectURL`)
- **AND** a new object URL SHALL be created for the new data

#### Scenario: Revokes URL on unmount
- **WHEN** the component using `useFileContentImageUrl` unmounts
- **THEN** the current object URL SHALL be revoked (via `URL.revokeObjectURL`)

#### Scenario: Blob is always created with image/png type
- **WHEN** `useFileContentImageUrl(buffer)` is called
- **THEN** the `Blob` SHALL be created with `{ type: "image/png" }`

#### Scenario: Returns null when data is zero-length
- **WHEN** `useFileContentImageUrl(buffer)` is called with an `ArrayBuffer` of `byteLength` 0
- **THEN** the returned value SHALL be `null` (no URL created for empty data)
