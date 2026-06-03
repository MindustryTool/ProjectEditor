## Context

`FieldsRenderer.tsx` has accumulated a large prop surface across its `SchemaRenderer` type and sub-renderers. The root cause is that write helpers (`createFieldValueReplacer`, `createPrimitiveValueHelper`) are recreated every render pass because they close over per-field context. The `write` function from `useFileString` is a plain setter—no updater callback pattern—so consumers needing stable references must manage memoization themselves.

The store action `writeBuffer` takes a flat `content: ArrayBuffer | string`, and `useFileString.write` encodes strings to `ArrayBuffer` before passing them down. This linear flow means every field change triggers a new closure.

## Goals / Non-Goals

**Goals:**
- Stabilize all write callbacks so child renderers receive ===-equal references across re-renders
- Replace `node: HjsonNode` prop with `value: unknown` (the actual primitive/object value)
- Consolidate `writePrimitiveValue`, `replaceFieldValue`, `initializeArrayValue` into a single `onChange` callback
- Remove `original` and `onPatch` from leaf renderer props (they become internal details of `onChange`)
- Add updater callback overload to `useFileString.write` and `writeBuffer`: `write((prev) => next)`

**Non-Goals:**
- No change to the HJSON parsing library or schema resolution logic
- No change to the panel components that consume `FieldsRenderer` (their API stays the same)
- No performance work outside the FieldsRenderer tree

## Decisions

1. **Updater pattern for writeBuffer**  
   Overload `writeBuffer(projectId, path, content)` to accept `content: ArrayBuffer | string | ((prev: ArrayBuffer | null) => ArrayBuffer)`. The updater receives the current `data` (as `ArrayBuffer | null`) from the store entry and must return an `ArrayBuffer`. String encoding is the responsibility of higher-level wrappers like `useFileString`. This mirrors React's `useState(prev => next)` pattern, making it easy to build stable `useCallback` wrappers.

2. **Value-based props instead of HjsonNode**  
   Each renderer currently receives `node: HjsonNode` and calls `.isString()`, `.valueOf()`, etc. to extract the value. By computing `value` at the `FieldsRenderer`/`ObjectField` level (using `node.valueOf()`) and passing it down, leaf renderers become pure value-presentation components. This also lets us drop `original` and `onPatch` from leaf renderer props.

3. **Single `onChange` callback**  
   Merge `writePrimitiveValue`, `replaceFieldValue`, and `initializeArrayValue` into a single `onChange: ((value: unknown) => void) | undefined`. The called determines the action based on what it receives:
   - `onChange("some string")` → replace field value
   - `onChange(undefined)` → remove/nullify field
   - `onChange([])` → initialize array
   
   This halves the prop count.

4. **Stabilize via `useCallback` with updater**  
   In `FieldsRenderer`, wrap the generated `onChange` in `useCallback` using the updater form of `write` so the callback identity is stable across renders (as long as `path` doesn't change). The field path and parent node are captured once.

5. **SchemaArrayItemEditor adapted**  
   It currently wraps a Renderer with `handleOnPatch` that parses full content. After the change, it can pass a simpler `onChange` that directly calls its parent's `onChange(value)` since it receives the parsed value, not a node.

## Risks / Trade-offs

- **Updater callback increases store complexity**: The `writeBuffer` store action must now handle three argument types (ArrayBuffer, string, function). Mitigation: keep the overload simple with a type guard at the top. The callback only handles `ArrayBuffer` types — string handling is delegated to `useFileString`.
- **Value-based props may lose positional info for arrays**: Array items need index-aware patching. Mitigation: ArrayField and SchemaArrayItemEditor will still handle the `original`/`onPatch` logic internally; only *leaf* renderers switch to value/onChange.
- **SchemaArrayItemEditor's `handleOnPatch` uses jsonPath to extract values from the full document**: This complexity can be removed once it receives a value directly. Mitigation: pass the element's parsed value directly.
