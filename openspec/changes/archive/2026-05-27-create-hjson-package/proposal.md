## Why

HJSON (Human JSON) is a configuration format that extends JSON with comments, trailing commas, quotes-optional keys/strings, multi-line strings, and relaxed syntax — making it far more suitable for hand-edited config files than strict JSON. The project needs a robust, well-typed HJSON parser/serializer in TypeScript with an API familiar to JavaScript developers (matching `JSON.parse`/`JSON.stringify` patterns) and comprehensive error reporting with exact position, type, and error codes.

## What Changes

- New `@project/hjson` TypeScript package with zero runtime dependencies
- `HJSON.parse(text, reviver?)` — parse HJSON string into JavaScript value with detailed typed errors
- `HJSON.stringify(value, replacer?, space?)` — serialize JavaScript value to HJSON string
- `HJSONError` class with typed error codes, row/col/index position, and human-readable messages
- Error code constants (`HJSONErrorCode`) exported as a const object with TypeScript type union
- Full HJSON spec compliance: comments, trailing commas, quotes-optional keys/strings, multi-line strings (with Python-style indent stripping), number formatting, root braced objects
- `HJSON.parseAsync(text)` for streaming/async parsing (non-blocking on large inputs)
- Strong TypeScript types with strict mode, generics for parse return types

## Capabilities

### New Capabilities
- `hjson-parser`: Tokenization and parsing of HJSON text into an AST, then conversion to JavaScript values. Handles all HJSON syntax variants.
- `hjson-serializer`: Stringification of JavaScript values back to HJSON format, preserving human-friendly formatting.
- `hjson-error`: Typed error system with `HJSONError` class, `HJSONErrorCode` constants and type union, row/col/index position tracking.
- `hjson-types`: Public TypeScript types for the HJSON API surface — `HJSON`, `HJSONError`, `HJSONErrorCode`, `HJSONParseOptions`, `HJSONStringifyOptions`.

### Modified Capabilities

*(None — new package, no existing capabilities modified.)*

## Impact

- New package under `packages/hjson/` (or similar)
- No breaking changes to existing packages
- No new runtime dependencies
- New exports from the monorepo's package registry
