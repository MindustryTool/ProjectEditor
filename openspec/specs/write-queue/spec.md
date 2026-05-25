## ADDED Requirements

### Requirement: WriteQueue schedules batched persistence
The system SHALL provide a `WriteQueue` class that manages debounced file writes to disk via a single flush queue. The WriteQueue SHALL be decoupled from any status machine — it enqueues content and reports completion without setting any status fields.

#### Scenario: Enqueue a write
- **WHEN** `queue.enqueue(path, content, version)` is called
- **THEN** the write SHALL be scheduled in a debounce window (default 500ms), cancelling any previously queued write for the same path

#### Scenario: Flush queue immediately
- **WHEN** `queue.flush()` is called
- **THEN** all pending writes SHALL be executed immediately, regardless of debounce timer

#### Scenario: Batch multiple paths
- **WHEN** writes for different paths are enqueued within the debounce window
- **THEN** they SHALL all be flushed together in a single batch (Promise.all) when any timer fires

#### Scenario: Flush on project close
- **WHEN** `queue.dispose()` is called (on project close)
- **THEN** all pending writes SHALL be flushed first, then the queue SHALL reject any future enqueues

#### Scenario: Write result reported via promise resolution
- **WHEN** a disk write succeeds
- **THEN** the enqueue promise SHALL resolve
- **AND** the consumer SHALL call `markPersisted()` to sync versions

#### Scenario: Write error reported via promise rejection
- **WHEN** a disk write fails
- **THEN** the enqueue promise SHALL reject with the error
- **AND** the consumer SHALL call `setBufferError()` to record the error
