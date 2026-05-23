## Context

The editor file explorer currently renders a static tree (`jsonProjectTree.projectTree`) and syncs every click (file or folder) into `?path=` via `useQueryState("path")`. The project system already maintains an in-memory file-tree snapshot in the project store, and filesystem queries are expected to be served from that snapshot.

This change makes the explorer reflect the active project state and refines selection semantics so that URL state represents an editor-relevant file selection rather than navigation clicks.

## Goals / Non-Goals

**Goals:**
- Render the file explorer tree from the active project’s cached file-tree snapshot.
- Ensure folder clicks only expand/collapse and do not write `?path=`.
- Preserve URL-driven selection for deep-linking to files.

**Non-Goals:**
- Implementing a new filesystem backend or changing snapshot refresh semantics.
- Adding new routing params beyond `?path=`.
- Introducing virtualized rendering or performance optimizations beyond basic memoization.

## Decisions

- **Source of truth for the tree**: Use the current project’s cached tree snapshot as the input data to build the UI tree model (rather than static JSON).
  - *Rationale*: Ensures the explorer matches the actual project state and updates when the snapshot refreshes after FS mutations.
  - *Alternatives considered*: Calling `fs.listFiles("/", { recursive: true })` on render. Rejected because it introduces async UI complexity; the snapshot is already maintained as in-memory state for this purpose.

- **Selection vs navigation separation**: Treat `?path=` as “selected file path” and keep folder expansion as local UI state.
  - *Rationale*: Folder expansion is transient UI navigation; selection is editor state that benefits from being shareable/bookmarkable.
  - *Alternatives considered*: Keep writing folders to `?path=` and update the editor to handle folders. Rejected because it makes editor state ambiguous and causes noisy URL updates during navigation.

- **Tree construction**: Build a `TreeNode` structure from snapshot entries (directory and file paths) in-memory and memoize it based on snapshot identity.
  - *Rationale*: Keeps the UI component synchronous and predictable; avoids repeated rebuilds on unrelated renders.

## Risks / Trade-offs

- **[Risk] Snapshot may be empty or stale** → Mitigation: render empty state gracefully; rely on existing snapshot refresh rules after FS mutations.
- **[Risk] `?path=` may reference a file not present in snapshot** → Mitigation: keep `?path=` value as-is but only visually select when a matching node exists.
- **[Trade-off] Folder clicks no longer become shareable deep links** → Mitigation: if folder deep-linking is needed later, introduce a separate query param (e.g., `?dir=`) rather than overloading `?path=`.
