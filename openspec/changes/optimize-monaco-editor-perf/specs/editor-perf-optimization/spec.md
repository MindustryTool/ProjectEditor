## ADDED Requirements

### Requirement: Editor remains responsive during fast typing
The editor SHALL remain responsive (no visible jank) when the user types continuously. Non-critical visual updates (validation markers, color decorations, color tag popover positioning) MAY be deferred to maintain input responsiveness.

#### Scenario: Fast continuous typing
- **WHEN** the user types multiple characters in rapid succession (inter-key interval < 150ms)
- **THEN** the editor SHALL update the displayed text on each keystroke without visible delay
- **THEN** validation markers and color decorations MAY update asynchronously after typing pauses

#### Scenario: Editing a large file (5000+ lines)
- **WHEN** the user types in a file with 5000+ lines
- **THEN** the editor SHALL NOT freeze or jank during character input
- **THEN** validation and decoration updates SHALL complete within 500ms of the last keystroke

### Requirement: Upstream onChange is batched during fast typing
The `onChange` callback SHALL debounce rapid value changes to avoid cascading upstream re-renders on every keystroke.

#### Scenario: Rapid value changes
- **WHEN** the editor value changes multiple times within 150ms
- **THEN** the `onChange` callback SHALL only fire once, with the final value, after the typing pause
- **THEN** intermediate values between the pause and the next burst MAY be delivered (to keep the UI feeling responsive)

### Requirement: Color tag picker stays responsive
The color tag popover SHALL track cursor position reactively without excessive computation.

#### Scenario: Cursor movement through color tags
- **WHEN** the user moves the cursor across lines containing color tags
- **THEN** the color tag picker SHALL update within 100ms of the cursor stopping
- **THEN** the editor SHALL NOT jank during cursor movement
