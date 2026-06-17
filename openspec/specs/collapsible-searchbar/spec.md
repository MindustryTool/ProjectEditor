## ADDED Requirements

### Requirement: Collapsible search icon
The system SHALL display a search icon button in the fields renderer header, positioned before the filename breadcrumb, instead of an always-visible search input.

#### Scenario: Icon shown only when entries > 10
- **WHEN** the fields renderer has more than 10 entries
- **THEN** a search icon SHALL be displayed before the filename breadcrumb

#### Scenario: Icon hidden when entries <= 10
- **WHEN** the fields renderer has 10 or fewer entries
- **THEN** no search icon SHALL be displayed

### Requirement: Expand on click with autoFocus
Clicking the search icon SHALL expand it into a full text input and autoFocus the input.

#### Scenario: Click expands search
- **WHEN** user clicks the search icon
- **THEN** the search icon SHALL transition to a full text input, and the input SHALL receive focus

#### Scenario: AutoFocus behavior
- **WHEN** the search input expands
- **THEN** the cursor SHALL appear in the input field ready for typing

### Requirement: Collapse on blur when empty
The expanded search input SHALL collapse back to icon-only when it loses focus and the content is empty.

#### Scenario: Collapse on blur with empty content
- **WHEN** the search input is expanded, its filter text is empty, and the input loses focus
- **THEN** the input SHALL collapse back to icon-only state

#### Scenario: Stays open on blur with content
- **WHEN** the search input is expanded with non-empty filter text, and the input loses focus
- **THEN** the input SHALL remain expanded

### Requirement: Maintain existing filtering
The expanded search input SHALL use the same filtering logic (levenshtein match, filter state) as the current search bar.

#### Scenario: Filter still works
- **WHEN** user types in the expanded search input
- **THEN** entries SHALL be filtered using the existing levenshtein-based matching
