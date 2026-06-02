## UNCHANGED Requirements

This spec documents that **no behavioral requirements change** as part of merging `@project/state` into `@project/core`. All existing specs in `openspec/specs/` remain valid — only the package import path changes from `@project/state` to `@project/core`.

### Requirement: Public API surface preserved

#### Scenario: All exports remain available from @project/core
- **WHEN** code previously imported from `@project/state`
- **THEN** importing the same symbols from `@project/core` SHALL work identically

#### Scenario: No behavior changes
- **WHEN** the merge is complete
- **THEN** all state stores, hooks, validation utilities, and the write queue SHALL behave identically to before the merge
