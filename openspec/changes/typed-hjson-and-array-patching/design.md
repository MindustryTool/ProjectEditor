## Context

The HJSON structured parsing system uses position-indexed nodes (`HjsonNode`, `HjsonObjectNode`, `HjsonArrayNode`, `HjsonValueNode`) for surgical string patching. Currently:

- `FieldInfo.value: any` — no type safety when reading field values
- `ElementInfo.value: any` — no type safety when reading array element values  
- `HjsonNode.valueOf(): any` — callers must cast manually
- `createFieldInfo(value: any, ...)` — factory accepts untyped values
- `showFieldInfo(value: any, ...)` — same for elements
- `HjsonValueNode.#value: any` — the primitive node stores untyped data

On the consumer side (`FieldRenderer.tsx`):
- `FieldTypes` maps 7 named types (`String`, `Int`, `Float`, `Double`, `Boolean`, `HexColor`, `Research`)
- `FieldsRenderer` props use `values: Record<string, string>` — incorrect for non-string types, and loses all positional metadata
- `updater: (field: string, value: any | undefined)` — no typed updater per field, no access to the parse tree
- No support for arrays, nested objects, or composite types

The value store pattern (`values` object + `handleUpdate` fetcher + `patchField` for persistence) is used by both `ItemPanel.tsx` and `ModHjsonPanel.tsx`. The redesign replaces raw values with the parsed `HjsonObjectNode` tree, giving renderers full access to typed FieldInfo/ElementInfo for surgical patching.

## Goals / Non-Goals

**Goals:**
- Make `FieldInfo<T>` and `ElementInfo<T>` generic so `value` is typed
- Make `HjsonValueNode<T>` generic over the primitive type it holds
- Add `isString()`, `isNumber()`, `isBoolean()` type guards to `HjsonNode` for compile-time narrowing to `HjsonValueNode<string|number|boolean>`
- Add `Array` and `Object` field types to `FieldTypes` in FieldRenderer
- Pass `HjsonObjectNode` (not raw values) to `FieldsRenderer` so renderers can navigate the node tree, access FieldInfo/ElementInfo, and perform surgical patching
- Extend `FieldsRenderer` to render array items (with add/remove) and nested object sub-fields by iterating the node tree
- Ensure all existing `ItemPanel` and `ModHjsonPanel` continue to work with updated API (passing node instead of values)

**Non-Goals:**
- No runtime performance regression — type parameters are erased at compile time
- No new external dependencies
- No changes to the parser or tokenizer
- No changes to the serializer (`stringify`)
- No reordering of array items in the renderer (reorder is future work)
- No deep nested path expressions beyond one level of nesting (e.g., `a.b` yes, `a.b.c` not yet)

## Decisions

### Decision 1: Type parameter on FieldInfo/ElementInfo (not a new wrapper type)

Add a type parameter `T` to `FieldInfo<T>` and `ElementInfo<T>`, defaulting to `unknown` for backward compatibility.

```typescript
export interface FieldInfo<T = unknown> extends InfoBase {
  key: string;
  value: T;
  valueStart: Position;
  valueEnd: Position;
  replaceValue(original: string, newValue: string): string;
}
```

**Rationale:**
- Minimal change — only adds a type parameter, no new interfaces
- `T = unknown` is safer than `T = any` because it forces explicit narrowing
- Factory functions become `createFieldInfo<T>(..., value: T, ...): FieldInfo<T>`
- Consumers can infer `T` from their known schema

**Alternative considered:** A branded type `FieldInfo<Tag>` with discriminant. Rejected because it adds complexity without runtime benefit when the parsed value already carries the JS type.

### Decision 2: HjsonValueNode as `HjsonValueNode<T>` with primitive type guards

Make HjsonValueNode generic over its value type, and add type guard methods to the abstract `HjsonNode` base:

```typescript
export abstract class HjsonNode {
  abstract isObject(): this is HjsonObjectNode;
  abstract isArray(): this is HjsonArrayNode;
  abstract isValue(): this is HjsonValueNode;
  abstract isMissing(): this is HjsonMissingNode;
  abstract isString(): this is HjsonValueNode<string>;   // new
  abstract isNumber(): this is HjsonValueNode<number>;   // new
  abstract isBoolean(): this is HjsonValueNode<boolean>; // new
  // ...
}

export class HjsonValueNode<T = unknown> extends HjsonNode {
  readonly #value: T;
  constructor(value: T, start: Position, end: Position);
  isString(): this is HjsonValueNode<string> { return typeof this.#value === "string"; }
  isNumber(): this is HjsonValueNode<number> { return typeof this.#value === "number"; }
  isBoolean(): this is HjsonValueNode<boolean> { return typeof this.#value === "boolean"; }
  asValue<V = T>(): V | undefined;
  valueOf(): T;
}
```

**Rationale:**
- Type guards enable idiomatic TypeScript narrowing: `if (node.isString()) { node.valueOf() }` narrows to `HjsonValueNode<string>` automatically
- No runtime cost beyond a `typeof` check
- Works with discriminated unions and exhaustiveness checking
- `asString()`, `asNumber()`, `asBoolean()` remain as value-returning convenience methods
- Parser creates `HjsonValueNode<string | number | boolean | null>` naturally

### Decision 3: FieldsRenderer receives HjsonObjectNode instead of raw values

Instead of `values: Record<string, string>` with an `updater` callback, `FieldsRenderer` receives the parsed `HjsonObjectNode` directly:

```typescript
interface FieldsRendererProps {
  path: string;
  fields: Field[];
  node: HjsonObjectNode;              // the parsed structured node
  original: string;                   // original source for patching
  onPatch: (newContent: string) => void;  // emit patched content
}
```

**Rationale:**
- Renderers can call `node.fields()` to iterate typed `FieldInfo<T>` entries with full position metadata
- Nested rendering: `node.get("subfield")` returns `HjsonNode`, renderer checks `isObject()`/`isArray()`/etc. and renders recursively
- Surgical patching: each renderer has access to `FieldInfo.replaceValue()` or `HjsonObjectNode.patchField()` directly, no need for a serialization round-trip
- Type-safe: `FieldInfo<T>.value` is typed; renderers use `isString()`/`isNumber()` to narrow

**Alternative considered:** Passing a `Record<string, unknown>` with dotted updater. Rejected because it loses positional metadata, requires double parsing for nested values, and makes surgical patching impossible without external state.

### Decision 4: Array field renderer uses HjsonArrayNode directly

Since the renderer receives `HjsonObjectNode`, it navigates to the array field via `node.get(key)` which returns an `HjsonArrayNode`. Array items are rendered by iterating `arrayNode.elements()`, and mutations use `HjsonArrayNode.patchElement()` / `insertElement()` / `removeElement()` for surgical single-element patching, and `HjsonArrayNode.patchField()` on the parent object for full-array rewrites when needed.

**Rationale:**
- No extra state — the node tree is the single source of truth
- Surgical patching preserves comments and formatting inside the array
- Symmetric with how object fields work — both navigate the node tree

### Decision 5: FieldTypes map to HjsonNode subtypes, not raw JS types

`FieldTypes` values become the `HjsonNode` subtype they represent:

```typescript
export type FieldTypes = {
  String: HjsonValueNode<string>;
  Int: HjsonValueNode<number>;
  Float: HjsonValueNode<number>;
  Double: HjsonValueNode<number>;
  Boolean: HjsonValueNode<boolean>;
  HexColor: HjsonValueNode<string>;
  Research: HjsonValueNode<Research> | HjsonObjectNode;
  Array: HjsonArrayNode;
  Object: HjsonObjectNode;
};
```

**Rationale:**
- Renderers receive typed `HjsonNode` subtypes, not raw primitives
- Renderers can access `info()` for positional metadata, `valueOf()` for the typed value
- Object/Array renderers call `fields()`/`elements()` directly for recursive rendering

## Risks / Trade-offs

- `[FieldInfo/ElementInfo generic adds compile-time breaking change]` → All existing usages (patching.test.ts, ModHjsonPanel.tsx, ItemPanel.tsx) use `any` contextually and will compile with minimal annotation updates
- `[Passing HjsonObjectNode to renderer requires panels to keep the node in sync with content]` → Mitigated by re-parsing on each `onPatch` callback; the node is read-only for rendering, mutations go through the patch callback
- `[HjsonValueNode<T> type inference from parser]` → Parser creates `HjsonValueNode` with runtime-type detection. The `isString()`/`isNumber()`/`isBoolean()` type guards handle narrowing at the consumer side
