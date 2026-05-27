## Context

The HJSON library currently provides `FieldInfo` which contains `valueStart` and `valueEnd` positions. Surgical patching requires slicing the original string at these indices. Providing a high-level API will make this process safer and more intuitive.

## Goals / Non-Goals

**Goals:**
- Add `replaceValue(original, newValue)` to `FieldInfo`.
- Add `patchField(original, key, newValue)` to `StructuredObjectNode`.
- Create a comprehensive test suite for these methods using complex HJSON examples.
- Ensure all data types and formatting conditions (comments, unquoted strings) are handled correctly.

**Non-Goals:**
- Implement automatic indentation for new fields (this can be a separate improvement).
- Support patching deep nested objects in a single call (though the API should allow it via recursion).

## Decisions

- **API Location**: Add methods directly to `FieldInfo` interface and `StructuredObjectNode` class in `packages/hjson/src/structured.ts`.
- **Value Serialization**: The patching API will NOT serialize the value itself. It expects a string `newValue`. This allows the caller to decide on formatting (e.g., using `HJSON.stringify(val)`).
- **Test Strategy**: Use `vitest` for unit tests in `packages/hjson/tests/patching.test.ts`.

## Risks / Trade-offs

- **[Risk]**: Index-based patching is sensitive to the accuracy of the parser.
- **[Mitigation]**: The parser already provides these indices for structured output. The new tests will specifically verify the accuracy of these indices during patching.
