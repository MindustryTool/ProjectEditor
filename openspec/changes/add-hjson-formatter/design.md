## Context

`@project/hjson` currently has two distinct strengths:

- strict parsing into JavaScript values or structured nodes
- source-preserving surgical edits based on stored source positions

That combination is enough for targeted field replacement, but not for whole-document formatting. The current serializer rebuilds output from plain JavaScript values, so it necessarily drops comments, delimiter style, malformed fragments, and any source text that cannot be represented as a valid JS value. The requested formatter has a different contract: it starts from source text, normalizes the parts it understands, and preserves everything else without data loss.

The formatter also needs to handle invalid or partial HJSON, because editor buffers may be incomplete while a user is typing. That means strict parse failure cannot be the end of the pipeline. We need a tolerant representation that keeps original spans, trivia, and recoverable syntax issues available to the formatter.

## Goals / Non-Goals

**Goals:**
- Add a public `HJSON.format(text, options?)` API exported from the package entry point
- Format valid HJSON into a stable, idempotent layout with consistent indentation and delimiter spacing
- Preserve comments, blank lines, multiline string payloads, and unparseable source segments without data loss
- Reuse structured-position concepts already present in the package instead of introducing a second unrelated source model
- Add focused unit coverage for valid formatting, invalid-input preservation, and formatter idempotence

**Non-Goals:**
- Building a semantic linter or auto-fixer for invalid syntax
- Reconstructing malformed content into fully valid HJSON at all costs
- Adding editor-only behaviors such as cursor preservation or incremental formatting ranges in this change
- Replacing `HJSON.stringify()`; formatter and serializer remain separate APIs with different guarantees

## Decisions

1. **Introduce a source-based formatter API**
   - Decision: add `HJSON.format(text, options?)` plus matching exported option types from `index.ts`.
   - Why: formatting existing HJSON source has a different contract than serializing JS values. A dedicated API avoids overloading `stringify()` semantics.
   - Alternative considered: extend `HJSON.stringify()` to accept source text or structured nodes. Rejected because it would mix serialization and formatting responsibilities and make invalid-input guarantees unclear.

2. **Use a tolerant document model for formatting**
   - Decision: add an internal tolerant parse mode that produces a document tree/segment list containing normal nodes, comments/trivia, delimiters, and opaque invalid ranges.
   - Why: no-data-loss formatting requires exact source spans for content that cannot be normalized safely.
   - Alternative considered: catch parser errors and format only the prefix before the first error. Rejected because it loses trailing content and cannot preserve malformed interior sections.

3. **Format known structures, pass through unknown spans**
   - Decision: the formatter rewrites recognized objects, arrays, keys, separators, and primitive value layout, but re-emits invalid or ambiguous spans verbatim.
   - Why: this gives deterministic improvement on recoverable structure while honoring the no-data-loss requirement.
   - Alternative considered: never rewrite a document once any error exists. Rejected because it makes the formatter useless on partially invalid files even when large regions are still recoverable.

4. **Preserve string payloads and comments exactly**
   - Decision: quoted strings, multiline strings, and comment bodies keep their original textual payload unless a formatting rule only changes surrounding indentation/alignment.
   - Why: comments and multiline literals often encode intentional spacing that should not be normalized semantically.
   - Alternative considered: canonicalize all strings through serializer logic. Rejected because it can rewrite escape sequences, multiline indentation, and user-authored presentation.

5. **Keep formatter options intentionally small in v1**
   - Decision: support indentation width/string and newline style normalization only if it can be applied without content loss; otherwise use stable project defaults.
   - Why: a small option surface reduces ambiguity while the tolerant model is new.
   - Alternative considered: offer a full Prettier-like matrix immediately. Rejected because it expands the design without evidence of need.

6. **Test against text preservation and formatter stability**
   - Decision: tests focus on idempotence, preserved malformed spans, preserved comments, and valid-document reparsing after formatting.
   - Why: these are the behaviors most likely to regress when formatter and tolerant parsing evolve together.
   - Alternative considered: snapshot-heavy coverage only. Rejected because snapshots alone make it harder to prove no-data-loss guarantees precisely.

## Risks / Trade-offs

- **Tolerant parsing complexity** -> Mitigation: keep tolerant mode formatter-focused, with opaque fallback segments instead of trying to fully understand every invalid construct
- **Formatter output may mix normalized and verbatim regions** -> Mitigation: document this explicitly and make tests assert that malformed spans remain byte-preserved
- **Existing structured parsing internals may become harder to maintain** -> Mitigation: share positional primitives and node wrappers, but keep tolerant-only segment types internal unless a later change needs them publicly
- **Multiline strings and comments can be accidentally altered by indentation logic** -> Mitigation: treat their bodies as protected spans and test representative edge cases
- **Public API naming could overlap with future range-formatting work** -> Mitigation: reserve advanced/range formatting for a separate follow-up change instead of over-designing now

## Migration Plan

- Add formatter exports in a backward-compatible way; no existing API removal is required
- Keep strict parse behavior unchanged for `parse`, `parseAsync`, and current structured parsing entry points unless tolerant parsing is explicitly requested internally
- Land formatter tests with the new implementation so regressions in preservation behavior block future changes

## Open Questions

- Whether tolerant document nodes should stay fully internal or expose a minimal debug surface later
- Whether newline normalization belongs in v1 or should remain fixed to the dominant newline style found in the input
