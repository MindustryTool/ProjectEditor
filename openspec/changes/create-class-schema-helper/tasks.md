## 1. Core Implementation

- [x] 1.1 Add `mergeEntries` utility in `class.ts` — merges base + variant entries, inheriting base metadata when variant lacks its own
- [x] 1.2 Add `createClassHjsonSchema` factory function in `class.ts` — wraps the lazy + get + merge + metadata pattern
- [x] 1.3 Remove dead `extend()` function and `register()` method from ClassMap
- [x] 1.4 Export `createClassHjsonSchema` from `index.ts`

## 2. Refactor Simple HjsonSchemas (no extra fields)

- [x] 2.1 Refactor `effect.ts` — replace manual spread with `createClassHjsonSchema`
- [x] 2.2 Refactor `ability.ts` — replace manual spread with `createClassHjsonSchema`
- [x] 2.3 Refactor `bullet.ts` — replace manual spread with `createClassHjsonSchema`
- [x] 2.4 Refactor `shoot-pattern.ts` — replace manual spread with `createClassHjsonSchema`
- [x] 2.5 Refactor `part.ts` — replace manual spread with `createClassHjsonSchema`

## 3. Refactor Complex HjsonSchemas (with extra fields)

- [x] 3.1 Refactor `block.ts` — pass extra fields via `createClassHjsonSchema` `extra` parameter
- [x] 3.2 Refactor `weapon.ts` — pass extra fields via `createClassHjsonSchema` `extra` parameter

## 4. Tests

- [x] 4.1 Update `class.test.ts` — add tests for `createClassHjsonSchema` and `mergeEntries` metadata inheritance
- [x] 4.2 Remove `register`/`extend` related tests from `class.test.ts`
- [x] 4.3 Run all tests to verify no regression
