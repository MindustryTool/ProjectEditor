## 1. Update Validation Types

- [x] 1.1 No change needed — `ValidatorFn` continues to receive resolved `content: string` (per spec: "ValidatorFn receives resolved content")
- [x] 1.2 Change `ValidationRunner` interface in `packages/state/src/validation/runner.ts` — `content: string` → `content: () => Promise<string>` for both `validate` and `validateAll`

## 2. Update ValidationRunner Implementation

- [x] 2.1 Update `createValidationRunner.validate()` to call `registry.getMatches(path)` first and only invoke the content getter if matches exist
- [x] 2.2 Update `createValidationRunner.validateAll()` to pass lazy getters through to `validate()`
- [x] 2.3 Ensure the getter is called exactly once per path even with multiple matches

## 3. Update ValidationProvider

- [x] 3.1 Change `ValidationContextValue.validateFile` signature: `content: string` → `content: () => Promise<string>`
- [x] 3.2 Update `scheduleValidation` to create a lazy getter that reads from file store on invocation instead of eagerly decoding
- [x] 3.3 Update the `validateFile` context method to pass the lazy getter to `runner.validate()`

## 4. Update ExportMenu

- [x] 4.1 Remove `loadAndValidateAll` call from `handleOpen` — dialog opens without validation
- [x] 4.2 Move `loadAndValidateAll` call into `handleDownload` before `handleExport`
- [x] 4.3 Add loading state on the Download button during export validation
- [x] 4.4 Update `loadAndValidateAll` to pass lazy content getters to `validateFile` instead of resolved strings

## 5. Cleanup & Verification

- [x] 5.1 Search for any other `runner.validate` or `validateFile` callers and update if needed
- [x] 5.2 Run type-check across affected packages (`@project/state`, `apps/web`) — both pass clean
- [x] 5.3 Verify ExportMenu works: dialog opens fast, validation runs on download click
