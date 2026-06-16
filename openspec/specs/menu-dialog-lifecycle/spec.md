## ADDED Requirements

### Requirement: Dialogs opened from menu buttons survive parent menu changes
The system SHALL NOT close a parent menu (Sheet or DropdownMenu) when a button that opens a dialog is clicked. The dialog SHALL remain open independently of the parent menu's lifecycle.

#### Scenario: Dialog opened from menu stays open after menu close
- **WHEN** user clicks a button in the menu that opens a dialog
- **THEN** the dialog SHALL open
- **THEN** the parent menu SHALL NOT close
- **WHEN** the user completes or cancels the dialog
- **THEN** the parent menu MAY close at the dialog's discretion

#### Scenario: Click-away on dialog overlay does not close parent menu
- **WHEN** a dialog is open and the user clicks the dialog overlay
- **THEN** the dialog SHALL close
- **THEN** the parent menu SHALL remain open

### Requirement: Event propagation stopped on menu buttons
All interactive elements inside menu content components SHALL call `event.stopPropagation()` on click handlers to prevent events from reaching parent overlay handlers.

#### Scenario: Button click does not bubble to parent overlay
- **WHEN** user clicks any button inside the menu
- **THEN** the click event SHALL NOT propagate to parent Sheet or DropdownMenu overlay handlers
