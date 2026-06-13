## ADDED Requirements

### Requirement: Build-time data package exists
The system SHALL provide a `@project/data` package in `packages/data/` that fetches base game content at build time and emits typed TypeScript files.

#### Scenario: Package is installable
- **WHEN** another package imports from `@project/data`
- **THEN** the import SHALL resolve correctly

### Requirement: Fetch all base game content endpoints
The build script SHALL fetch all base game content endpoints from `https://content.mindustry-tool.com/api/v2/` and filter out mod content (`mod === null`). The following endpoints SHALL be fetched:
- `GET /items`
- `GET /blocks`
- `GET /env-blocks`
- `GET /liquids`
- `GET /units`
- `GET /sectors`
- `GET /effects`
- `GET /statuses`
- `GET /sounds`

#### Scenario: All endpoints are fetched
- **WHEN** the build script runs
- **THEN** every endpoint in the list SHALL be called

#### Scenario: Mod content is filtered out
- **WHEN** the build script processes response data
- **THEN** items with `mod !== null` SHALL be excluded from the output

### Requirement: Build fails on fetch error
If any API request fails (network error, non-2xx status), the build script SHALL exit with a non-zero exit code and a descriptive error message.

#### Scenario: Network failure causes build failure
- **WHEN** an API endpoint is unreachable
- **THEN** the script SHALL exit with code 1 and print the failed endpoint

#### Scenario: Non-2xx response causes build failure
- **WHEN** an API endpoint returns status >= 300
- **THEN** the script SHALL exit with code 1 and print the status code

### Requirement: Generated TypeScript files with types
The build script SHALL emit one TypeScript file per content type under `src/generated/`, each exporting a typed `const` array with `as const`. The types SHALL be imported from `@project/api`.

#### Scenario: Items file is generated
- **WHEN** the build completes successfully
- **THEN** `src/generated/items.ts` SHALL export `baseItems: readonly Item[]`

#### Scenario: Blocks file is generated
- **WHEN** the build completes successfully
- **THEN** `src/generated/blocks.ts` SHALL export `baseBlocks: readonly Block[]`

#### Scenario: Each content type has a file
- **WHEN** the build completes successfully
- **THEN** there SHALL be files for items, blocks, env-blocks, liquids, units, sectors, effects, statuses, and sounds

### Requirement: Package index re-exports all generated data
The `src/index.ts` of `@project/data` SHALL re-export all generated arrays for convenient importing.

#### Scenario: Single import gets all data types
- **WHEN** `import { baseItems, baseBlocks } from "@project/data"` is used
- **THEN** both arrays SHALL be available

### Requirement: Retry with backoff on transient failures
The fetch script SHALL retry up to 3 times with exponential backoff (1s, 2s, 4s) before treating a fetch as failed.

#### Scenario: Transient failure is retried
- **WHEN** an API request fails on the first attempt
- **THEN** the script SHALL retry up to 2 more times with increasing delays
