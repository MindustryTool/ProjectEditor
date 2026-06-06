## ADDED Requirements

### Requirement: Single floating dropdown anchored at trigger position

The file explorer SHALL render exactly one `<DropdownMenu>` that opens at the `currentTarget` position of the clicked More Actions button, replacing the per-row `<DropdownMenu>` approach.

#### Scenario: Dropdown opens at button position

- **WHEN** user clicks the More Actions button (`⋮`) on a `TreeNodeRow`
- **THEN** a single dropdown appears at the right edge of the clicked button, offset below the button top by the button's height
- **AND** no other dropdowns are rendered in the DOM

#### Scenario: Dropdown closes on outside click

- **WHEN** user clicks anywhere outside the open dropdown
- **THEN** the dropdown closes

#### Scenario: Dropdown closes on scroll

- **WHEN** user scrolls the file explorer while the dropdown is open
- **THEN** the dropdown closes

#### Scenario: Dropdown repositions on new trigger click

- **WHEN** user clicks a different row's More Actions button while a dropdown is already open
- **THEN** the dropdown closes and reopens at the new button's position

### Requirement: TreeNodeRow emits anchor rect via callback

`TreeNodeRow` SHALL call an `onContextMenu(path: string, rect: DOMRect)` prop when its More Actions button is clicked, instead of opening its own `<DropdownMenu>`.

#### Scenario: onContextMenu called with correct rect

- **WHEN** user clicks the More Actions button on a `TreeNodeRow`
- **THEN** `onContextMenu` is called with the row's `currentPath` and the `getBoundingClientRect()` of the clicked button element

#### Scenario: onContextMenu is stable reference

- **WHEN** `TreeNodeRow` receives a new node prop
- **THEN** the `onContextMenu` callback reference does not change (wrapped in `useCallback` at parent level)

### Requirement: Dropdown menu items call original handlers

The dropdown SHALL include Rename and Delete actions that invoke the same handlers (`handleRenameClick`, `handleDeleteClick`) as the current implementation.

#### Scenario: Rename propagates to editing state

- **WHEN** user clicks Rename in the floating dropdown
- **THEN** the tree node enters editing mode (same as current behavior)

#### Scenario: Delete opens confirmation dialog

- **WHEN** user clicks Delete in the floating dropdown
- **THEN** the Delete confirmation dialog opens (same as current behavior)
