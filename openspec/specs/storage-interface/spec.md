## ADDED Requirements

### Requirement: StorageBackend interface
The system SHALL provide a `StorageBackend` interface that abstracts all persistent storage operations.

#### Scenario: Interface defines project CRUD
- **WHEN** a consumer references `StorageBackend`
- **THEN** the interface SHALL define `saveProject(project: ProjectRecord): Promise<void>`, `getProject(id: string): Promise<ProjectRecord | undefined>`, `getAllProjects(): Promise<ProjectRecord[]>`, and `deleteProject(id: string): Promise<void>`

#### Scenario: Interface defines settings CRUD
- **WHEN** a consumer references `StorageBackend`
- **THEN** the interface SHALL define `saveSetting(key: string, value: unknown): Promise<void>` and `getSetting<T>(key: string): Promise<T | undefined>`

#### Scenario: Interface defines OPFS root access
- **WHEN** a consumer references `StorageBackend`
- **THEN** the interface SHALL define `getOPFSRoot(): Promise<FileSystemDirectoryHandle>`

#### Scenario: Interface is sync-agnostic
- **WHEN** any method on `StorageBackend` is called
- **THEN** the method SHALL return a `Promise`, regardless of whether the underlying implementation is synchronous

### Requirement: Default storage instance
The `@project/storage` module SHALL export a pre-configured default `StorageBackend` instance.

#### Scenario: Default instance is created on import
- **WHEN** the `@project/storage` module is imported
- **THEN** a `storage` singleton SHALL be created and exported, initialized with `LocalStorageAdapter`

#### Scenario: Legacy exports delegate to default instance
- **WHEN** `saveProject`, `getProject`, `getAllProjects`, `deleteProject`, `saveSetting`, `getSetting`, or `getOPFSRoot` are imported from `@project/storage`
- **THEN** each SHALL delegate to the corresponding method on the default `storage` instance

### Requirement: StorageBackend is swappable
The system SHALL allow consumers to create a `StorageBackend` with a different implementation.

#### Scenario: Consumer provides custom adapter
- **WHEN** a consumer creates a `StorageBackend` with a custom implementation
- **THEN** all `StorageBackend` methods SHALL work with that implementation

### Requirement: ProjectRecord type unchanged
The `ProjectRecord` interface SHALL remain as-is and be re-exported from `@project/storage`.

#### Scenario: ProjectRecord fields are preserved
- **WHEN** `ProjectRecord` is imported from `@project/storage`
- **THEN** it SHALL contain `id: string`, `name: string`, `language?: string`, `data: string`, `createdAt: Date`, `updatedAt: Date`
