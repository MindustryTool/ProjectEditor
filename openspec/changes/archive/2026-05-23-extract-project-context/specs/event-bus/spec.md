## ADDED Requirements

### Requirement: EventBus type and implementation
The system SHALL provide an `EventBus` type with typed event maps for publish/subscribe communication.

#### Scenario: Subscribe to an event
- **WHEN** `events.on("file:changed", handler)` is called
- **THEN** the handler is invoked whenever the event is emitted

#### Scenario: Unsubscribe from an event
- **WHEN** the returned `Unsubscribe` function is called
- **THEN** the handler is no longer invoked for that event

#### Scenario: Emit an event
- **WHEN** `events.emit("file:changed", payload)` is called
- **THEN** all subscribed handlers receive the payload

#### Scenario: Typed event map
- **WHEN** an event is emitted
- **THEN** the payload type matches the declared event map type

### Requirement: Project event types
The system SHALL define an `ProjectEventMap` with standard project lifecycle events.

#### Scenario: file:changed event
- **WHEN** a file is written, deleted, or renamed
- **THEN** a `file:changed` event is emitted with `{ path: string, kind: "write" | "delete" | "rename" }`

#### Scenario: project:saved event
- **WHEN** the project is saved to storage
- **THEN** a `project:saved` event is emitted

#### Scenario: project:opened event
- **WHEN** a project is loaded and the context is initialized
- **THEN** a `project:opened` event is emitted with `{ projectId: string }`

### Requirement: EventBus factory function
The system SHALL provide a `createEventBus()` factory that returns a new `EventBus` instance.

#### Scenario: createEventBus returns independent bus
- **WHEN** `createEventBus()` is called twice
- **THEN** each bus has independent subscriber lists

#### Scenario: Default event map
- **WHEN** `createEventBus()` is called without type params
- **THEN** it supports arbitrary named events with any payload
