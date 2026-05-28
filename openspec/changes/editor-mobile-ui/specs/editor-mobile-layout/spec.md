## ADDED Requirements

### Requirement: Responsive layout switch
The EditorShell SHALL detect viewport width and render the mobile layout when width is strictly less than 1024px, and the desktop layout when width is 1024px or greater.

#### Scenario: Desktop layout above threshold
- **WHEN** viewport width is >= 1024px
- **THEN** EditorShell renders the existing desktop SplitView layout with Toolbar, EditorLeftPanel, EditorCenterPanel, EditorRightPanel, and StatusBar

#### Scenario: Mobile layout below threshold
- **WHEN** viewport width is < 1024px
- **THEN** EditorShell renders the mobile layout with Toolbar at top, Tabs for panel switching with trigger at bottom, and StatusBar at bottom

### Requirement: Mobile layout structure
The mobile layout SHALL consist of: Toolbar at the top, a main content area with Tabs switching between EditorCenterPanel and EditorRightPanel (TabsTrigger at bottom), a Sheet on the left side containing FileExplorer, and StatusBar at the bottom.

#### Scenario: Mobile layout renders toolbar
- **WHEN** mobile layout is active
- **THEN** the Toolbar is rendered at the top with all existing toolbar menus (ProjectMenu, ViewMenu, ExportMenu, LocalizationMenu)

#### Scenario: Mobile file explorer via Sheet
- **WHEN** user taps a file explorer trigger/button in the mobile toolbar
- **THEN** a Sheet slides in from the left containing the FileExplorer component
- **WHEN** user taps the overlay or closes the Sheet
- **THEN** the Sheet closes and the editor content remains visible

#### Scenario: Mobile panel switching via Tabs
- **WHEN** mobile layout is active
- **THEN** the main content area shows Tabs with EditorCenterPanel and EditorRightPanel as tab content
- **WHEN** user taps the bottom TabsTrigger
- **THEN** the corresponding panel is displayed

#### Scenario: Mobile status bar
- **WHEN** mobile layout is active
- **THEN** the StatusBar is rendered at the bottom with StatusBarLeft, StatusBarCenter, and StatusBarRight

### Requirement: Lazy loading of mobile components
Mobile-specific layout components SHALL be lazy-loaded using React.lazy to prevent increasing the desktop bundle size.

#### Scenario: Mobile code not loaded on desktop
- **WHEN** the desktop layout is active
- **THEN** mobile component bundles are not loaded

#### Scenario: Mobile code loaded on demand
- **WHEN** the mobile layout first becomes active
- **THEN** mobile component bundles are loaded lazily via a Suspense boundary
