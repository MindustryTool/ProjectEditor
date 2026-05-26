## ADDED Requirements

### Requirement: ContentList renders items in a responsive grid
The ContentList component SHALL render directory entries in a CSS grid layout with responsive column sizing (minimum card width ~120px).

#### Scenario: Default grid rendering
- **WHEN** ContentList receives a path to a content directory with multiple files
- **THEN** each file/folder is rendered as a card in a CSS grid

### Requirement: File cards show name and icon
Each file card SHALL display the file/folder name and a file-type icon (default file icon for unknown files, folder icon for directories).

#### Scenario: File card appearance
- **WHEN** the entry is a file
- **THEN** the card displays a default file icon and the file name

#### Scenario: Folder card appearance
- **WHEN** the entry is a directory
- **THEN** the card displays a folder icon and the folder name

### Requirement: JSON file cards attempt sprite preview
For entries ending in `.json`, the card SHALL attempt to load a sprite image from the corresponding path under `sprites/`. If the image fails to load, it SHALL fall back to the default file icon.

#### Scenario: Sprite loads successfully
- **WHEN** the entry is a `.json` file and a corresponding sprite exists
- **THEN** the card displays the sprite image as preview

#### Scenario: Sprite fails to load
- **WHEN** the entry is a `.json` file and the sprite image fails to load (404/error)
- **THEN** the card hides the broken image and shows the default file icon

### Requirement: Folder click navigates via query param
Clicking a folder card SHALL update the `path` URL query parameter to the folder's path, navigating into it.

#### Scenario: Click folder
- **WHEN** user clicks a folder card
- **THEN** the `path` query parameter is updated to the folder's path, and the center panel re-renders to show the folder contents

### Requirement: File click navigates via query param
Clicking a file card SHALL update the `path` URL query parameter to the file's path, opening it in the editor.

#### Scenario: Click file
- **WHEN** user clicks a file card
- **THEN** the `path` query parameter is updated to the file's path, and the center panel re-renders to show the file in Monaco editor

### Requirement: CreateNewContentDialog appears as a grid card
The CreateNewContentDialog trigger SHALL be rendered as a card inside the grid, visually consistent with file/folder cards, showing a "+" icon and "New" label.

#### Scenario: New content card in grid
- **WHEN** ContentList renders the grid
- **THEN** the CreateNewContentDialog trigger appears as a card with a "+" icon at the start of the grid
