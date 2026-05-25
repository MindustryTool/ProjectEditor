## REMOVED Requirements

### Requirement: File status enum replaces boolean isLoading
**Reason**: Replaced by derived boolean state model (`isDirty`, `isSaving`, `isLoading`) computed from `currentVersion`/`savedVersion` comparison. The explicit `FileStatus` enum (`idle | dirty | saving | error`) is eliminated. See `state-derivation` spec and `file-content-store` modified requirements.
**Migration**: Replace `status === "dirty"` checks with `isDirty` derived from `currentVersion > savedVersion`. Replace `status === "saving"` with `isSaving` tracked via the WriteQueue. Replace `status === "error"` with `isError` from the `error` field. Use the `useFileContent` hook's updated return value instead of directly reading the store's status field.
