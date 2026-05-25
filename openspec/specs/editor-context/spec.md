# editor-context Specification

## Purpose
TBD - created by archiving change editor-context-and-validation-decoupling. Update Purpose after archive.
## Requirements
### Requirement: EditorContext provides monaco setup and lifecycle
The system SHALL provide a React Context (`EditorContext`) that manages editor-specific lifecycle concerns including monaco configuration, theme application, and validation markers display.

#### Scenario: Provider initializes monaco
- **WHEN** the `EditorProvider` is mounted with a `path` prop
- **THEN** it SHALL configure monaco language registrations (hjson) and apply the monaco theme
- **AND** it SHALL register a cleanup effect that tears down monaco subscriptions on unmount

#### Scenario: Consumer components access editor lifecycle
- **WHEN** a component uses `useEditorContext()`
- **THEN** it SHALL receive `{ path, monacoRef, editorRef, isReady }` or equivalent that reflects the current editor state

### Requirement: EditorContext manages validation markers
The EditorContext SHALL subscribe to the validation store for the current file path and update monaco editor markers accordingly.

#### Scenario: Markers shown when validation results exist
- **WHEN** the validation store has results for the current `path`
- **THEN** the EditorContext SHALL call `monaco.editor.setModelMarkers()` with those results converted to marker format
- **AND** the markers SHALL be cleared when the validation store has no results for that path

#### Scenario: Markers update reactively
- **WHEN** validation results change in the store for the current path
- **THEN** the markers SHALL update immediately without re-mounting the editor

#### Scenario: Markers cleared on path change
- **WHEN** the `path` prop changes
- **THEN** the markers for the previous path SHALL be cleared

### Requirement: EditorContext integrates with file-content-store
The EditorContext SHALL manage file lifecycle for the active editor path, including event subscription and cleanup.

#### Scenario: Subscribes to file events
- **WHEN** the EditorContext mounts with a `path`
- **THEN** it SHALL call `fileContentStore.subscribeToEvents(path)`

#### Scenario: Unsubscribes on unmount
- **WHEN** the EditorContext unmounts
- **THEN** it SHALL call `fileContentStore.cleanup(path)` to remove event subscriptions

### Requirement: EditorContext provides monaco refs
The EditorContext SHALL expose monaco and editor refs that are set by MonacoEditor on mount.

#### Scenario: Refs populated on editor mount
- **WHEN** MonacoEditor finishes mounting
- **THEN** the EditorContext SHALL have `monacoRef.current` and `editorRef.current` populated

