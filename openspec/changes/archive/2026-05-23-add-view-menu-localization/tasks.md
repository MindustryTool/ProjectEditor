## 1. Translation Keys

- [x] 1.1 Add English translation keys for View menu (viewMenu.label, viewMenu.changeTheme, viewMenu.themeLight, viewMenu.themeDark, viewMenu.themeAuto, viewMenu.changeLanguage)
- [x] 1.2 Add Vietnamese translation keys for View menu
- [x] 1.3 Add English translation key for Localization menu (localizationMenu.label)
- [x] 1.4 Add Vietnamese translation key for Localization menu

## 2. View Menu Component

- [x] 2.1 Create `ViewMenu.tsx` in `apps/web/src/components/editor/` following FilesMenu/ExportMenu pattern
- [x] 2.2 Add Change Theme submenu with DropdownMenuRadioGroup for Light/Dark/Auto
- [x] 2.3 Wire theme submenu to existing theme system (localStorage + applyThemeMode)
- [x] 2.4 Add Change Language submenu with items for English and Tiếng Việt
- [x] 2.5 Wire language submenu to i18n.changeLanguage()
- [x] 3.1 Create `LocalizationMenu.tsx` in `apps/web/src/components/editor/` with empty dropdown content
- [x] 3.2 Add translated label as trigger button text

## 4. Integration

- [x] 4.1 Import and add ViewMenu and LocalizationMenu to EditorPage.tsx toolbar
- [x] 4.2 Add exports to editor components index.ts
- [x] 4.3 Verify both menus render correctly and theme/language switching works
