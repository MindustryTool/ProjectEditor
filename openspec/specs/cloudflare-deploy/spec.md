## ADDED Requirements

### Requirement: Cloudflare Vite plugin installed
The system SHALL include the `@cloudflare/vite-plugin` in the Vite build pipeline.

#### Scenario: Plugin is installed
- **WHEN** the project dependencies are installed
- **THEN** `@cloudflare/vite-plugin` SHALL be present in `devDependencies`

#### Scenario: Plugin is configured
- **WHEN** Vite builds the project
- **THEN** the Cloudflare plugin SHALL be registered in `vite.config.ts` before `tanstackStart()`

### Requirement: Wrangler CLI available
The system SHALL have `wrangler` available as a dev dependency for deployment and type generation.

#### Scenario: Wrangler is installed
- **WHEN** the project dependencies are installed
- **THEN** `wrangler` SHALL be present in `devDependencies`

### Requirement: Cloudflare Workers configuration
The system SHALL provide a `wrangler.jsonc` configuration file for Cloudflare Workers deployment.

#### Scenario: Config file exists
- **WHEN** the project is built for deployment
- **THEN** `wrangler.jsonc` SHALL exist in the project root with compatible Cloudflare Workers settings

### Requirement: Deploy script
The system SHALL provide an npm script to deploy the application to Cloudflare Workers.

#### Scenario: Deploy command exists
- **WHEN** `npm run deploy` is executed
- **THEN** the project SHALL build and deploy to Cloudflare Workers using Wrangler

#### Scenario: Type generation script
- **WHEN** `npm run cf-typegen` is executed
- **THEN** Wrangler SHALL generate TypeScript types for Cloudflare bindings
