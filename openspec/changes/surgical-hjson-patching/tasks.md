## 1. Enhance HJSON API

- [x] 1.1 Add `replaceValue(original: string, newValue: string): string` to `FieldInfo` interface and implement it in `StructuredObjectNode`'s field creation logic.
- [x] 1.2 Add `patchField(original: string, key: string, newValue: string): string` to `StructuredObjectNode` class.
- [x] 1.3 Add `insertField(original: string, key: string, newValue: string): string` to `StructuredObjectNode` to handle missing fields.

## 2. Implement Surgical Patching Tests

- [x] 2.1 Create `packages/hjson/tests/patching.test.ts`.
- [x] 2.2 Add tests for all data types (string, number, boolean, null) using surgical patching.
- [x] 2.3 Add tests for patching with comments and unquoted strings using the "Exogenesis" mod example:
  ```hjson
  { 
     displayName: "[cyan]Exogenesis", 
     name: exogenesis, 
     author: "[blue]AureusStratus", 
     description: "A mod that adds in a butt load of content", 
     minGameVersion: "151", 
     # This is a 
     version: "[blue]1.9.1", 
  }
  ```
- [x] 2.4 Verify that comments and whitespace are preserved after multiple patches.

## 3. Refactor UI Component (Optional but Recommended)

- [x] 3.1 Update `ModHjsonPanel.tsx` to use the new `patchField` or `FieldInfo.replaceValue` API instead of manual slicing.
