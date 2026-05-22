## Why

The app currently uses client-side language detection (browser settings, localStorage) with no URL integration. This means locale is invisible to search engines, lost when sharing links, and SSR always renders English. Adding locale URL prefixes (`/en/editor`, `/vi/editor`) enables proper SEO with hreflang, deep-linkable localized pages, and correct SSR-per-locale rendering.

## What Changes

- Restructure routes from flat (`/`, `/about`, `/editor`) to locale-prefixed (`/$lang/`, `/$lang/about`, `/$lang/editor`)
- Add root-level redirect: bare paths like `/editor` redirect to `/{detected-lang}/editor`
- Make HTML `lang` attribute dynamic from route context
- Update language switchers (`LocalePicker`, `ViewMenu`) to navigate to new URL prefix instead of just calling `i18n.changeLanguage()`
- Make i18n initialization SSR-aware — read locale from URL param on server
- Configure `i18next-browser-languagedetector` to also detect from URL path

## Capabilities

### New Capabilities
- `locale-url-routing`: URL-prefix-based locale routing with SSR support, redirect from bare paths, and dynamic lang attribute

### Modified Capabilities
- `i18n-core`: i18n initialization must become SSR-aware (read locale from URL param)
- `i18n-locale-picker`: Language switcher must navigate to new URL prefix instead of calling `changeLanguage()` directly

## Impact

- **BREAKING**: All route paths change from `/path` to `/{locale}/path`. Existing bookmarks and shared links to bare paths break (mitigated by redirect).
- Affected files: `router.tsx`, all route files (`__root.tsx`, `index.tsx`, `about.tsx`, `editor.tsx`), `i18n/i18n.ts`, `LocalePicker.tsx`, `ViewMenu.tsx`
- No new external dependencies
- SSR infrastructure already exists (TanStack Start) — no new infra needed
