## Why

Every HjsonSchema file that uses ClassMap repeats the same 4-line pattern: `v.lazy()` wrapping a `classMap.get()` call, followed by manually spreading `baseSchema.entries` + variant entries + extra fields inside a `v.object()` pipe with metadata. This boilerplate is duplicated across 6+ files. Additionally, when variant fields override base fields, metadata from the base is silently lost, forcing manual re-declaration of UI labels.

## What Changes

- Create a `createClassHjsonSchema` helper in `packages/schema/src/class.ts` that encapsulates the common lazy + merge + metadata pattern
- Add a smart merge utility that inherits base metadata onto variant field overrides automatically
- Refactor all 6 existing HjsonSchema definitions (effect, ability, block, bullet, shoot-pattern, part, weapon) to use the helper
- Remove the `extend()` function and `register()` method from ClassMap if unused (they were never called anywhere in the codebase)

## Capabilities

### New Capabilities
- `class-schema-helper`: A reusable factory function for creating class-based HjsonSchemas with automatic base schema merging and metadata inheritance

### Modified Capabilities
_(none — no spec-level behavior changes; this is a pure implementation refactor)_

## Impact

- **Code**: `packages/schema/src/class.ts` gains new exports; `utils.ts` adds metadata extraction helpers if needed
- **Refactored files**: `effect.ts`, `ability.ts`, `bullet.ts`, `shoot-pattern.ts`, `part.ts`, `block.ts`, `weapon.ts`
- **Removals**: `extend()` function and `register()` method from ClassMap (dead code)
- **No breaking changes**: all existing schemas produce identical output
