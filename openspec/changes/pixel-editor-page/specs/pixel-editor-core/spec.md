## ADDED Requirements

### Requirement: PixelDocument root model
The system SHALL maintain a `PixelDocument` as the root model wrapping a `PixelCanvas`, owning document metadata and auto-save state.

#### Scenario: Document created
- **WHEN** a new canvas is created or a PNG is opened
- **THEN** the system SHALL create a `PixelDocument` containing the `PixelCanvas`, file path (if any), a dirty flag, and an auto-save timer

#### Scenario: Document metadata
- **WHEN** a document is opened
- **THEN** the system SHALL store width, height, file path, and creation timestamp

### Requirement: Canvas pixel data model
The system SHALL maintain a pixel data model where each canvas stores width, height, and an array of layers, each layer containing a `Uint8ClampedArray` of RGBA pixel data sized `width * height * 4`.

#### Scenario: New canvas created
- **WHEN** the user creates a new canvas
- **THEN** the system SHALL initialize a transparent pixel buffer of the specified dimensions
- **AND** the canvas SHALL have at least one default layer

#### Scenario: Canvas dimensions stored
- **WHEN** a canvas is created or opened
- **THEN** the system SHALL store the width and height as integers

### Requirement: Persistent rendering objects
The system SHALL create the hidden canvas, its 2D context, and the Konva.Image **once** and reuse them for the entire editor session. No object recreation during drawing.

#### Scenario: Hidden canvas created once
- **WHEN** the pixel editor initializes
- **THEN** a hidden `<canvas>` element SHALL be created
- **AND** it SHALL NOT be recreated during drawing operations

#### Scenario: ImageData not recreated during strokes
- **WHEN** the user draws a stroke
- **THEN** the system SHALL NOT create new `ImageData` objects
- **AND** SHALL reuse the existing `ImageData` by writing directly to its buffer

### Requirement: Dirty-region rendering
The system SHALL track dirty (changed) rectangles during drawing and only composite/redraw those regions, not the full canvas.

#### Scenario: Track dirty region
- **WHEN** a pixel is modified during a stroke
- **THEN** the affected rectangle (pixel position, 1×1 for single pixel, larger for brush) SHALL be added to a set of dirty rectangles

#### Scenario: Composite only dirty regions
- **WHEN** the render frame executes
- **THEN** only the dirty regions SHALL be composited onto the hidden canvas
- **AND** the composited output SHALL be limited to those regions

### Requirement: RAF-batched rendering
The system SHALL batch rendering updates using `requestAnimationFrame` instead of rendering on every pointer event.

#### Scenario: RAF schedules render
- **WHEN** a pointer event modifies pixels
- **THEN** the system SHALL NOT render immediately
- **AND** SHALL schedule a `requestAnimationFrame` callback if one is not already pending

#### Scenario: RAF composites and updates
- **WHEN** the `requestAnimationFrame` callback fires
- **THEN** dirty regions SHALL be composited
- **AND** the Konva layer SHALL be updated via `batchDraw()`
- **AND** the dirty region set SHALL be cleared

### Requirement: Image smoothing disabled
The system SHALL disable image smoothing on all canvases to ensure pixel art renders with crisp nearest-neighbor scaling.

#### Scenario: Smoothing off on hidden canvas
- **WHEN** the hidden canvas context is created
- **THEN** `ctx.imageSmoothingEnabled` SHALL be set to `false`

#### Scenario: Smoothing off on Konva image
- **WHEN** the Konva.Image is configured
- **THEN** its `imageSmoothingEnabled` prop SHALL be `false`

### Requirement: Open PNG file
The system SHALL read a `.png` file from the project filesystem and decode it into the pixel data model, supporting all valid PNG color types (grayscale, RGB, RGBA, indexed).

#### Scenario: Open existing PNG
- **WHEN** the user selects a `.png` file in the file explorer
- **THEN** the system SHALL decode the PNG into RGBA pixel data
- **AND** create a single layer with the decoded pixel data
- **AND** display the canvas in the pixel editor

#### Scenario: Open non-PNG file
- **WHEN** the user selects a non-`.png` file
- **THEN** the system SHALL NOT open the pixel editor

### Requirement: Save PNG file
The system SHALL encode the current canvas state (all visible layers composited) into PNG format and write it to the project filesystem via `useFile(path).write()`.

#### Scenario: Save via Ctrl+S
- **WHEN** the user presses Ctrl+S while the pixel editor is active
- **THEN** the system SHALL composite all visible layers into a single RGBA image
- **AND** encode as PNG
- **AND** write to the current file path

#### Scenario: Save As
- **WHEN** the user triggers "Save As"
- **THEN** the system SHALL prompt for a new filename
- **AND** write the PNG to the specified path

### Requirement: New canvas from preset
The system SHALL provide preset canvas sizes (16x16, 32x32, 64x64, 128x128, 256x256, 512x512) and custom dimensions when creating a new canvas.

#### Scenario: Pick preset size
- **WHEN** the user selects a preset size from the new canvas dialog
- **THEN** the system SHALL create a canvas with those exact dimensions

#### Scenario: Custom size
- **WHEN** the user enters custom width and height
- **THEN** the system SHALL create a canvas with the specified dimensions
- **AND** the dimensions SHALL be clamped between 1 and 1024

### Requirement: New canvas from clipboard
The system SHALL read an image from the system clipboard and use it as the initial canvas content.

#### Scenario: Paste as new canvas
- **WHEN** the user triggers "New from Clipboard"
- **THEN** the system SHALL read the clipboard image data
- **AND** create a new canvas with the image dimensions and pixel data

### Requirement: New canvas from image
The system SHALL allow importing an image file from the local filesystem (not project files) to create a new canvas.

#### Scenario: Import image file
- **WHEN** the user selects "New from Image" and picks a file
- **THEN** the system SHALL decode the image into RGBA pixel data
- **AND** create a new canvas

### Requirement: Export PNG
The system SHALL allow exporting the current canvas as a standalone PNG file download.

#### Scenario: Export dialog
- **WHEN** the user triggers "Export PNG"
- **THEN** the system SHALL composite all visible layers
- **AND** trigger a browser download of the resulting PNG file

### Requirement: Auto-save
The system SHALL automatically save the current canvas to the project filesystem after a period of inactivity following changes.

#### Scenario: Auto-save triggers
- **WHEN** the user makes edits and stops interacting for 1 second
- **THEN** the system SHALL write the current canvas state to the project file

#### Scenario: No auto-save without changes
- **WHEN** no edits have been made since the last save
- **THEN** the system SHALL NOT trigger auto-save

### Requirement: Version history (in-memory)
The system SHALL maintain a lightweight in-memory version history for reverting to previous states within the current session.

#### Scenario: Version recorded on auto-save
- **WHEN** auto-save triggers
- **THEN** a version entry with a timestamp SHALL be recorded in the document

#### Scenario: Revert to version
- **WHEN** the user reverts to a previous version
- **THEN** the canvas state SHALL be restored to that version's snapshot

### Requirement: Companion metadata file
The system SHALL persist a companion file alongside each `.png` image file, using a configurable suffix extension (default: `.png.meta`), to store editor state that cannot be embedded in the PNG format.

#### Scenario: Companion file created on save
- **WHEN** the user saves the canvas (Ctrl+S, auto-save, or Save As)
- **THEN** the system SHALL write a companion JSON file at `<image-path>.png.meta`
- **AND** the companion file SHALL contain: full layer data (all layers with id, name, pixel data encoded as base64, visible, opacity, blendMode, locked), undo/redo history stack (each entry being a named region snapshot), and UI config state

#### Scenario: Companion file loaded on open
- **WHEN** a `.png` file is opened
- **THEN** the system SHALL check if `<image-path>.png.meta` exists
- **AND** IF it exists, the system SHALL restore layers, history, and UI config from the companion file
- **AND** IF it does NOT exist, the system SHALL fall back to current behavior (single layer from PNG, default UI state, empty history)

#### Scenario: Companion file structure
- **WHEN** the companion file is written
- **THEN** its JSON structure SHALL be:
  ```json
  {
    "version": 1,
    "layers": [
      {
        "id": "layer-1-123456",
        "name": "Layer 1",
        "data": "<base64-encoded pixel data>",
        "visible": true,
        "opacity": 1.0,
        "blendMode": "normal",
        "locked": false
      }
    ],
    "history": {
      "undoStack": [
        { "name": "Draw", "snapshot": "<base64-region-data>" }
      ],
      "redoStack": []
    },
    "uiConfig": {
      "foregroundColor": "#ff0000ff",
      "backgroundColor": "#ffffffff",
      "tool": "pencil",
      "brushSize": 1,
      "brushOpacity": 1,
      "tolerance": 32,
      "sprayDensity": 0.5,
      "sprayRadius": 10,
      "pixelPerfect": false,
      "symmetry": "none",
      "symmetrySegments": 4,
      "gridVisible": false,
      "checkerboardVisible": true,
      "currentLayerIndex": 0
    }
  }
  ```

#### Scenario: Version migration
- **WHEN** the companion file has an older `version`
- **THEN** the system SHALL attempt to migrate to the current schema version
- **AND** IF migration fails or the version is unknown, the system SHALL ignore the companion file and fall back to default state

#### Scenario: No history persistence
- **WHEN** the companion file is loaded
- **THEN** the redo stack SHALL be cleared
- **AND** the undo stack SHALL be truncated to the last 50 entries (configurable max)
- **RATIONALE**: Full history persistence would significantly grow file size and isn't needed across sessions — only enough undo capacity for immediate session recovery
