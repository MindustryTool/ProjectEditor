## Context

ExportMenu currently passes `projectContext.project.name` directly as the download filename. Project names like "My Mod v2!" produce filenames with spaces and special chars that cause issues on Windows (illegal chars: `<>:"/\|?*`), macOS, and Linux. The `.zip` extension is appended by the download handler.

The export dialog offers a text input for the user to edit the filename, but provides no validation or guidance.

## Goals / Non-Goals

**Goals:**
- Auto-sanitize the initial filename when the export dialog opens
- Reject or correct invalid characters as the user types
- Provide inline visual feedback when the filename is invalid
- Keep the sanitization cross-platform (Windows + macOS + Linux safe)

**Non-Goals:**
- Transliterate non-Latin characters (they are simply stripped)
- Enforce unique filenames (no conflict detection — one-off exports)
- Modify the actual project name — only the download filename is affected

## Decisions

1. **Inline utility in `ExportMenu.tsx`** (not a shared package)
   - `export-filename-sanitization` is a thin pure function (~15 lines)
   - Placing it in `packages/utils` adds import overhead for a single-use concern
   - If another consumer needs it later, extraction is trivial
   - **Alternative considered**: `packages/utils` — rejected to avoid premature abstraction

2. **Sanitization algorithm:**
   - Replace any character not matching `[a-zA-Z0-9._-]` with `-`
   - Collapse consecutive `-` into single `-`
   - Trim leading/trailing `-` and `.`
   - Enforce max 200 chars (NTFS limit is 255, leaving room for `.zip`)
   - If result is empty string after sanitization, fall back to `"export"`

3. **Validation UX:**
   - Show a red border + error message below the input if sanitized result differs from what the user typed, or if the result would be empty
   - The dialog Download button remains active — validation is advisory, not blocking (user can always download with whatever name)

4. **`.zip` stripping**: Keep existing behavior of stripping `.zip` suffix on input change; no change needed there.

## Risks / Trade-offs

- [Info loss] Replacing special chars with `-` may produce ambiguous names (e.g., "Foo/Bar" vs "Foo-Bar") → Acceptable for a download filename; user can see result in the input
- [Empty result edge case] A name like "!!!???" becomes empty → Fallback to `"export"`
- [Existing saved filenames] No migration needed — filenames are not persisted, only generated per-session
