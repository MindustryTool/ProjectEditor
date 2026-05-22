## Why

The app currently has all UI text hardcoded in English. Adding internationalization (i18n) enables translation into other languages, making the tool accessible to non-English speakers — critical for a global Mindustry modding community.

## What Changes

- Add i18n framework with locale JSON files, translation loading, and runtime switching
- Add locale picker UI in the header for switching languages
- Extract all hardcoded UI strings into translation keys across existing components
- Add English and Vietnamese locale files as starter translations
- Auto-detect browser language on first visit

## Capabilities

### New Capabilities
- `i18n-core`: Translation loading, locale switching, string interpolation, and pluralization
- `i18n-locale-picker`: Dropdown or toggle UI for selecting display language

### Modified Capabilities

- `editor-layout`: Editor page components need translated strings wired up
- `toolbar-menus`: Menu item labels need to use translation keys
- `status-bar`: Status text needs to be translatable

## Impact

- New dependency: `react-i18next` (or a lightweight alternative)
- New directory: `apps/web/src/i18n/` with locales and config
- All UI components touched to replace string literals with `t()` calls
- No backend/data layer changes
