## 1. Types and Data Structures

- [x] 1.1 Create `src/structured.ts` with `FieldInfo` interface (key, value, start, end, valueStart, valueEnd) and `SourceLocation`-compatible position format
- [x] 1.2 Implement `StructuredObject<T>` class with `field(key)` and `fields()` iteration methods, `valueOf()`, and `toJSON()`
- [x] 1.3 Add `structured?: boolean` to `HJSONParseOptions` in `src/parser.ts`
- [x] 1.4 Define `StructuredResult<T>` conditional type (returns `StructuredObject<T>` for objects, `T` for primitives/arrays)

## 2. Parse Integration

- [x] 2.1 Add position collection during AST-to-JS conversion — when `structured: true`, collect `MemberNode` positions into a path-keyed map during `toJSValue()` traversal
- [x] 2.2 Wrap the plain JS object in `StructuredObject<T>` with the collected position map before returning
- [x] 2.3 Handle nested objects recursively — ensure inner objects also become `StructuredObject` instances with their own position metadata

## 3. Export and API Surface

- [x] 3.1 Export `FieldInfo`, `StructuredObject`, `StructuredResult` from `src/index.ts`
- [x] 3.2 Wire `structured` option through `HJSON.parse()` in `src/hjson.ts`
- [x] 3.3 Handle reviver interaction: pass plain JS values through reviver, then wrap result in `StructuredObject`

## 4. Tests

- [x] 4.1 Add tests: default parse still returns plain JS value
- [x] 4.2 Add tests: structured parse returns `StructuredObject` instance with correct positions for simple object
- [x] 4.3 Add tests: `field()` and `fields()` accessor methods
- [x] 4.4 Add tests: nested objects are recursively `StructuredObject` instances
- [x] 4.5 Add tests: primitives and arrays return plain values even in structured mode
- [x] 4.6 Add tests: reviver function works correctly with structured mode
- [x] 4.7 Add tests: `valueOf()` and `toJSON()` return the plain JS value

## 5. Verification

- [x] 5.1 Run `npm run typecheck` — ensure no type errors
- [x] 5.2 Run `npm test` — ensure all tests pass
