## MODIFIED Requirements

### Requirement: Store provides writeBuffer action
The file-content-store SHALL provide a `writeBuffer(projectId, path, content)` action that updates the in-memory buffer, incrementing `currentVersion` and clearing errors.

#### Scenario: writeBuffer increments version
- **WHEN** `writeBuffer(projectId, "mod.hjson", "new content")` is called
- **THEN** `currentVersion` SHALL increment by 1 relative to its previous value
- **AND** `savedVersion` SHALL remain unchanged

#### Scenario: writeBuffer clears error
- **WHEN** `writeBuffer(projectId, "mod.hjson", "content")` is called and the file has a prior error
- **THEN** `error` SHALL be set to `null`

#### Scenario: writeBuffer accepts updater callback
- **WHEN** `writeBuffer(projectId, "mod.hjson", (prev) => new Uint8Array([65]).buffer)` is called
- **THEN** `prev` SHALL be the current `data` value (as `ArrayBuffer | null`)
- **AND** the return value (`ArrayBuffer`) SHALL become the new buffer content
- **AND** `currentVersion` SHALL increment by 1

## REMOVED Requirements

### Requirement: writeBuffer sets buffer content
**Reason**: Replaced by the updated `writeBuffer` action that also accepts updater callbacks (see MODIFIED requirements).
**Migration**: All `writeBuffer(content)` calls remain valid for direct values. For updater callbacks, pass `(prev) => newValue` instead.
