## REMOVED Requirements

### Requirement: EditorContext provides monaco setup and lifecycle
**Reason**: The `EditorContext` component is being removed. All its responsibilities are inlined into `MonacoEditor`.
**Migration**: No migration needed — consumers that used `useEditorContext()` should rely on `MonacoEditor` directly.

### Requirement: EditorContext manages validation markers
**Reason**: Validation marker logic is moving into `MonacoEditor` directly.
**Migration**: Same as above — markers are managed internally by `MonacoEditor`.

### Requirement: EditorContext integrates with file-content-store
**Reason**: File lifecycle management is moving into `MonacoEditor`.
**Migration**: Same as above — handled internally by `MonacoEditor`.

### Requirement: EditorContext provides monaco refs
**Reason**: Local refs within `MonacoEditor` replace context-provided refs.
**Migration**: `useEditorContext()` no longer exists. Refs are internal to `MonacoEditor`.
