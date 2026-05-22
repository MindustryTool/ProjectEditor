## Context

The app is a React SPA with all UI text hardcoded in English. We need to support multiple languages without a server. The target audiences are English and Vietnamese speakers initially.

## Goals / Non-Goals

**Goals:**
- Add `react-i18next` with `i18next` as the i18n framework
- Store translations as JSON files under `apps/web/src/i18n/locales/`
- Auto-detect browser language, fall back to English
- Wire all existing UI text through `useTranslation` / `t()` calls
- Add a language picker in the header

**Non-Goals:**
- Server-side translations (fully client-side)
- Runtime language addition without a deploy
- Pluralization or advanced ICU formatting (simple interpolation only)
- Translation of non-UI strings (data, error messages from backend)

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | `react-i18next` + `i18next` | Mature, widely used, simple hook API, small bundle |
| Translation format | Flat JSON key-value pairs | Simple, no nesting complexity, easy to maintain |
| Locale detection | `i18next-browser-languagedetector` | Detects `navigator.language` and persists to localStorage |
| File structure | `locales/{lang}/translation.json` | Per-language files, loaded statically at build time |
| Key naming | `namespace.component.key` (e.g. `filesMenu.openFile`) | Hierarchical, scoped, avoids collisions |

## Risks / Trade-offs

- [Bundle size increase] → `i18next` + `react-i18next` is ~8KB gzipped; acceptable
- [Component refactoring] → Every component with UI text needs a `t()` call; can be done incrementally
- [Locale maintenance] → New strings must be added to all locale files; mitigated by script or dev reminder
