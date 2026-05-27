## REMOVED Requirements

### Requirement: StorageBackend interface
**Reason**: The `@project/storage` package is removed. Storage functionality is absorbed into `useAppStore` with zustand persist.
**Migration**: Use `useAppStore` actions instead of `StorageBackend` or imports from `@project/storage`.

### Requirement: Default storage instance
**Reason**: The `@project/storage` package is removed.
**Migration**: All consumers import from `@project/state` (`useAppStore`) instead.

### Requirement: StorageBackend is swappable
**Reason**: The interface abstraction is no longer needed.
**Migration**: N/A — storage is handled by zustand persist middleware.

### Requirement: ProjectRecord type unchanged
**Reason**: The type moves to `@project/state` but its shape is preserved.
**Migration**: Import `ProjectRecord` from `@project/state` instead of `@project/storage`.
