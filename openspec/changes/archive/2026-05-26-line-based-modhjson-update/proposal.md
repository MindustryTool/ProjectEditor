## Why

Currently, the ModHjsonPanel regenerates the entire `mod.hjson` file content on every keystroke via `update(toHjson(form.state.values))`. This means changing a single character in one field rewrites the whole file to disk, which is wasteful — it overwrites all lines even when only one field changed. For a file with many fields, this causes unnecessary disk I/O and risks race conditions if external changes happen on other lines simultaneously.

## What Changes

- Replace the full-file `update(toHjson(...))` call on each field change with a line-targeted update that only modifies the specific line corresponding to the changed field
- Keep a reference to the original file content (as lines array) and swap out only the changed line before calling `update`
- When a dependency is added or removed, still update the entire dependencies line (but not other unrelated lines)
- When the file is initially parsed, preserve the raw line array so subsequent updates can mutate individual lines

## Capabilities

### New Capabilities
- `line-targeted-file-update`: Mechanism in the mod.hjson editor to update individual lines of the file rather than rewriting the full content on every change

### Modified Capabilities
- `mod-hjson-editor`: Change the save/persistence behavior from full-file rewrite to line-targeted updates. This is a spec-level behavioral change because the update strategy affects how external concurrent modifications are handled.

## Impact

Affects only `apps/web/src/components/editor/panel/ModHjsonPanel.tsx`. No changes to `@project/state`, `useFileContent`, or the file-content-store. The `update` API stays the same — only the argument passed to it changes from "full file rebuild" to "modified line content".
