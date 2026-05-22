## Context

The mod.hjson editor currently uses a generic Input component for all fields, a comma-separated string for dependencies, and includes save/reset buttons. The form auto-saves via the editor panel system, making save/reset redundant. Mindustry mod metadata has specific constraints (mod-name format, minGameVersion > 145, etc.) that aren't enforced.

## Goals / Non-Goals

**Goals:**
- Enforce field-level validation matching Mindustry mod metadata constraints
- Replace description Input with Textarea
- Replace comma-separated dependencies with dynamic item list
- Remove save/reset buttons
- Extract reusable mod-name schema

**Non-Goals:**
- Changing the form submission/persistence strategy (auto-save stays)
- Adding new i18n keys (reuse existing where possible)
- Migrating existing mod.hjson files to new format

## Decisions

1. **Valibot pipe pattern for validation** — Use `v.pipe()` with `v.regex()`, `v.minLength()`, `v.maxLength()` etc. to compose field validators. Keeps validation consistent with existing codebase patterns.
2. **Textarea over Input** — Use `<textarea>` via the existing `Textarea` UI component for description. Content may be long (up to 10000 chars); textarea provides better UX.
3. **Dynamic dependency fields via form.Field array** — Rather than a comma-separated input, render a list of individual `<form.Field>` instances for each dependency, each validating against the mod-name schema. Track field count with local state. This matches the existing TanStack Form pattern.
4. **Remove save/reset** — The editor auto-saves on change. Save button doesn't persist to disk in current architecture. Reset would require initial values tracking. Simplifies the form.
5. **mod-name regex** — `/^[a-z][a-z0-9-]*$/` to enforce lowercase start, lowercase letters, digits, and hyphens.
6. **minGameVersion as string with number validation** — Keep the field as string type (consistent with existing) but validate it parses to a number > 145.

## Risks / Trade-offs

- Dependencies dynamic list: Adding/removing fields with TanStack Form requires careful field key management to avoid re-render issues
- Changing from string-array to validated array may break existing stored data if any
