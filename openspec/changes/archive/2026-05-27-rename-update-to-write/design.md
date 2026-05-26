## Context

The `useFileContent` hook in `packages/state/src/hooks/use-file-content.ts` returns an `update` function that writes content through the write queue. This is a simple mechanical rename — no architectural changes required.

## Goals / Non-Goals

**Goals:**
- Rename `UseFileContentResult.update` → `UseFileContentResult.write`
- Update all 4 consumer files that destructure `update` from the hook

**Non-Goals:**
- No behavior or API changes beyond the rename
- No changes to the write queue, store, or persistence logic

## Decisions

- **Simple rename, no deprecation**: The hook is only consumed within this monorepo, so a direct rename with simultaneous consumer updates is safe. No need for a deprecation period.

## Risks / Trade-offs

- Consumers that pull the latest types will get a type error on `.update` — this is the desired signal to update.
