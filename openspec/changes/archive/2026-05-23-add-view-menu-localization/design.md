## Context

The editor toolbar (`Toolbar.tsx`) currently contains `FilesMenu` and `ExportMenu`. Theme toggling and language switching exist only in the site `Header` component via `ThemeToggle` (cycle button) and `LocalePicker` (Radix dropdown). Users working in the editor must leave the workspace to change these settings. This design brings those controls into the toolbar under a View menu, following IDE conventions, and adds a Localization menu as a placeholder for future translation tooling.

## Goals / Non-Goals

**Goals:**
- Add a View dropdown menu to the editor toolbar with Change Theme (submenu) and Change Language (submenu)
- Add a Localization dropdown menu as a placeholder (no items, just a label)
- Reuse existing theme and i18n infrastructure — no new state or dependencies
- Follow the exact component pattern established by FilesMenu and ExportMenu

**Non-Goals:**
- No changes to the existing ThemeToggle or LocalePicker components in Header
- No new theme modes or language locales beyond current (light/dark/auto, en/vi)
- No actual localization editor or translation features — just the placeholder menu

## Decisions

1. **Submenus over inline items** — Theme and Language items open nested submenus (`DropdownMenuSub`) rather than switching on click. This avoids clutter and matches the familiar multi-level menu pattern in editors like VS Code.
2. **Radio group for theme** — `DropdownMenuRadioGroup` with three radio items (Light/Dark/Auto) instead of a cycle button. This gives immediate visual feedback of the current selection and is more discoverable.
3. **Reuse existing theme persistence** — The View menu's theme submenu reads and writes `localStorage` key `"theme"` and calls `applyThemeMode()` directly (extracted from ThemeToggle). No new state management.
4. **Reuse existing i18n API** — Language submenu calls `i18n.changeLanguage()` directly, same as LocalePicker. No new state management.
5. **Separate LocalizationMenu component** — Even though it has no items yet, a dedicated component makes it easy to add items later. Keeps ViewMenu focused on view-related controls only.

## Risks / Trade-offs

- [Duplication of theme/locale controls] → Both Header and toolbar will have theme/language controls. This is intentional — the editor workspace needs self-contained access. Users in the editor may never visit the home page.
- [Empty LocalizationMenu looks odd] → The menu trigger shows the label with no items. This is deliberate as a scaffold for future work. The menu opens to an empty content area (just padding), or could show a disabled "Coming soon" item if needed during implementation.
