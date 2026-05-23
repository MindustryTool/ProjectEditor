## Context

The editor currently has an `ExportMenu` component with two placeholder items ("Export as JSON", "Export as Image") that have no handlers. The `@project/zip` package already provides `createZip()` for building ZIP archives from entries. The `@project/core` package contains domain types (`ProjectInfo`, `ProjectContext`, `ProjectLanguage`) and event system. The `@project/fs` package provides `ProjectFileSystem` for reading files from OPFS. Each project has a language (`json`, `java`, `javascript`) that determines how mod content is structured.

## Goals / Non-Goals

**Goals:**
- Define an `Exporter` interface in `@project/core` that accepts `ProjectContext` and returns a ZIP `Uint8Array`
- Implement `JsonExporter` that recursively collects all files from the project root and creates a ZIP archive
- Route to the correct exporter based on `project.language` (initially only JSON; Java/JS exporters are stubs or error states)
- Replace the export dropdown menu with a single export button wired to the exporter system
- Remove export-as-image placeholder and its translation keys

**Non-Goals:**
- Exporting as image (removed entirely)
- Language-specific exporters beyond JSON (Java/JS exporters are placeholders for future work)
- UI feedback during export (progress bar, success toast — deferred)
- Export format selection (unified button always triggers the language-appropriate exporter)

## Decisions

1. **Interface in `@project/core`** — The `Exporter` interface belongs in `@project/core` because it depends only on domain types (`ProjectContext`) and the ZIP utility is a separate package. Core is dependency-light; adding a dependency on `@project/zip` is acceptable since ZIP creation is a core domain capability.

2. **Signature: `export(context: ProjectContext): Promise<Uint8Array>`** — Accepts the full `ProjectContext` (which bundles `ProjectInfo`, `ProjectFileSystem`, and `EventBus`) so exporters can read files and emit progress events. Returns a `Uint8Array` (the ZIP bytes) rather than triggering a download, keeping IO (download) separate from business logic.

3. **Single export button** — Since the project language determines the exporter, there is no need for a dropdown. A single button invokes the appropriate exporter and triggers a download. The `ExportMenu` component is simplified from a `DropdownMenu` to a single `button`.

4. **Removing image export** — Image export was a placeholder with no implementation, no spec, and no clear use case (Mindustry mods are code/text, not images). Removing it reduces maintenance surface.

5. **Exporter registry** — A simple `getExporter(language): Exporter` function maps `ProjectLanguage` to exporter instances. This avoids a service locator pattern while remaining extensible. Unknown languages throw an error rather than silently failing.

## Risks / Trade-offs

- **Dependency on `@project/zip` in `@project/core`**: Core gains a dependency on a utility package. If ZIP creation moves to a web-worker or WASM in the future, this interface insulates consumers. → Mitigation: The interface returns `Uint8Array`, so the ZIP implementation can change without affecting consumers.
- **Only JSON exporter implemented**: Java and JS projects will fail at export. → Mitigation: Clear error message guiding users to implement or noting "not yet supported".
- **Memory pressure**: Collecting all files into a single ZIP could exhaust memory for large projects. → Mitigation: Deferred — add streaming or progress reporting as a follow-up.
- **Download coupling**: The button triggers both export and download. If download logic changes (e.g., to use File System Access API), the button component needs updating. → Accepted: small, contained UI component.
