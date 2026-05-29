## Requirements

### Requirement: ValidationResults class encapsulates results data and derived views
The system SHALL provide an immutable `ValidationResults` class that holds `resultsByPath: Record<string, ValidationResult[]>` and provides derived `summary` and ancestor-path rollup views.

#### Scenario: Create empty instance
- **WHEN** `new ValidationResults()` is constructed with no arguments
- **THEN** `resultsByPath` SHALL be an empty object, `summary` SHALL be `{total: 0, errors: 0, warnings: 0, infos: 0, deprecated: 0}`, and `getRollup()` SHALL return an empty object

#### Scenario: Create instance with results
- **WHEN** `new ValidationResults({ "/path/file.hjson": [...] })` is constructed
- **THEN** `summary` SHALL reflect the counts from the provided results and `getRollup()` SHALL return ancestor-path aggregated counts

### Requirement: setResults returns new instance
`ValidationResults.setResults(path, results)` SHALL return a new `ValidationResults` instance with the results for the given path replaced, with `summary` and rollup recomputed.

#### Scenario: Replace existing results
- **WHEN** `instance.setResults("/a.hjson", [{severity: 0, ...}])` is called
- **THEN** a new instance SHALL be returned with the updated results for that path, and the original instance SHALL remain unchanged

#### Scenario: Add results for new path
- **WHEN** `instance.setResults("/new/file.hjson", [...])` is called on an instance that has no entry for that path
- **THEN** a new instance SHALL be returned with the new path added and summary recomputed

### Requirement: clearResults returns new instance
`ValidationResults.clearResults(path)` SHALL return a new `ValidationResults` instance with the results for the given path removed.

#### Scenario: Remove existing path
- **WHEN** `instance.clearResults("/a.hjson")` is called
- **THEN** a new instance SHALL be returned without the entry for that path, and the original instance SHALL remain unchanged

#### Scenario: Clear non-existent path
- **WHEN** `instance.clearResults("/nonexistent.hjson")` is called and the path does not exist
- **THEN** the same instance SHALL be returned (no-op)

### Requirement: clearAll returns empty instance
`ValidationResults.clearAll()` SHALL return a new empty `ValidationResults` instance.

#### Scenario: Clear all results
- **WHEN** `instance.clearAll()` is called on a non-empty instance
- **THEN** a new empty instance SHALL be returned with no results

### Requirement: summary is computed eagerly
`summary` SHALL be computed once during construction and cached for O(1) access.

#### Scenario: Summary access after construction
- **WHEN** `instance.summary` is accessed multiple times
- **THEN** the same object reference SHALL be returned each time

### Requirement: getRollup returns ancestor-path counts
`getRollup()` SHALL return a `Record<string, { error: number; warning: number }>` where each ancestor path segment of every file with results is aggregated with its error and warning counts.

#### Scenario: Rollup for nested paths
- **WHEN** results exist for `/a/b/file.hjson` and `/a/c/file.hjson`
- **THEN** `getRollup()` SHALL contain entries for `/a`, `/a/b`, `/a/c`, `/a/b/file.hjson`, and `/a/c/file.hjson`
