## 1. Route Restructuring

- [x] 1.1 Rename route files: move `index.tsx`, `about.tsx`, `editor.tsx` into `$lang/` directory
- [x] 1.2 Update route path declarations in each file to use `/$lang/` prefix
- [x] 1.3 Add `beforeLoad` to `$lang` layout route that validates locale param and calls `i18n.changeLanguage()`
- [x] 1.4 Add catch-all bare path redirect to detected locale

## 2. i18n Initialization

- [x] 2.1 Update `i18n.ts` to configure URL path language detection via `i18next-browser-languagedetector`
- [x] 2.2 Ensure SSR reads locale from URL param before rendering

## 3. Dynamic HTML lang

- [x] 3.1 Make `<html lang>` attribute dynamic from route context/location

## 4. Language Switcher Updates

- [x] 4.1 Update `LocalePicker.tsx` to navigate to new URL prefix instead of calling `changeLanguage()`
- [x] 4.2 Update `ViewMenu.tsx` language submenu to navigate to new URL prefix
