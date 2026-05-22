## Context

The app uses TanStack Start (SSR) with Vite. The current `vite.config.ts` has `tanstackStart()` as one of the plugins. There is no deployment target configured. The official TanStack Start hosting guide recommends Cloudflare Workers as an official partner with a dedicated `@cloudflare/vite-plugin` that integrates with Vite's Environments API.

## Goals / Non-Goals

**Goals:**
- Add `@cloudflare/vite-plugin` to the Vite build pipeline
- Create `wrangler.jsonc` for Cloudflare Workers configuration
- Add `deploy` and `cf-typegen` npm scripts
- Ensure `npm run build` continues to work locally unchanged

**Non-Goals:**
- Setting up CI/CD pipelines (e.g., GitHub Actions)
- DNS configuration or custom domain setup
- Environment variable management for Cloudflare Workers
- Actual deployment execution (requires user to run `deploy` script with authenticated Wrangler)

## Decisions

1. **Plugin order: Cloudflare before tanstackStart** — The Cloudflare Vite plugin wraps the SSR environment. Per the TanStack Start docs, it must be placed before `tanstackStart()` in the plugins array so the SSR environment is properly configured for the Workers runtime.

2. **Standalone wrangler.jsonc** — Separate file keeps Cloudflare-specific config isolated from Vite config. Uses `nodejs_compat` flag for Node.js API compatibility, targeting `@tanstack/react-start/server-entry` as the entry point (as specified in TanStack docs).

3. **Dev dependency only** — Both `@cloudflare/vite-plugin` and `wrangler` are dev dependencies. They are not needed at runtime — only for building and deploying.

4. **Existing build script kept** — `npm run build` still produces the standard output. The `deploy` script chains `build` then `wrangler deploy`. No breaking change to existing workflow.

## Risks / Trade-offs

- [Cloudflare Workers limitations] → Workers have constraints (e.g., no filesystem, limited CPU time). TanStack Start's SSR abstracts most of this, but edge cases (large file uploads, long-running tasks) may need adjustment.
- [Local dev still uses Vite dev server] → `vite dev` is unchanged. The Cloudflare plugin only affects the SSR build, not the dev server experience.
- [Wrangler authentication required] → User must run `wrangler login` before deploying. The `deploy` script will fail if not authenticated. This is documented in the deploy instructions.
