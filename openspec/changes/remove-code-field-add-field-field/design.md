## Context

`ValidationResult` is a core type used throughout the validation subsystem. Validators currently express field-level context via `messageParams.field` (a hack into i18n params). Adding a dedicated `field` property formalizes this pattern.

## Goals / Non-Goals

**Goals:**
- Add `field?: string` to `ValidationResult` for identifying which field triggered an issue
- Migrate existing validators from `messageParams.field` to `field`
- Update the spec to match

**Non-Goals:**
- No changes to `code` or any other existing field
- No changes to the validation engine architecture (registry, runner, store)
- No new validators or validation logic

## Decisions

- **Keep `field` as optional**: Not all validation results are field-specific (e.g., file-level issues like "file is empty"). Making it optional avoids forcing every validator to provide a field.
- **Minimal store/runner changes**: Both `store.ts` and `runner.ts` pass through `ValidationResult` objects generically. The type change flows through automatically; no logic changes needed.

## Risks / Trade-offs

- **[Risk]** Adding `field` could lead to inconsistent naming across validators. Mitigation: validators are per-package — naming is naturally scoped.
