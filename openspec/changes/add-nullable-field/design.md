## Context

Currently, when a field's value is cleared in the editor, `patchField` writes `"null"` (the literal string `null`) into the HJSON source. This works for required fields where `null` is a valid sentinel, but for optional fields (like Mindustry content properties that may not exist in schema) the field should disappear entirely from the serialized output.

The `HjsonObjectNode` has `patchField` and `insertField` but no `removeField`. `patchField` delegates to `FieldInfo.replaceValue` which surgically replaces text between `valueStart` and `valueEnd`, and only fires when the field already exists in source.

## Goals / Non-Goals

**Goals:**
- Add `removeField(key)` to `HjsonObjectNode` that removes a key+value from the HJSON source string
- Add `nullable?: boolean` (default `false`) to the `Field` interface
- When `nullable === true` and value is `undefined`, call `removeField` instead of patching to `"null"`
- Surplus whitespace, comma, and newline preceding the removed field should be cleaned up

**Non-Goals:**
- Changing behavior of non-nullable fields (they still patch to `"null"`)
- Bulk removal or reordering of fields
- Exposing `removeField` beyond what `FieldRenderer` needs

## Decisions

1. **`removeField` implementation**: Use `FieldInfo` returned by `field(key)` to get the `start` and `end` positions of the full field (key, colon, value including surrounding whitespace), then slice it out of `original`. This mirrors the surgical approach of `replaceValue`.

2. **Whitespace cleanup**: After removing the field span, trim any leading comma (with surrounding whitespace/newlines) before the field, so the result is clean HJSON. If removing the last field, trim trailing whitespace.

3. **`nullable` field interface**: Add `nullable?: boolean` alongside `hiddenIfDefault?: boolean` on `Field`. Defaults to `false` via destructuring in `patchValue`.

4. **No new external dependencies**: All string manipulation stays within the existing `@project/hjson` package.

## Risks / Trade-offs

- **Edge case – field is the only content in a `{}` block**: After removal, the braces will be empty. This is valid HJSON and acceptable.
- **Edge case – field spans multiple lines**: The `start`/`end` positions in `FieldInfo` are absolute character indices from the original string, so multi-line fields are handled correctly by slicing.
- **Backward compatibility**: `nullable` defaults to `false`, so existing `Field` definitions unaffected.
