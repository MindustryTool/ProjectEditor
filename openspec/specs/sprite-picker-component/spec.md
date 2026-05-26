## ADDED Requirements

### Requirement: SpritePicker resolves sprite path from content JSON path
The `SpritePicker` SHALL derive the sprite file path by calling `resolveContentSprite(contentPath)` where `contentPath` is the prop passed to the component.

#### Scenario: Derives sprite path
- **WHEN** `SpritePicker` receives `path="content/items/copper.json"`
- **THEN** it computes `sprites/copper.png` via `resolveContentSprite`

### Requirement: SpritePicker renders existing sprite
When the resolved sprite file exists in the project tree, `SpritePicker` SHALL render the sprite image with action icons overlaid on the preview.

#### Scenario: Renders sprite when file exists
- **WHEN** `sprites/copper.png` exists in the project tree
- **THEN** `SpritePicker` displays an `<img>` element showing the sprite

#### Scenario: Uses project filesystem to read binary data
- **WHEN** rendering the sprite
- **THEN** `SpritePicker` reads the sprite file via `ProjectFileSystem.readFile()` and creates an object URL for the `<img>` element

#### Scenario: Action icons overlaid on sprite preview
- **WHEN** sprite image is displayed
- **THEN** Replace and Remove icon-only buttons are shown overlaid on the bottom-right of the sprite preview
- **AND** the overlay has `backdrop-blur-sm` and semi-transparent background for readability

### Requirement: SpritePicker shows upload prompt when no sprite exists
When the resolved sprite file does NOT exist in the project tree, `SpritePicker` SHALL show a form field layout using `<FormField>`, `<FormLabel>`, and `<FormControl>` with a button to upload a `.png` file.

#### Scenario: Shows upload button when sprite missing
- **WHEN** `sprites/copper.png` does not exist in the project tree
- **THEN** `SpritePicker` displays a `<FormField>` with `<FormLabel>` and `<FormControl>` containing an upload button

### Requirement: SpritePicker writes uploaded PNG to sprite path
When the user selects a `.png` file via the upload input, `SpritePicker` SHALL write the file content to the resolved sprite path using `ProjectFileSystem.writeFile()`.

#### Scenario: Writes PNG on upload
- **WHEN** user picks a `.png` file
- **THEN** `SpritePicker` reads the file as `ArrayBuffer` and writes it to the sprite path via `ProjectFileSystem.writeFile()`
- **AND** the sprite image is displayed after saving

### Requirement: SpritePicker allows replacing existing sprite
When a sprite already exists, `SpritePicker` SHALL provide an icon-only Replace button overlaid on the sprite preview to replace it with a different `.png` file.

#### Scenario: Replace icon button triggers file picker
- **WHEN** user clicks the Replace icon button overlaid on the sprite preview
- **THEN** a file picker for `.png` files opens
- **AND** after selecting a file, the sprite is overwritten with the new content

### Requirement: SpritePicker allows removing sprite
When a sprite already exists, `SpritePicker` SHALL provide an icon-only Remove button overlaid on the sprite preview to delete the sprite file.

#### Scenario: Remove icon button deletes sprite
- **WHEN** user clicks the Remove icon button overlaid on the sprite preview
- **THEN** `SpritePicker` calls `ProjectFileSystem.delete()` on the sprite path
- **AND** the upload prompt is shown again since the sprite no longer exists
