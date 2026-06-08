## ADDED Requirements

### Requirement: Dynamic center panel content
The system SHALL render the SplitView center panel based on the currently selected file path from the `?path=` URL query parameter.

#### Scenario: No file selected
- **WHEN** the `?path=` parameter is absent, empty, or null
- **THEN** the center panel SHALL not render any content

#### Scenario: Known file selected
- **WHEN** the `?path=` value matches a known file in the project tree
- **THEN** the center panel SHALL render the corresponding editor component for that file type

#### Scenario: Unknown path selected
- **WHEN** the `?path=` value does not match any known file
- **THEN** the center panel SHALL not render any content

### Requirement: Dynamic right panel content
The system SHALL render the SplitView right (properties) panel based on the currently selected file path. When the path matches a bundle file pattern, the BundleEditorPanel SHALL be rendered instead of a placeholder or generic editor.

#### Scenario: No path selected
- **WHEN** the `?path=` parameter is absent, empty, or null
- **THEN** the right panel SHALL not render any content

#### Scenario: Path selected (non-bundle)
- **WHEN** a valid `?path=` value is present and does not match a bundle file pattern
- **THEN** the right panel SHALL render content as before (unchanged behavior)

#### Scenario: Bundle file selected
- **WHEN** the `?path=` value matches `bundles/bundle.properties` or `bundles/bundle_<locale>.properties`
- **THEN** the right panel SHALL render the BundleEditorPanel component
