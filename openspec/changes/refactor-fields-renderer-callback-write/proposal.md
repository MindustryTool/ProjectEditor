## Why

The `FieldsRenderer` component and its child renderers recreate closure functions every render, causing unnecessary re-renders down the tree. The `node` prop passes raw `HjsonNode` objects instead of plain values, leaking internal parsing abstractions to leaf components. The `write` function from `useFileString` is a raw setter that doesn't support stable updater callbacks, forcing consumers to capture stale references. These issues collectively hurt rendering performance and make the component API harder to reason about.

## What Changes

- **Rename `node` prop to `value` across all schema renderers** — pass the actual primitive value (string, number, boolean, etc.) or the deserialized object instead of `HjsonNode`. **BREAKING**: SchemaRenderer type changes; all renderer implementations must read from `value` instead of `node`.
- **Reduce SchemaRenderer props** — merge `writePrimitiveValue`, `replaceFieldValue`, `initializeArrayValue` into a single `onChange` callback where possible; remove `original` and `onPatch` from leaf renderers since they can derive writes from `onChange`.
- **Make `write` (from `useFileString`) accept an updater callback** — change signature from `(content: string) => void` to `(contentOrUpdater: string | ((prev: string | null) => string)) => void`, enabling stable callback references. **BREAKING**: consumers that rely on the exact `(content: string) => void` type signature must be updated.
- **Create a `useCallbackWrite` helper** — memoize field-level write helpers so child renderers receive stable function references.
- **Update all consumers** — `SchemaArrayItemEditor`, all panel components, and the `writeBuffer` store method to support the callback style.

## Capabilities

### New Capabilities
- `callback-write-pattern`: Stabilize write callbacks by supporting updater-style `(prev: string | null) => string` arguments in `useFileString.write`. The underlying `writeBuffer` store action accepts `(prev: ArrayBuffer | null) => ArrayBuffer` — string encoding is handled by `useFileString`.
- `value-based-field-editor`: Refactor schema renderers to receive plain values instead of `HjsonNode`, with reduced prop surface.

### Modified Capabilities
- `schema-renderer`: The renderer prop interface changes — `node` becomes `value`, several props are consolidated into `onChange`. The internal rendering contracts change.
- `file-content-store`: The `writeBuffer` signature expands to accept an updater callback in addition to a direct value.
- `array-field-editor`: The `SchemaArrayItemEditor` component must be updated to match the new renderer prop shape and callback style.

## Impact

- **packages/core/src/hooks/use-file-content-string.ts** — `useFileString.write` signature change (add updater overload)
- **packages/core/src/stores/file.ts** — `writeBuffer` store action signature change (add updater overload)
- **packages/core/src/hooks/use-file-content.ts** — internal `write` callback adapted for new signature
- **apps/web/src/components/editor/panel/FieldsRenderer.tsx** — major refactor: SchemaRenderer type, all renderer functions, `createFieldValueReplacer`, `createPrimitiveValueHelper`, `SchemaArrayItemEditor`
- **apps/web/src/components/editor/panel/*Panel.tsx** — 6 panel files (indirect consumers, no changes expected unless they pass callbacks directly)
- **apps/web/src/components/editor/toolbar/EditMenu.tsx** — direct `writeBuffer` consumer needs update
