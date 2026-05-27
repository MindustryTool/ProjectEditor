## Context

Two components currently duplicate the pattern: create a `Blob` from `ArrayBuffer` with `{ type: "image/png" }`, call `URL.createObjectURL(blob)`, and manually revoke via `useEffect` cleanup. The hook will live in the `@project/state` package alongside `useFileContent` and `useFileContentString`, sharing the same dependency conventions (React 19, TypeScript).

This hook is intentionally image-only — it hardcodes `image/png` as the MIME type and does not accept a MIME parameter.

## Goals / Non-Goals

**Goals:**
- Single hook that takes `ArrayBuffer | null` and returns `string | null`
- Hardcodes `image/png` Blob type (no MIME parameter)
- Auto-revokes previous URL when data changes
- Auto-revokes on unmount
- Zero external dependencies (uses only `React` built-ins)
- Drop-in replacement for the 2 existing manual usages in sprite components

**Non-Goals:**
- Not a generic `useObjectURL` or `useBlobUrl` — image sprites only
- Does not handle `useFileContent` lifecycle (that's the caller's concern)
- Does not support non-image MIME types (callers like ExportMenu keep their explicit `URL.createObjectURL`)

## Decisions

- **No MIME parameter, always `image/png`**: Both current callers render sprites which are always PNG. Removes unnecessary API surface.
- **useMemo + useEffect pattern**: Same approach already used manually in components. `useMemo` creates the URL when `data` changes; `useEffect` returns a cleanup that revokes the previous URL. No new patterns introduced.
- **Place in `@project/state`**: Follows existing convention where `useFileContent` lives. Consumers import from `@project/state` not from deep paths.

## Risks / Trade-offs

- **URL lifetime tied to hook lifecycle**: If a consumer stores the URL outside React (e.g., in a ref), it may outlive the revoke. Mitigation: consumers should only use the URL while mounted.
- **Hardcoded `image/png`**: If future sprites use a different format (e.g., WebP), the hook needs updating. Mitigation: trivial change — update the Blob constructor type string.
