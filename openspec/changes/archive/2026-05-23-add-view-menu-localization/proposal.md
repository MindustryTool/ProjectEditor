## Why

The editor toolbar currently only has Files and Export menus. Users need quick access to theme switching and language switching directly from the editor workspace, without going to the site header. A View menu provides a familiar IDE pattern for these controls, and a dedicated Localization menu sets the stage for future i18n tooling.

## What Changes

- Add `ViewMenu.tsx` component with two submenus:
  - **Change Theme** submenu with Light / Dark / Auto radio items (wires into existing theme system)
  - **Change Language** submenu with English / Tiếng Việt items (wires into existing i18n system)
- Add `LocalizationMenu.tsx` component with no menu items yet (empty placeholder with translated label)
- Add both menus to the `Toolbar` in `EditorPage.tsx` (before ExportMenu)
- Add new translation keys: `viewMenu.label`, `viewMenu.changeTheme`, `viewMenu.themeLight`, `viewMenu.themeDark`, `viewMenu.themeAuto`, `viewMenu.changeLanguage`, `localizationMenu.label`
- Add corresponding Vietnamese translations for all new keys

## Capabilities

### New Capabilities
- `view-menu`: View menu in editor toolbar with Change Theme and Change Language submenus
- `localization-menu`: Localization menu in editor toolbar (placeholder, no actionable items yet)

### Modified Capabilities

*(No existing spec-level capabilities are modified.)*

## Impact

- New files: `ViewMenu.tsx`, `LocalizationMenu.tsx` in `apps/web/src/components/editor/`
- Modified files: `EditorPage.tsx` (add to toolbar), `en/translation.json`, `vi/translation.json`
- No new dependencies; reuses existing Radix DropdownMenu, theme system, and i18n system
- No breaking changes
