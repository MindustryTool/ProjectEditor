## Why

When importing a project from a zip that was created from a git repository (e.g., downloaded from GitHub), the zip includes `.git/` directory, `.gitignore`, `.gitattributes`, and other git-related files. These are not part of the Mindustry mod and should be excluded from the imported project.

## What Changes

- Modify `importProject` in `packages/core/src/importer.ts` to filter out entries whose path starts with `.git` or whose name is `.gitignore`/`.gitattributes`/`.gitmodules`

## Capabilities

### New Capabilities

(none)

### Modified Capabilities
- `project-importer`: Import should exclude git-related files (`.git/` directory and any `.git*` files at any level)

## Impact

- **Modified**: `packages/core/src/importer.ts` (add filter in `importProject`)
