## ADDED Requirements

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
