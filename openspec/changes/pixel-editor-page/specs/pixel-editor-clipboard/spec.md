## ADDED Requirements

### Requirement: Cut
The system SHALL cut selected pixels to the clipboard and clear them from the canvas.

#### Scenario: Cut selection
- **WHEN** the user triggers "Cut" (Ctrl+X) with an active selection
- **THEN** the selected pixels SHALL be copied to an internal clipboard buffer
- **AND** the selected area SHALL be cleared to transparency

### Requirement: Copy
The system SHALL copy selected pixels to the clipboard.

#### Scenario: Copy selection
- **WHEN** the user triggers "Copy" (Ctrl+C) with an active selection
- **THEN** the selected pixels SHALL be copied to an internal clipboard buffer
- **AND** the canvas SHALL NOT be modified

#### Scenario: Copy without selection
- **WHEN** the user triggers "Copy" without an active selection
- **THEN** the active layer SHALL be copied in its entirety

### Requirement: Paste
The system SHALL paste clipboard contents onto the canvas.

#### Scenario: Paste clipboard
- **WHEN** the user triggers "Paste" (Ctrl+V) and the clipboard has pixel data
- **THEN** the clipboard content SHALL appear as a floating selection at the cursor position

#### Scenario: Paste in place
- **WHEN** the user triggers "Paste in Place"
- **THEN** the clipboard content SHALL be pasted at its original coordinates (from where it was copied)

#### Scenario: Paste as new layer
- **WHEN** the user triggers "Paste as New Layer"
- **THEN** a new layer SHALL be created with the clipboard pixel data
