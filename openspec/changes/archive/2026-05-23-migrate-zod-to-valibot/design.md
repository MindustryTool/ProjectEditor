## Context

The `@project/validation` package currently defines three Zod schemas (`ProjectFileSchema`, `ProjectSchema`, `SettingsSchema`) that are consumed by `@project/core` and potentially other packages. The rest of the codebase already uses Valibot (for mod.hjson form validation in the editor). This migration removes the Zod dependency entirely, unifying on Valibot.

The migration is a direct line-by-line translation — Zod's `.object()`, `.string()`, `.number()`, `.boolean()`, `.enum()`, `.array()`, `.coerce.date()`, `.min()`, `.max()`, `.nonnegative()` all have direct Valibot equivalents.

## Goals / Non-Goals

**Goals:**
- Replace all Zod schemas with semantically identical Valibot schemas
- Remove `zod` from `packages/validation/package.json`
- Ensure `validateProject()` in `@project/core` works identically
- Preserve all exported TypeScript types (`InferOutput<typeof Schema>` matches `z.infer<typeof Schema>`)

**Non-Goals:**
- Schema structure or behavior changes (this is a pure swap)
- Updating consumers beyond `@project/core` (no other direct `@project/validation` consumers exist)
- Adding new schemas or validation features

## Decisions

1. **Direct translation, no API abstraction**
   - Map each Zod API call to its Valibot equivalent directly. No wrapper layer — the Valibot API is the public API going forward.
   - Alternatives considered: Creating a compatibility layer — rejected as unnecessary overhead for a small number of schemas.

2. **Use `v.pipe()` for chained validations**
   - Where Zod chains `.string().min(1).max(100)`, Valibot uses `v.pipe(v.string(), v.minLength(1), v.maxLength(100))`. Consistent with the mod-hjson-editor pattern already in the codebase.

3. **Export both schema objects and inferred types**
   - Current exports: `ProjectFileSchema`, `ProjectSchema`, `SettingsSchema` as Zod objects, with types inferred via `z.infer`. New exports: same names as Valibot objects, types inferred via `v.InferOutput`. No naming changes.

## Risks / Trade-offs

- [Risk] Valibot's `v.coerce(v.date())` may handle edge cases differently than Zod's `z.coerce.date()` → Mitigation: Test with a few date formats in the existing test suite
- [Risk] Valibot v1.x API may differ from v1.4.0 if updated → Mitigation: Pin version in package.json
