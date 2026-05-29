## Requirements

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

### Requirement: Action overlay uses backdrop blur
The icon-only action buttons overlaid on the sprite preview SHALL use `backdrop-blur-sm` with a semi-transparent background (`bg-background/60`) to ensure readability against any sprite image.

#### Scenario: Backdrop blur applied to overlay
- **WHEN** the action overlay is rendered on top of the sprite preview
- **THEN** it applies `backdrop-blur-sm` and `bg-background/60` CSS classes

### Requirement: Action buttons are icon-only
The Replace and Remove action buttons SHALL display only icons (no text labels) and use `aria-label` for accessibility.

#### Scenario: Replace uses Upload icon
- **WHEN** the Replace action button is rendered
- **THEN** it displays the Upload icon from lucide-react and has `aria-label="Replace sprite"`

#### Scenario: Remove uses Trash2 icon
- **WHEN** the Remove action button is rendered
- **THEN** it displays the Trash2 icon from lucide-react and has `aria-label="Remove sprite"`

### Requirement: resolveContentSprite resolves sprite path from JSON content path
The helper function `resolveContentSprite(path: string): string | null` SHALL derive a sprite image path from a content JSON file path.

#### Scenario: Valid content JSON path
- **WHEN** given a path like `content/items/copper.json`
- **THEN** it returns `sprites/copper.png`

#### Scenario: Non-content path returns null
- **WHEN** given a path like `mod.hjson` or `content/foo.txt`
- **THEN** it returns `null`

#### Scenario: No subpath after content/ returns null
- **WHEN** given a path like `content/` or `content`
- **THEN** it returns `null`

### Requirement: Helper is exported from ~/lib/utils
The function SHALL be exported from `~/lib/utils` for reuse across the codebase.

#### Scenario: Importable from utils
- **WHEN** another module imports `resolveContentSprite` from `~/lib/utils`
- **THEN** the function is available and callable
