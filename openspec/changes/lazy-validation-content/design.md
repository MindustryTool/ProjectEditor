## Context

The `ValidationRunner` currently requires fully-decoded file content as a `string` for every `validate()` call. This means callers must read and decode file content before calling validate — even when no validator matches the file path. The file buffer cache (`fileContentStore`) holds raw `ArrayBuffer` data, which is decoded eagerly before validation.

In `ExportMenu`, `loadAndValidateAll()` reads every project file from the filesystem and validates them all in `handleOpen`, which adds latency between clicking the export button and the dialog appearing. The user may only want to type a filename and download without waiting for full validation.

## Goals / Non-Goals

**Goals:**
- Defer content decoding until after path matching confirms validators exist for that path
- Change `content` parameter from `string` to `() => Promise<string>` through the validation pipeline
- Update all caller sites (`scheduleValidation`, `validateFile` context, `ExportMenu`)
- Move ExportMenu validation from dialog-open to export-click

**Non-Goals:**
- No changes to individual validator logic — validators continue to receive resolved `content: string`
- No changes to the registry or matching system
- No changes to the validation store or result storage

## Decisions

**1. `() => Promise<string>` over `() => string`**
- File reading is inherently async (file system access, ArrayBuffer → string decoding)
- The store holds `ArrayBuffer | undefined`, and decoding via `TextDecoder` is synchronous, but wrapping in a Promise keeps the interface consistent and future-proof for actual async I/O
- **Alternative considered**: `() => string` — simpler but inconsistent if fs reads become async later

**2. Runner calls getter only after checking matches**
- The runner will call `registry.getMatches(path)` first, and only invoke the content getter if `matches.length > 0`
- This is the core optimization — avoids unnecessary content resolution when no validator applies

**3. ExportMenu: validate on export click**
- Move `loadAndValidateAll` from `handleOpen` to `handleDownload`, called before `handleExport`
- The dialog opens instantly with no loading state on the button
- When user clicks "Download", validation runs, then either shows error dialog or proceeds with export
- The button shows a loading state during validation in `handleDownload`

## Risks / Trade-offs

- **Risk**: `handleDownload` may now take longer if there are many files with validators → **Mitigation**: Show loading state on the download button; the loading state was previously on the export button (before dialog open), now it's on the download action where users expect work to happen
- **Risk**: Existing validators that don't use the content getter (the `content` string will still be resolved before being passed to them) → **Mitigation**: The runner resolves the getter before passing to validators, so existing code is unaffected
- **Trade-off**: Change is not fully breaking — the runner's internal signature changes but existing validator functions receive the same `content: string` they always did
