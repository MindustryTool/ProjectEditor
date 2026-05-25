## RENAMED Requirements

### Requirement: Validation engine provides registry and runner
**FROM**: `@project/file-validation/src/registry.ts` and `@project/file-validation/src/runner.ts`
**TO**: `@project/state/src/validation/registry.ts` and `@project/state/src/validation/runner.ts`

### Requirement: Validation results use typed severity levels
**FROM**: `@project/file-validation/src/types.ts`
**TO**: `@project/state/src/validation/types.ts`

### Requirement: Validation result includes location and message
**FROM**: `@project/file-validation/src/types.ts`
**TO**: `@project/state/src/validation/types.ts`
