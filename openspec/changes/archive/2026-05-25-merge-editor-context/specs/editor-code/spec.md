## ADDED Requirements

### Requirement: MonacoEditor manages validation markers inline
The MonacoEditor SHALL subscribe to the validation store for its `filePath` and update Monaco editor markers accordingly, without relying on an external context.

#### Scenario: Markers shown when validation results exist
- **WHEN** the validation store has results for the current `filePath`
- **THEN** MonacoEditor SHALL call `monaco.editor.setModelMarkers()` with those results converted to marker format
- **AND** the markers SHALL be cleared when the validation store has no results for that path

#### Scenario: Markers update reactively
- **WHEN** validation results change in the store for the current path
- **THEN** the markers SHALL update immediately without re-mounting the editor

#### Scenario: Markers cleared on path change
- **WHEN** the `filePath` prop changes
- **THEN** the markers for the previous path SHALL be cleared

### Requirement: MonacoEditor integrates with file-content-store
MonacoEditor SHALL manage file lifecycle for its `filePath`, including event subscription and cleanup.

#### Scenario: Subscribes to file events on mount
- **WHEN** MonacoEditor mounts with a `filePath`
- **THEN** it SHALL call `fileContentStore.subscribeToEvents(path)` for that path

#### Scenario: Unsubscribes on unmount
- **WHEN** MonacoEditor unmounts
- **THEN** it SHALL call `fileContentStore.cleanup(path)` to remove event subscriptions

### Requirement: MonacoEditor manages its own monaco lifecycle refs
MonacoEditor SHALL manage `monacoRef` and `editorRef` internally as local refs, without relying on an external context provider.

#### Scenario: Refs populated on mount
- **WHEN** MonacoEditor mounts
- **THEN** `monacoRef.current` SHALL be set to the monaco instance
- **AND** `editorRef.current` SHALL be set to the editor instance

#### Scenario: Refs cleaned up on unmount
- **WHEN** MonacoEditor unmounts
- **THEN** the editor instance SHALL be disposed

