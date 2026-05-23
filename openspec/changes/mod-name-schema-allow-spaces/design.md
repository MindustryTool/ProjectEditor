## Context

`ModNameSchema` in `packages/validation/src/mod-hjson/schema.ts` uses `/^[a-z][a-z0-9-]*$/` which rejects spaces. This is a single-line regex change in one file.

## Goals / Non-Goals

**Goals:**
- Allow space characters in `ModNameSchema`
- Update the error message to include spaces in the description

**Non-Goals:**
- No changes to display name, author, or other fields
- No UI changes in `ModHjsonPanel`
- No changes to the `dependencies` validation behavior (dependencies are mod identifiers and should logically follow the same rules)

## Decisions

1. **Single regex change** — add space to the character class: `/^[a-z][a-z0-9- ]*$/`. No additional validation logic needed.
2. **Shared schema for name and dependencies** — since `ModNameSchema` is used for both the `name` field and the `dependencies` array, the change applies uniformly. Dependencies already accept the same characters as `name`, so consistency is preserved.

## Risks / Trade-offs

- **Space in dependency names** — dependencies are mod identifiers. If spaces are allowed in mod names, they should also be valid in dependency references for consistency.
