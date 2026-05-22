## ADDED Requirements

### Requirement: Locale-prefixed routes
The system SHALL serve all application routes under a locale path prefix that identifies the display language.

#### Scenario: Routes are prefixed
- **WHEN** the user visits `/en/about`
- **THEN** the about page SHALL render with English locale
- **WHEN** the user visits `/vi/about`
- **THEN** the about page SHALL render with Vietnamese locale

#### Scenario: Validate locale param
- **WHEN** the user visits `/fr/editor` (unsupported locale)
- **THEN** the system SHALL redirect to `/en/editor`

### Requirement: Bare path redirect
The system SHALL redirect requests to bare paths (without locale prefix) to the user's preferred locale.

#### Scenario: Redirect bare path
- **WHEN** a user with English browser settings visits `/editor`
- **THEN** the system SHALL redirect to `/en/editor`
- **WHEN** a user with Vietnamese browser settings visits `/editor`
- **THEN** the system SHALL redirect to `/vi/editor`

### Requirement: Dynamic HTML lang attribute
The system SHALL set the `<html lang>` attribute to match the current locale from the URL.

#### Scenario: lang attribute matches URL locale
- **WHEN** the user visits `/vi/about`
- **THEN** the `<html>` element SHALL have `lang="vi"`
- **WHEN** the user visits `/en/about`
- **THEN** the `<html>` element SHALL have `lang="en"`

### Requirement: SSR renders correct locale
The system SHALL render pages server-side in the locale specified by the URL prefix.

#### Scenario: SSR with locale prefix
- **WHEN** the server receives a request for `/vi/editor`
- **THEN** the server-rendered HTML SHALL contain Vietnamese text
