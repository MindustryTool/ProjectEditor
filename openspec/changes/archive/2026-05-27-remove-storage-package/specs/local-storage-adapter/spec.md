## REMOVED Requirements

### Requirement: LocalStorageAdapter implements StorageBackend
**Reason**: The `@project/storage` package and its `LocalStorageAdapter` are removed. Direct localStorage access is now handled by zustand persist middleware.
**Migration**: N/A — zustand persist handles serialization and hydration automatically.

### Requirement: Project serialization with date hydration
**Reason**: The adapter is removed. Date serialization is handled by the app store's persist configuration.
**Migration**: The store persist middleware handles `Date` serialization via custom `serialize`/`deserialize` or default JSON handling.

### Requirement: Project CRUD with prefixed keys
**Reason**: The adapter is removed. Project records are stored in the zustand store under `projectRecords` key.
**Migration**: Access project records via `useAppStore((s) => s.projectRecords)` and use store actions for mutations.

### Requirement: Settings CRUD with prefixed keys
**Reason**: Settings are already handled by zustand persist on the `settings` slice of `useAppStore`. No separate settings storage is needed.
**Migration**: Use `useAppStore((s) => s.settings)` and `useAppStore.getState().updateSettings(...)`.

### Requirement: OPFS root delegation
**Reason**: `getOPFSRoot()` is moved to `@project/fs` as a standalone function. Not part of the store.
**Migration**: Import `getOPFSRoot` from `@project/fs` instead of `@project/storage`.
