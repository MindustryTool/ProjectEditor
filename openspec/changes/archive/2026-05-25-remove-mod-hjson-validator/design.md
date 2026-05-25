## Context

`modHjsonValidator` was introduced as part of file-level validation for `mod.hjson`. However, the `ModHjsonPanel` form component already validates each field against `ModHjsonSchema` on every change via the form UI. The file-level validator adds no additional value — it only duplicates the schema validation that the form already performs. Removing it reduces validation overhead (one fewer validator to run on every keystroke), eliminates dead translation keys, and simplifies the validators module.

## Goals / Non-Goals

**Goals:**
- Remove `modHjsonValidator` function and its registration from the default validators
- Remove `validation.modHjson.*` translation keys from both locale files
- Delete the `file-validation-mod-hjson` spec

**Non-Goals:**
- Not removing `ModHjsonSchema` from `@project/validation` — still used by `ModHjsonPanel` for inline form validation
- Not changing how `ModHjsonPanel` works
- Not changing the registry, runner, or other validators

## Decisions

### 1. Redundancy of file-level vs form-level validation
**Decision**: Remove the file-level validator entirely.
**Rationale**: `mod.hjson` is exclusively edited through `ModHjsonPanel`, which validates every field against `ModHjsonSchema` interactively. The file-level validator would only add value if files could be edited outside the form (e.g., raw text editor), but mod.hjson is always opened via the form panel (see `EditorCenterPanel` routing logic).
**Alternative considered**: Keeping the validator for defense-in-depth — rejected because it adds maintenance cost (translation keys, extra validation pass) with zero practical benefit.

### 2. Translation key removal
**Decision**: Remove all `validation.modHjson.*` keys from both locale files.
**Rationale**: These keys are only referenced by `modHjsonValidator`. No other code uses them. Removing dead translation debt keeps the locale files clean.

## Risks / Trade-offs

- **[Risk]** If a future feature allows raw-text editing of mod.hjson, validation would need to be re-added.
  → **Mitigation**: The registry is designed for adding validators — re-adding a mod.hjson validator later is a one-function change. This is documented in the removal spec.
- **[Risk]** Some developer might expect mod.hjson to have file-level validation.
  → **Mitigation**: The spec is explicitly removed with a REMOVED section explaining the migration.
