## 1. Setup Dependencies

- [x] 1.1 Install `i18next`, `react-i18next`, `i18next-browser-languagedetector`

## 2. Create i18n Infrastructure

- [x] 2.1 Create `apps/web/src/i18n/i18n.ts` with i18next init, locale detection, and fallback config
- [x] 2.2 Create `apps/web/src/i18n/locales/en/translation.json` with English strings
- [x] 2.3 Create `apps/web/src/i18n/locales/vi/translation.json` with Vietnamese strings
- [x] 2.4 Import and initialize i18n in the app entry point

## 3. Wire Translation Keys to Components

- [x] 3.1 Replace hardcoded text in FilesMenu with `t()` calls
- [x] 3.2 Replace hardcoded text in ExportMenu with `t()` calls
- [x] 3.3 Replace hardcoded text in StatusBar with `t()` calls
- [x] 3.4 Replace hardcoded text in EditorPage with `t()` calls

## 4. Add Language Picker

- [x] 4.1 Create LocalePicker component in `apps/web/src/components/`
- [x] 4.2 Mount LocalePicker in the app Header

## 5. Verify

- [x] 5.1 Run typecheck to ensure no errors
- [x] 5.2 Verify locale switching works at runtime
- [x] 5.3 Verify browser language auto-detection on first visit
