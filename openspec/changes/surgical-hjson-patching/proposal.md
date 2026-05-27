## Why

The current HJSON library provides structured parsing but lacks a direct API for performing surgical updates on the original source string using that metadata. Developers currently have to manually calculate indices from `FieldInfo`, which is error-prone. Additionally, comprehensive testing for various data types and formatting conditions (like comments and unquoted strings) in a surgical patch context is missing.

## What Changes

- **HJSON Library Enhancements**: Add convenience methods to `FieldInfo` and `StructuredObjectNode` to facilitate surgical patching (e.g., `patchValue(originalContent, newValue)`).
- **Comprehensive Testing**: Add a new test suite specifically for surgical patching, covering all data types (strings, numbers, booleans, null) and complex HJSON formatting (unquoted strings, comments, multiline strings).
- **Validation Data**: Use real-world Mindustry mod HJSON examples for testing to ensure robustness.

## Capabilities

### New Capabilities
- `surgical-patching`: Provide high-level APIs for patching HJSON fields while preserving source formatting and comments.

### Modified Capabilities
- None

## Impact

- `packages/hjson/src/structured.ts`: New methods added to `FieldInfo`.
- `packages/hjson/tests/patching.test.ts`: New test file.
- `apps/web/src/components/editor/panel/ModHjsonPanel.tsx`: Potentially refactored to use the new API.
