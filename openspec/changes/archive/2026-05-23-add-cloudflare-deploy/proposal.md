## Why

The app currently has no deployment configuration — it runs only in development. Adding Cloudflare Workers deployment enables production hosting with global edge distribution, zero cold starts, and free tier availability, following TanStack Start's official hosting partner guide.

## What Changes

- Add `@cloudflare/vite-plugin` and `wrangler` as dev dependencies
- Add Cloudflare plugin to `vite.config.ts` (before `tanstackStart()`)
- Create `wrangler.jsonc` with Cloudflare Workers config targeting `@tanstack/react-start/server-entry`
- Add `deploy` and `cf-typegen` scripts to `package.json`

## Capabilities

### New Capabilities
- `cloudflare-deploy`: Cloudflare Workers deployment configuration via `@cloudflare/vite-plugin`, `wrangler.jsonc`, and deploy scripts

### Modified Capabilities

*(No existing spec-level capabilities are modified.)*

## Impact

- New dev dependencies: `@cloudflare/vite-plugin`, `wrangler`
- Modified file: `apps/web/vite.config.ts` — add Cloudflare plugin
- New file: `apps/web/wrangler.jsonc` — Workers config
- Modified file: `apps/web/package.json` — add deploy scripts
- Existing `build` script is unchanged; `npm run build` still works locally
