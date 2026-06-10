## Context

Every HjsonSchema that uses ClassMap (effect, ability, bullet, shoot-pattern, part, block, weapon) follows the same pattern:

```ts
export const XxxHjsonSchema: SchemaFn = CachedSchema((context) => {
    return v.lazy((input) => {
        const variant = classMap.get(input, context);
        return v.pipe(
            v.object({
                ...baseSchema.entries,
                ...variant,
                // optional extra fields
            }),
            metadata({ type: "xxx" }),
        );
    });
});
```

When a variant overrides a base field (e.g., changing a default), the spread replaces the entire entry, losing the base field's metadata (UI labels, descriptions, categories). The `weapon.ts` file currently works around this using a plain-object base schema + `fixed()` utility, but this only handles the "disable and set value" case, not general field overrides.

The `extend()` function and `register()` method on ClassMap exist but are never used — they're dead code.

## Goals / Non-Goals

**Goals:**
- Eliminate the duplicated lazy+merge+metadata boilerplate across all 6+ HjsonSchema files
- When a variant field overrides a base field, automatically inherit the base field's UI metadata (name, description, category, visibleWhen, etc.)
- Keep ClassMap focused on its single responsibility: resolving inheritance chains into flat entries
- Remove dead code (`extend`, `register`)

**Non-Goals:**
- Not changing how ClassMap works internally — it still returns `v.ObjectEntries`
- Not changing how the UI renderer consumes metadata (that's unchanged)
- No breaking changes to existing schema outputs

## Decisions

### 1. Helper function over modifying ClassMap

**Decision:** Create a standalone `createClassHjsonSchema()` function rather than moving base schema merging into ClassMap itself.

**Rationale:** ClassMap is a general-purpose class hierarchy resolver. Adding base schema knowledge would couple it to a specific usage pattern. The helper function composes existing primitives without changing them.

**Alternatives considered:**
- Modify ClassMap constructor to accept base schema and return full schema from `get()` — rejected because ClassMap loses generality
- Make ClassMap extendable for custom `get()` behavior — over-engineered for one use case

### 2. Metadata inheritance via post-merge wrapping

**Decision:** After merging, check each variant field against base entries. If the field name exists in base and the variant field has no metadata of its own, wrap it with `v.pipe(field, metadata(baseMeta))`.

**Rationale:** This handles the 90% case (variant just wants to change a default/constraint) without boilerplate. The variant author doesn't need to know or repeat base metadata. If the variant explicitly includes `metadata()`, it keeps full control.

**Alternatives considered:**
- Always merge base metadata onto variant (never allow override) — too restrictive, variant may intentionally want different UI labels
- Don't auto-inherit, require explicit `inheritField()` call — more verbose, defeats the purpose

### 3. Remove `extend()` and `register()` from ClassMap

**Decision:** Delete `extend()` function and `register()` method. Both are dead code (zero call sites across the entire codebase). The `ClassExtends` type remains for backward compatibility only if needed.

**Rationale:** Dead code adds maintenance overhead. The inheritance chain via `className` field entries still works via direct construction.

### 4. `fixed()` utility remains unchanged

**Decision:** The existing `fixed()` utility (which wraps a base field with `v.value()` and `disabled` metadata) is complementary, not replaced by this change. It handles the "fix a value and disable" pattern used extensively in block files.

## Risks / Trade-offs

- **[Metadata surprise]** If a variant field happens to have no metadata but the author intended it to be a brand-new field unrelated to the base, inheriting base metadata could be confusing. → Mitigation: this only happens when the key matches a base key exactly, which is an explicit override by definition.
- **[Complexity]** Adding a helper function is low risk, but refactoring 6 files increases the surface area for mistakes. → Mitigation: existing tests + visual diff of generated schemas.
- **[Dead code removal]** Removing `extend()`/`register()` could break external consumers if anyone imports them. → Mitigation: they're module-private (`extend` is a function, not exported; `register` is a method with no callers).
