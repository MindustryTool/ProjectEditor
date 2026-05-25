## NEW Requirements

### Requirement: selectEntry
A function `selectEntry(projectId: string, path: string): (state: FileContentStore) => FileContentEntry | undefined` SHALL exist in the store module.

- It SHALL compute the composite key internally via `cacheKey`
- It SHALL return a selector function suitable for `useFileContentStore(selectEntry(...))`

#### Scenario: selectEntry returns entry
- **GIVEN** `projectId = "proj1"`, `path = "src/main.ts"`
- **WHEN** `selectEntry("proj1", "src/main.ts")` is passed to `useFileContentStore`
- **THEN** it SHALL return the entry at `fileContents["proj1::src/main.ts"]`

### Requirement: selectIsSaving
A function `selectIsSaving(projectId: string, path: string): (state: FileContentStore) => boolean` SHALL exist in the store module.

- It SHALL compute the composite key internally via `cacheKey`
- It SHALL return a selector function suitable for `useFileContentStore(selectIsSaving(...))`

#### Scenario: selectIsSaving returns boolean
- **GIVEN** `projectId = "proj1"`, `path = "src/main.ts"`
- **WHEN** `selectIsSaving("proj1", "src/main.ts")` is passed to `useFileContentStore`
- **THEN** it SHALL return whether `savingPaths` includes `"proj1::src/main.ts"`

### Requirement: getEntry
A function `getEntry(projectId: string, path: string): FileContentEntry | undefined` SHALL exist in the store module.

- It SHALL compute the composite key internally via `cacheKey`
- It SHALL use `useFileContentStore.getState()` for non-reactive access

#### Scenario: getEntry returns entry directly
- **GIVEN** `projectId = "proj1"`, `path = "src/main.ts"`
- **WHEN** `getEntry("proj1", "src/main.ts")` is called
- **THEN** it SHALL return the entry at `fileContents["proj1::src/main.ts"]` via `getState()`

## REMOVED Requirements

### Requirement: cacheKey is exported
The `cacheKey` function SHALL remain private in the store module.
