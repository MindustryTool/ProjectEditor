## Why

The HJSON package can currently parse valid input, stringify JavaScript values, and surgically patch known fields, but it cannot reformat existing source text while preserving comments, whitespace intent, and malformed fragments. The editor needs a first-party formatter that can normalize valid HJSON and still operate on invalid or partial documents without dropping user text.

## What Changes

- Add a public HJSON formatter API that formats existing source text instead of serializing from plain JavaScript values
- Support formatting valid HJSON documents with stable indentation, spacing, commas, bracket layout, and string rendering rules
- Support formatting invalid or partial HJSON by preserving unparseable tokens and surrounding trivia so the output remains text-equivalent in meaning and loses no source data
- Introduce tolerant structured parsing data needed by the formatter to represent malformed fields, arrays, delimiters, and trailing source segments
- Add focused unit tests for formatter round-trips, malformed-input preservation, and idempotent formatting behavior

## Capabilities

### New Capabilities
- `hjson-formatter`: Format HJSON source text from original text while preserving comments, layout-sensitive content, and malformed fragments without data loss

### Modified Capabilities
- `hjson-structured-parsing`: Extend structured parsing to expose tolerant nodes/segments required to format incomplete or invalid HJSON documents without discarding source text

## Impact

- Affects `packages/hjson/src/` public API, formatter implementation, parser/tokenizer structured output, and `packages/hjson/tests/`
- Adds new exports from `packages/hjson/src/index.ts` for formatter entry points and formatter option types
- Keeps zero runtime dependencies and avoids editor-specific behavior in the formatter core
