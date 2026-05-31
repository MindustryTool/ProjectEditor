## Why

Currently, `ValidationRunner.validate()` requires fully-decoded file content as a `string`, forcing callers to read and decode every file even when no validator matches its path. The ExportMenu also runs full validation on all files when the dialog opens, creating unnecessary latency before the user can even see the export dialog.

## What Changes

- **`ValidationRunner` interface**: Change `content` parameter from `string` to `() => Promise<string>` in `validate()` and `validateAll()` so content is only resolved when matched validators exist
- **`ValidatorFn` type**: Change `content` parameter from `string` to `() => Promise<string>`
- **`createValidationRunner`**: Only call the content getter when there are matched validators for the path
- **`ValidationProvider`**: Update `validateFile` context and `scheduleValidation` to pass lazy content getters
- **`ExportMenu`**: Move validation from `handleOpen` (dialog open) to `handleDownload` (export button click) — validate on export, not on dialog open
- **`ValidationContextValue`**: Change `validateFile` signature to accept `() => Promise<string>` instead of `string`

## Capabilities

### New Capabilities
- `lazy-validation-content`: capability for deferred content loading in validation runner, only resolving file content when there are matched validators

### Modified Capabilities
- `validation-provider`: the `validateFile` context method signature changes to accept a lazy content getter; `scheduleValidation` passes a lazy getter instead of decoded string
- `project-export`: pre-export validation timing changes from "on dialog open" to "on export click"; validation is triggered at export time, not at dialog open time

## Impact

- **`packages/state/src/validation/runner.ts`** — `ValidationRunner` interface, `createValidationRunner` implementation
- **`packages/state/src/validation/types.ts`** — `ValidatorFn` type signature
- **`apps/web/src/components/editor/validation-provider.tsx`** — `ValidationContextValue` interface, `scheduleValidation`, context value
- **`apps/web/src/components/editor/ExportMenu.tsx`** — remove `loadAndValidateAll` from `handleOpen`, call it from `handleDownload` before export
- All existing validators in `validators.ts` are unaffected (they receive `content` as already-resolved string from the lazy getter call)
