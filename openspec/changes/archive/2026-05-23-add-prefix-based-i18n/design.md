## Context

The app uses TanStack Router v1 (file-based) with TanStack Start (SSR). Routes are flat: `/`, `/about`, `/editor`. i18n is initialized client-side via `i18next-browser-languagedetector` with `fallbackLng: "en"`. During SSR, the server always renders English because the browser language detector has no access to navigator APIs. Language switchers (`LocalePicker`, `ViewMenu`) call `i18n.changeLanguage()` directly with no URL change.

## Goals / Non-Goals

**Goals:**
- All routes prefixed with locale: `/$lang/`, `/$lang/about`, `/$lang/editor`
- Bare paths (e.g., `/editor`) redirect to `/{detected-lang}/editor`
- HTML `<html lang>` attribute dynamic from URL
- Language switchers navigate to new locale URL prefix
- SSR renders correct locale from URL param
- Supported locales: `en`, `vi`

**Non-Goals:**
- Lazy-loading translation files per locale (static imports are fine for 2 locales)
- Custom SSR i18n instance per request (detector + URL param is sufficient)
- Subdomain-based locale (e.g., en.example.com)
- Cookie/session-based locale persistence (URL is the source of truth)
- SEO hreflang tags (can be added later)

## Decisions

1. **TanStack Router `$lang` param route** — Use file-based routing with a `$lang/` layout directory. TanStack Router automatically captures `:lang` as a path param. The `$lang` layout route validates the locale and provides it via `Route.useRouteContext()` / `beforeLoad`.

2. **SSR locale from URL** — Add a `beforeLoad` on the `$lang` route that reads the `:lang` param, validates it, calls `i18n.changeLanguage(lang)`, and stores the locale in router context. This runs on both server and client, so SSR renders correct locale.

3. **Bare path redirect** — Add a root-level `beforeLoad` or catch-all route that detects the user's preferred language (from `i18next-browser-languagedetector` or `Accept-Language` header) and redirects to `/{locale}/...`.

4. **Language switcher URL navigation** — `LocalePicker` and `ViewMenu` language items navigate using the router's `navigate()` to the same path with a different locale prefix, instead of calling `i18n.changeLanguage()` directly. The locale change propagates from the router context via `beforeLoad`.

5. **Dynamic HTML lang** — Use `router.state.location.pathname` or router context to set `<html lang={locale}>` dynamically in `__root.tsx`.

## Risks / Trade-offs

- [Bare path → locale path redirect adds navigation hop] → The redirect is instant (no HTTP round-trip since TanStack Router handles it client-side). SSR will handle this server-side for initial requests.
- [Existing bookmarks to `/editor` break] → Mitigated by the redirect; user lands on correct localized page with a small delay.
- [Language switcher now causes navigation instead of instant switch] → Navigation is within the same session; `beforeLoad` runs synchronously so the switch is nearly instant.
- [SSR double-render risk] → On server, the locale is read from the URL param before React renders. No hydration mismatch because the client also reads from the URL.
