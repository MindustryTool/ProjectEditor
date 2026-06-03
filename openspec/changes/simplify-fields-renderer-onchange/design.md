## Context

The FieldsRenderer currently creates a new `onChange` function per renderer per render via an inline arrow in `.map()`. Each renderer individually converts between raw JS values and HJSON serialized strings. Complex renderers (ArrayField, ResearchField) maintain their own surgical patching logic using `original`/`onPatch` props. This creates a large prop surface and blocks React rendering optimizations.

A prior change (`refactor-fields-renderer-callback-write`) introduced updater callbacks for `writeBuffer`/`write`, and converted renderers to value-based props. This change builds on that by introducing a single stable `onChange` that encapsulates HJSON navigation and patching.

## Goals / Non-Goals

**Goals:**
- Single `onChange` function passed to all renderers, identity-stable (never changes)
- Updater receives both the HjsonNode at the target path and the original source string
- Leaf renderers use a uniform `patchValue(original, HJSON.stringify(newValue))` pattern
- Complex renderers call node methods directly (e.g., `arrNode.removeElement(original, index)`)
- Support field removal when updater returns `null` (for default-value cleanup)
- Remove `original`/`onPatch` from `SchemaRendererProps` entirely
- Remove `FieldWriteContext` and `createFieldValueReplacer`
- Add unit tests for `HjsonValueNode.patchValue`

**Non-Goals:**
- Not changing the `writeBuffer`/`write` store/hook layer
- Not changing how renderers display UI or handle local state
- Not changing panel consumers (EditMenu etc.)

## Decisions

### Decision 1: `useRef` + `useCallback` for stable identity

`useRef` stores the latest `write` function; `useCallback` with `[]` deps creates a permanent reference. The ref is updated each render ensuring the callback always calls the current `write`.

**Alternatives considered:**
- `useCallback([write])` — callback changes whenever `write` identity changes (projectId, path, fs changes), causing rerenders
- `useMemo` with empty deps — same stability but `useRef` is more conventional for mutable refs

### Decision 2: `(node, original) => string | undefined` updater signature

`string` return → replaces the value node's content in the source via `info.replaceValue` (or `node.patchValue` is invoked by the updater). `undefined` return → removes the field/element from the source (when schema default and non-nullable).

**Alternatives considered:**
- `string` only → no removal support, fields would be set to `undefined` instead of being removed
- Separate `onRemove` callback → extra prop, more surface area
- Sentinel string `"__REMOVE__"` → fragile, could conflict with valid HJSON values

### Decision 3: Removal extracted from jsonPath

When updater returns `undefined`, `onChange` navigates the parent path from `jsonPath` to call `removeField`/`removeElement` on the parent node.

Example: `jsonPath = "items[0].health"` → parent is `root.path("items[0]")`, field name is `"health"`. Calls `parentNode.removeField(original, "health")`.

For top-level fields (`jsonPath = "health"`), parent is the root object, field name is `"health"`.

### Decision 4: Removal only when value equals schema default AND not nullable

The renderer checks `v.getDefault(entrySchema) === current value` and `!hasNullishWrapper(entrySchema)` before returning `null` from the updater. This preserves existing behavior where default-valued fields are omitted for cleaner HJSON output.

### Decision 5: `patchValue` on `HjsonValueNode` mirrors `FieldInfo.replaceValue`

`FieldInfo.replaceValue` replaces the value portion of a field in the source string. `HjsonValueNode.patchValue` does the same for a bare value node, using its `start`/`end` position indices. This gives leaf renderers a direct method to call instead of going through `FieldInfo`.

## Risks / Trade-offs

- **Formatting loss on removeField**: `removeField` surgically removes the field and any trailing comma, preserving formatting for remaining fields. This is equivalent to current behavior.
- **Performance on null removal**: Requires re-parsing `original` to navigate to parent. Acceptable since removal is rare (only on default-value writes).
- **Path parsing**: Extracting parent path and field name from `jsonPath` is string manipulation. Edge cases with bracket-notation field names (e.g., `obj["field.name"]`) are not supported — Mindustry schemas use simple dot-separated paths.
