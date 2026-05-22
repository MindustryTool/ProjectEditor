## ADDED Requirements

### Requirement: Editor panels react to file selection
The EditorPage layout SHALL react to the selected file path and show or hide the center and right panels accordingly.

#### Scenario: Panels hidden when no file selected
- **WHEN** no file is selected in the file explorer (`?path=` is absent)
- **THEN** the SplitView SHALL render only the left (explorer) panel; center and right panels SHALL not be visible

#### Scenario: Panels shown when file selected
- **WHEN** a known file path is selected
- **THEN** the center panel SHALL show the appropriate editor and the right panel SHALL show properties
