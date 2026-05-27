## Context

The `importProject` function in `packages/core/src/importer.ts` extracts all zip entries and returns them after stripping the root folder prefix. It already has a filter that removes empty/directory entries. Adding a git-entry filter is a straightforward extension of that existing filter step.

## Goals / Non-Goals

**Goals:**
- Exclude entries whose path starts with `.git/` (the `.git` directory)
- Exclude entries named `.gitignore`, `.gitattributes`, `.gitmodules` at any depth
- Keep the filter in `importProject` so all consumers benefit

**Non-Goals:**
- Not a configurable filter — git files are always excluded
- Not excluding arbitrary hidden files (only git-related)

## Decisions

- **Filter in the scopedEntries pipeline**: The existing `.filter()` chain already strips empty/directory entries. Add `&& !isGitPath(e.name)` to the same filter. Simple, localized change.
- **Helper function `isGitPath`**: A small predicate that checks for `.git/` prefix or `.git*` filename at any path depth. Keeps the filter readable.
- **No regex**: Simple string checks (`startsWith` + `endsWith` + `includes`) are more readable and performant.

## Risks / Trade-offs

- **False positives if a mod folder is literally named `.git`**: Extremely unlikely — Mindustry mods don't have `.git` folders.
