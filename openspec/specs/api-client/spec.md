## ADDED Requirements

### Requirement: Axios instance configuration
The system SHALL provide a pre-configured axios instance with `baseURL` set to `https://content.mindustry-tool.com/api/v2/`, a default timeout of 30 seconds, and JSON Accept and Content-Type headers.

#### Scenario: Instance uses correct base URL
- **WHEN** the axios instance is created
- **THEN** its `baseURL` SHALL be `https://content.mindustry-tool.com/api/v2/`

#### Scenario: Instance has default timeout
- **WHEN** a request is made
- **THEN** the request SHALL time out after 30 seconds if no response is received

#### Scenario: Instance sends JSON headers
- **WHEN** any request is dispatched
- **THEN** the `Accept` header SHALL be `application/json`
- **AND** the `Content-Type` header SHALL be `application/json` for requests with a body

### Requirement: Typed HTTP method wrappers
The system SHALL expose typed `get`, `post`, `put`, `delete` methods on the client class that accept a path (relative to base URL), optional typed request body, optional query params, and optional `AbortSignal`.

#### Scenario: GET request
- **WHEN** `client.get("/schematics")` is called
- **THEN** a GET request is sent to `https://content.mindustry-tool.com/api/v2/schematics`

#### Scenario: POST request with body
- **WHEN** `client.post("/schematics", { name: "test" })` is called
- **THEN** a POST request is sent with the JSON body `{ "name": "test" }`

#### Scenario: Request with AbortSignal
- **WHEN** `client.get("/schematics", { signal })` is called with an AbortSignal
- **THEN** the request SHALL be cancellable via that signal

### Requirement: Request interceptor for auth token
The system SHALL include a request interceptor that reads an auth token from a configurable source and attaches it as a Bearer token in the `Authorization` header if present.

#### Scenario: Token is injected
- **WHEN** a request is made and a token is available
- **THEN** the `Authorization` header SHALL contain `Bearer <token>`

#### Scenario: No token sent when absent
- **WHEN** a request is made and no token is available
- **THEN** no `Authorization` header SHALL be added

### Requirement: Response error normalization
The system SHALL intercept error responses and normalize them into a typed `ApiError` object with `status` (HTTP status number), `message` (error description string), and optional `details` (server-provided payload).

#### Scenario: Server returns 4xx error
- **WHEN** the server responds with status 400 and body `{ "error": "Bad Request" }`
- **THEN** the client rejects with an `ApiError` where `status` is 400 and `message` is `"Bad Request"`

#### Scenario: Network error produces ApiError
- **WHEN** a request fails due to a network error
- **THEN** the client rejects with an `ApiError` where `status` is `0` and `message` describes the network failure

### Requirement: Package exports
The package SHALL export the client class, the `ApiError` type, and TypeScript type definitions for request and response payloads from `src/index.ts`.

#### Scenario: Client class is exported
- **WHEN** `import { MindustryApiClient } from "@project/api"` is used
- **THEN** the imported value SHALL be the client constructor

#### Scenario: ApiError type is exported
- **WHEN** `import { ApiError } from "@project/api"` is used
- **THEN** the imported value SHALL be the `ApiError` class

### Requirement: Base URL constant in @project/config
The system SHALL add an `API_BASE_URL` constant exported from `@project/config` with the value `"https://content.mindustry-tool.com/api/v2/"`.

#### Scenario: API_BASE_URL is available
- **WHEN** `import { API_BASE_URL } from "@project/config"` is used
- **THEN** the value SHALL be `"https://content.mindustry-tool.com/api/v2/"`
