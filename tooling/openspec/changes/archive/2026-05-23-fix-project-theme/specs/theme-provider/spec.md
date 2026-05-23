## ADDED Requirements

### Requirement: ThemeProvider wraps app root
The system SHALL provide a `ThemeProvider` component that wraps the application root layout and manages theme state via React context.

#### Scenario: Provider renders children
- **WHEN** `ThemeProvider` is added to the root layout
- **THEN** all child components render within the theme context

#### Scenario: Provider sets default theme
- **WHEN** no theme is stored in localStorage
- **THEN** the provider defaults to `"system"` mode

### Requirement: SSR-safe theme injection via ScriptOnce
The system SHALL inject a script into the HTML head using `ScriptOnce` from `@tanstack/react-router` to set the theme class and attribute before React hydrates, preventing flash of unstyled content (FOUC).

#### Scenario: Theme applied before hydration
- **WHEN** the page is served via SSR
- **THEN** the inline script reads localStorage and sets `.dark`/`.light` class and `data-theme` attribute on `<html>` before React hydrates

#### Scenario: No JavaScript fallback
- **WHEN** JavaScript is disabled
- **THEN** the theme defaults to system preference (no class/attribute set), respecting the light-mode defaults in CSS

### Requirement: Theme persistence via localStorage
The system SHALL persist the user's theme preference in `localStorage` under the key `"theme"`.

#### Scenario: Theme saved on change
- **WHEN** user switches theme to `"dark"`
- **THEN** `localStorage.getItem("theme")` returns `"dark"`

#### Scenario: Theme restored on reload
- **WHEN** user reloads the page with `localStorage` key `"theme"` set to `"dark"`
- **THEN** the dark theme is applied on load

### Requirement: Supported theme modes
The system SHALL support three theme modes: `"light"`, `"dark"`, and `"system"` (follow OS preference).

#### Scenario: System mode follows OS
- **WHEN** theme is set to `"system"` and OS switches to dark mode
- **THEN** the UI switches to dark theme

#### Scenario: Light mode forced
- **WHEN** theme is set to `"light"`
- **THEN** the UI displays light theme regardless of OS preference

#### Scenario: Dark mode forced
- **WHEN** theme is set to `"dark"`
- **THEN** the UI displays dark theme regardless of OS preference

### Requirement: useTheme hook exposes theme and setter
The system SHALL export a `useTheme` hook that returns `{ theme, setTheme }` for consuming components.

#### Scenario: Component reads current theme
- **WHEN** a component calls `useTheme()`
- **THEN** it receives the current theme value

#### Scenario: Component sets theme
- **WHEN** a component calls `setTheme("dark")`
- **THEN** the theme updates, localStorage is written, and DOM reflects the change

### Requirement: ThemeToggle uses useTheme hook
The `ThemeToggle` component SHALL use the local `useTheme` hook instead of custom `useState`/`useEffect` logic.

#### Scenario: Toggle cycles through modes
- **WHEN** user clicks the theme toggle button
- **THEN** the theme cycles through light → dark → system → light

#### Scenario: Toggle displays current mode
- **WHEN** theme is `"dark"`
- **THEN** the toggle button shows "Dark"

### Requirement: ViewMenu uses useTheme hook
The `ViewMenu` component SHALL use the local `useTheme` hook for its theme submenu instead of duplicating theme logic.

#### Scenario: Theme submenu reflects current mode
- **WHEN** theme is `"dark"`
- **THEN** the "Dark" radio item is selected in the theme submenu

#### Scenario: Theme submenu changes theme
- **WHEN** user selects "Light" from the theme submenu
- **THEN** the theme switches to `"light"`

### Requirement: Sonner uses local useTheme
The `sonner.tsx` Toaster component SHALL use the local `useTheme` hook instead of importing from `next-themes`.

#### Scenario: Sonner receives theme prop
- **WHEN** the Toaster renders
- **THEN** it passes the resolved theme (`"light"`, `"dark"`, or `"system"`) to the Sonner component

### Requirement: DOM class and data-theme attribute
The system SHALL set both `.dark`/`.light` CSS classes and `data-theme` attribute on `<html>` to maintain compatibility with existing CSS variable overrides and Tailwind dark variant.

#### Scenario: Dark mode sets both
- **WHEN** theme is `"dark"`
- **THEN** `<html>` has class `dark` and attribute `data-theme="dark"`

#### Scenario: System mode removes data-theme even in dark
- **WHEN** theme is `"system"` and OS prefers dark
- **THEN** `<html>` has class `dark`, `data-theme` is removed, and `colorScheme` is `dark`

#### Scenario: System mode removes data-theme in light
- **WHEN** theme is `"system"` and OS prefers light
- **THEN** `<html>` has class `light`, `data-theme` is removed, and `colorScheme` is `light`

#### Scenario: Light mode sets data-theme
- **WHEN** theme is `"light"`
- **THEN** `<html>` has class `light`, `data-theme="light"`, and `colorScheme` is `light`
