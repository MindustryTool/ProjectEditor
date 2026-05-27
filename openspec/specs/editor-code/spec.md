## Purpose
The MonacoEditor component provides a code editor experience for mod file editing, with syntax highlighting, validation markers, and file lifecycle management.
## Requirements
### Requirement: MonacoEditor wrapper component
The system SHALL provide a reusable `MonacoEditor` React component that wraps the Monaco Editor instance and replaces all textarea-based editors in the application.

#### Scenario: Rendering with value and onChange
- **WHEN** the `MonacoEditor` component is rendered with a `value` string and an `onChange` callback
- **THEN** it SHALL display a Monaco Editor instance with the given value
- **AND** it SHALL call `onChange(newValue)` whenever the editor content changes

#### Scenario: Language prop drives syntax highlighting
- **WHEN** the `MonacoEditor` component receives a `language` prop
- **THEN** it SHALL configure the Monaco Editor to use the corresponding language for syntax highlighting
- **AND** the language mapping SHALL support at minimum: `json`, `hjson` (custom), `java`, `javascript`

#### Scenario: Read-only mode
- **WHEN** the `MonacoEditor` component receives a `readOnly` prop set to `true`
- **THEN** the editor SHALL be non-editable
- **AND** it SHALL visually indicate the read-only state (dimmed cursor, no insertion point)

#### Scenario: Initial value sync
- **WHEN** the `value` prop changes externally
- **THEN** the Monaco Editor content SHALL update to match the new value
- **AND** it SHALL NOT trigger an `onChange` callback for the programmatic update

#### Scenario: Cleanup on unmount
- **WHEN** the `MonacoEditor` component unmounts
- **THEN** it SHALL dispose the Monaco Editor instance to prevent memory leaks

### Requirement: Client-side only rendering
The MonacoEditor component SHALL only render on the client side to avoid SSR errors, since Monaco requires browser APIs.

#### Scenario: SSR environment
- **WHEN** the page is rendered on the server
- **THEN** the MonacoEditor SHALL render a loading placeholder or skeleton instead of the Monaco instance

#### Scenario: Client hydration
- **WHEN** the page hydrates on the client
- **THEN** the MonacoEditor SHALL mount the Monaco Editor instance dynamically

### Requirement: Lazy loading
The Monaco Editor bundle SHALL be lazy-loaded to prevent bloating the initial page load.

#### Scenario: Initial page load
- **WHEN** a user first loads the editor page without selecting a file
- **THEN** the Monaco Editor code SHALL NOT be downloaded

#### Scenario: First file selection
- **WHEN** a user selects a file for the first time in a session
- **THEN** the Monaco Editor code SHALL be loaded asynchronously
- **AND** a loading indicator SHALL be shown until Monaco is ready

### Requirement: File extension to language mapping
The system SHALL map file extensions to Monaco language identifiers when rendering the editor.

#### Scenario: JSON files
- **WHEN** a file with `.json` extension is opened
- **THEN** the editor SHALL use a language that supports both standard JSON and Mindustry color tags in strings
- **AND** the standard JSON features (syntax validation, bracket matching) SHALL be preserved

#### Scenario: HJSON files
- **WHEN** a file with `.hjson` extension is opened
- **THEN** the editor SHALL use the custom `hjson` language for syntax highlighting, including Mindustry color tags in strings

#### Scenario: Unknown extension
- **WHEN** a file with an unrecognized extension is opened
- **THEN** the editor SHALL use plain text mode (no syntax highlighting)

### Requirement: Editor theming
The editor SHALL respect the application's current theme (light/dark) using built-in Monaco themes.

#### Scenario: Light theme
- **WHEN** the application is in light mode
- **THEN** the editor SHALL use the `vs` (light) theme

#### Scenario: Dark theme
- **WHEN** the application is in dark mode
- **THEN** the editor SHALL use the `vs-dark` (dark) theme

### Requirement: EditorCenterPanel integration
The `EditorCenterPanel` SHALL render the `MonacoEditor` component instead of the individual `HjsonEditor` and `JsonEditor` components.

#### Scenario: mod.hjson selected
- **WHEN** `path` equals `"mod.hjson"`
- **THEN** `EditorCenterPanel` SHALL render `MonacoEditor` with language set to `hjson`

#### Scenario: content JSON file selected
- **WHEN** `path` ends with `.json` and starts with `"content"`
- **THEN** `EditorCenterPanel` SHALL render `MonacoEditor` with language set to `json`

#### Scenario: Content directory selected
- **WHEN** `path` starts with `"content"` and does not end with `.json`
- **THEN** `EditorCenterPanel` SHALL continue to render `ContentList` (unchanged behavior)

### Requirement: Removal of textarea editors
The old textarea-based editor components SHALL be removed once the MonacoEditor is fully integrated.

#### Scenario: Editor.tsx removal
- **WHEN** the MonacoEditor component is operational
- **THEN** the `Editor.tsx` generic textarea component SHALL be removed

#### Scenario: HjsonEditor.tsx removal
- **WHEN** the MonacoEditor component handles HJSON files
- **THEN** the `HjsonEditor.tsx` component SHALL be removed

#### Scenario: JsonEditor.tsx removal
- **WHEN** the MonacoEditor component handles JSON files
- **THEN** the `JsonEditor.tsx` component SHALL be removed

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
