## 1. Setup

- [x] 1.1 Add `@project/hjson` dependency to `apps/web/package.json`

## 2. Core Implementation

- [x] 2.1 Import `HJSON` and `StructuredObject` from `@project/hjson` in `ModHjsonPanel.tsx`; removed valibot imports
- [x] 2.2 Replaced `parseModHjsonContent()` with `HJSON.parse(content, undefined, { structured: true })` in load effect; try/catch for parse errors falls back to defaults
- [x] 2.3 Replaced `linesRef`/`replaceLine` with position-based write-back using `FieldInfo.valueStart`/`valueEnd` and string slicing
- [x] 2.4 Removed `validateField()` function, `fieldErrors` state, and all inline validation logic
- [x] 2.5 Cleaned up unused imports: valibot, ModHjsonSchema, ModNameSchema, FormMessage

## 3. Verification

- [x] 3.1 Run `npm run typecheck` in `apps/web` — typecheck passes
- [x] 3.2 Run `npm test` — all 103 hjson tests + 1 web test pass
- [x] 3.3 Verify ModHjsonPanel loads and parses mod.hjson content correctly
