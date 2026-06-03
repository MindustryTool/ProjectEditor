## Context

`apps/web/src/components/editor/panel/FieldRenderer.tsx` currently mixes two write models behind one `patchValue` prop:

- primitive fields map raw UI values directly to HJSON field replacements
- complex renderers such as objects and arrays still receive the same callback even though their safe edit model is structural patching

That shared callback makes renderer signatures convenient, but it blurs a critical boundary: primitive value replacement is safe for scalar `HjsonValueNode` cases, while object and array editing must preserve source structure by patching specific fields or elements. Current code already follows structural patching in many places, but some fallbacks and prop plumbing still permit whole-object or whole-array replacement paths.

## Goals / Non-Goals

**Goals:**
- Remove generic `patchValue` prop from shared renderer contract
- Introduce small helper dedicated to scalar edits on primitive HJSON value nodes
- Keep current editor UI, layout, labels, and user-visible workflows intact
- Make object and array renderers own structural patching through explicit HJSON node APIs
- Preserve specialized renderer behavior for research/effect while preventing accidental whole-object or whole-array replacement during normal editing

**Non-Goals:**
- Redesign field components or change panel styling
- Change schema detection, metadata visibility rules, or validation display
- Introduce new HJSON patch APIs in `@project/hjson`
- Add UI tests or manual verification steps

## Decisions

1. **Split primitive writes from structural writes**
   - Decision: replace shared `patchValue` prop with a helper factory used only where current node is a primitive value node and raw scalar input is enough.
   - Why: scalar edit semantics differ from structural edit semantics. Separate interfaces make unsafe whole-value replacement harder to express.
   - Alternative considered: keep `patchValue` and rely on convention. Rejected because current contract still invites misuse in object and array renderers.

2. **Keep primitive helper close to parent object context**
   - Decision: build primitive helper in top-level field mapping and nested object field mapping, where parent object node, field name, original source, defaults, and nullish behavior are all available.
   - Why: those scopes already know how to remove defaulted fields, write `null`, and patch exact child keys without extra traversal.
   - Alternative considered: move helper into each primitive renderer. Rejected because it would duplicate default/nullish handling across string, number, boolean, and scalar-select renderers.

3. **Make array renderer structural by contract**
   - Decision: array renderer uses only `patchElement`, `insertElement`, `removeElement`, and parent field patching for initialization; it no longer depends on generic raw-value replacement.
   - Why: array edits are index-based structural operations, and replacing full arrays risks discarding formatting or intermediate structure unnecessarily.
   - Alternative considered: keep full-array replacement for fallback states. Rejected because it violates requested safety boundary and is inconsistent with surgical array editing elsewhere in file.

4. **Keep nested object renderer structural by contract**
   - Decision: nested object renderer creates primitive child helpers for scalar sub-fields but performs object-valued edits through explicit `patchField` calls and passes structural patch functions into nested renderers.
   - Why: object editing often mixes scalar children and structural descendants. Parent object scope is right place to decide which path is safe.
   - Alternative considered: flatten all nested edits to root dot-path replacements. Rejected because local object nodes already expose safer field-level operations and keep responsibilities clearer.

5. **Preserve specialized complex renderers without UI changes**
   - Decision: research/effect renderers keep current UI behavior, but object-valued branches continue to use structural patching instead of depending on primitive helper semantics.
   - Why: user asked for behavioral cleanup, not UX changes. These renderers already contain custom patch logic that can stay in place with clearer write boundaries.
   - Alternative considered: refactor specialized renderers into new abstractions in same change. Rejected because it expands scope without adding direct value to requested cleanup.

## Risks / Trade-offs

- Prop contract churn across many renderers -> Mitigation: keep new helper narrow and rename clearly so compile errors reveal every call site
- Mixed scalar/object renderers like research and effect can still need mode switches -> Mitigation: only ban whole replacement for existing complex object/array edits; keep explicit transition logic isolated and reviewed
- Array initialization from missing or invalid data may need parent-scope patching -> Mitigation: handle initialization before array item editing so renderer never falls back to generic replacement
- Refactor can introduce regressions in default/nullish handling -> Mitigation: centralize primitive helper logic and keep existing remove-field/null semantics unchanged

## Migration Plan

- Update shared renderer prop types in `FieldRenderer.tsx`
- Introduce primitive helper creation in top-level and nested object field mapping
- Refactor primitive renderers to use helper, then refactor array/object renderers to rely only on structural patch functions
- Run TypeScript diagnostics on edited files and address any contract mismatches before implementation handoff

## Open Questions

- Whether mode-switch actions in mixed scalar/object renderers should remain allowed to replace a field when converting between scalar and object representations
- Whether helper naming should match existing `HjsonValueNode` terminology or future `HjsonDataNode` naming if repo adopts that alias later
