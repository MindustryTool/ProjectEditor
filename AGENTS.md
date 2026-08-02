# AGENTS.md

Offline-first Mindustry mod editor (React, TanStack Start). pnpm 11.5 monorepo with Turborepo; Node >= 22 required.

## Commands

- `pnpm dev` — all apps; web app runs on port 3000 (`vite dev --port 3000`)
- `pnpm --filter @app/web dev` / `pnpm --filter <pkg> <script>` — single package/app
- `pnpm typecheck` / `pnpm lint` / `pnpm test` / `pnpm build` — root tasks (turbo)
- `pnpm format` / `pnpm format:fix` — prettier check/write on `**/*.{ts,tsx,js,jsx,json,css,md}`
- Unit tests (vitest): `pnpm --filter @project/core test`, `test:watch` for watch mode
- Circular-dependency check (CI enforces it in every package): `pnpm exec depcruise src --config .dependency-cruiser.cjs`

## Gotchas

- **`@project/data` build is codegen, not compilation**: `tsx scripts/fetch.ts` fetches `https://content.mindustry-tool.com/api/v2/` and writes `packages/data/src/generated/*.ts` (gitignored). Turbo `build`/`typecheck` depend on it, so both need network access. If generated files are missing, run `pnpm --filter @project/data build`. Never hand-edit generated files (`*.gen.ts` is gitignored repo-wide).
- **Root `pnpm test` includes browser tests**: `packages/fs` has a vitest browser project (Playwright chromium). Requires `pnpm exec playwright install chromium` first (CI does this). Run only the browser suite with `pnpm --filter @project/fs test:browser`.
- **README's Project Structure section is stale** — it lists packages (state, storage, ui, validation) that don't exist. Real packages: `config`, `api`, `types`, `utils`, `zip`, `fs`, `hjson`, `schema`, `core`, `data`. All export source directly (`exports` → `./src/index.ts`, no build step) except `@project/data`.
- **`.mindustry/` is a local Mindustry game source clone** (gitignored) used as a reference for game data; don't treat it as project code.
- Workspace deps use pnpm `catalog:` for shared versioning (see `pnpm-workspace.yaml`).

## Conventions

- **Unit tests only — no UI/component tests.** Tests target utils and pure functions (core: `tests/**/*.test.ts`). User tests manually themselves.
- Feature work follows OpenSpec: proposals/designs/specs live in `openspec/` and are driven by the `openspec-*` skills in `.opencode/skills` (`openspec-propose` → `openspec-apply-change` → `openspec-archive-change`). Consult `openspec/` before implementing.
- App structure: `apps/web` is the main app (TanStack Start + Cloudflare plugin, PWA; `pnpm --filter @app/web deploy` = build + `wrangler deploy`). `apps/app` is a minimal Vite + react-router-dom desktop-wrapper target.
