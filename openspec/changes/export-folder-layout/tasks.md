## 1. Schema Validation

- [ ] 1.1 Add `v.regex(/^[a-zA-Z0-9._-]+$/)` pipe to `name` field in `ProjectInfoSchema` in `packages/validation/src/index.ts`
- [ ] 1.2 Add auto-sanitization in `validateProject()` in `packages/core/src/index.ts`: if name has invalid chars, sanitize it (replace with `-`, collapse, trim), log warning, proceed
- [ ] 1.3 Export `sanitizeFilename` logic from `@project/utils` or keep inline in core for the auto-sanitize fallback

## 2. JsonExporter Folder Nesting

- [ ] 2.1 In `JsonExporter.export()`, read `context.project.name` and prefix all ZIP entry names with `<name>/`
- [ ] 2.2 Update existing ZIP entry scenarios to reflect new nested paths

## 3. Tests

- [ ] 3.1 Unit test: ProjectInfoSchema rejects names with spaces/special chars
- [ ] 3.2 Unit test: Auto-sanitize on load converts invalid names to valid ones
- [ ] 3.3 Unit test: JsonExporter entries are prefixed with project name
