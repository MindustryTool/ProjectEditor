## ADDED Requirements

### Requirement: SpritePicker resolves sprite path from content JSON path
The `SpritePicker` SHALL derive the sprite file path by calling `resolveContentSprite(contentPath)` where `contentPath` is the prop passed to the component.

#### Scenario: Derives sprite path
- **WHEN** `SpritePicker` receives `path="content/items/copper.json"`
- **THEN** it computes `sprites/copper.png` via `resolveContentSprite`

### Requirement: SpritePicker renders existing sprite
When the resolved sprite file exists in the project tree, `SpritePicker` SHALL render the sprite image.

#### Scenario: Renders sprite when file exists
- **WHEN** `sprites/copper.png` exists in the project tree
- **THEN** `SpritePicker` displays an `<img>` element showing the sprite

#### Scenario: Uses project filesystem to read binary data
- **WHEN** rendering the sprite
- **THEN** `SpritePicker` reads the sprite file via `ProjectFileSystem.readFile()` and creates an object URL for the `<img>` element

### Requirement: SpritePicker shows upload prompt when no sprite exists
When the resolved sprite file does NOT exist in the project tree, `SpritePicker` SHALL show a button/prompt to upload a `.png` file.

#### Scenario: Shows upload button when sprite missing
- **WHEN** `sprites/copper.png` does not exist in the project tree
- **THEN** `SpritePicker` displays an upload prompt with a file input accepting `.png` files

### Requirement: SpritePicker writes uploaded PNG to sprite path
When the user selects a `.png` file via the upload input, `SpritePicker` SHALL write the file content to the resolved sprite path using `ProjectFileSystem.writeFile()`.

#### Scenario: Writes PNG on upload
- **WHEN** user picks a `.png` file
- **THEN** `SpritePicker` reads the file as `ArrayBuffer` and writes it to the sprite path via `ProjectFileSystem.writeFile()`
- **AND** the sprite image is displayed after saving

### Requirement: SpritePicker allows replacing existing sprite
When a sprite already exists, `SpritePicker` SHALL provide a way to replace it with a different `.png` file.

#### Scenario: Replace button triggers file picker
- **WHEN** user clicks "Replace" on an existing sprite
- **THEN** a file picker for `.png` files opens
- **AND** after selecting a file, the sprite is overwritten with the new content

### Requirement: SpritePicker allows removing sprite
When a sprite already exists, `SpritePicker` SHALL provide a way to delete the sprite file.

#### Scenario: Remove button deletes sprite
- **WHEN** user clicks "Remove" on an existing sprite
- **THEN** `SpritePicker` calls `ProjectFileSystem.delete()` on the sprite path
- **AND** the upload prompt is shown again since the sprite no longer exists
