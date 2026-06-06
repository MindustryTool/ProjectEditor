## Context

MonacoEditor orchestrates four hooks that each perform expensive synchronous work on every value change:
- **useEditorValidation**: Parses validation results, creates marker data and inline CSS rules for error lens
- **useColorTagDecorations**: Iterates every line, parses color tags inside strings, applies inline decorations
- **useColorTagPicker**: Detects color tags at cursor position on selection/scroll/layout events
- **useFileEventSubscription**: Lightweight subscription, negligible cost

All hooks use `useEffect` with `value`/`language` deps, meaning every keystroke triggers full recomputation. Additionally, the `onChange` callback fires synchronously on each character, potentially cascading upstream state updates.

React 19 is available (`^19.2.0`), providing `useTransition` for deferring non-urgent state updates. A custom `debounce` utility exists in `@project/utils`. The project also has `usehooks-ts` (`^3.1.1`) with `useDebounceCallback`.

## Goals / Non-Goals

**Goals:**
- Reduce synchronous work on every keystroke in MonacoEditor
- Debounce the `onChange` callback to batch upstream updates during fast typing
- Defer validation/decorations updates so the editor input stays responsive
- Keep all existing behavior identical — no functional changes
- Use only existing dependencies (`@project/utils` debounce, React 19 `useTransition`)

**Non-Goals:**
- Not rewriting the hooks or changing their architecture
- Not touching other editor components
- Not adding new dependencies

## Decisions

### 1. Debounce onChange with `@project/utils/debounce` over `usehooks-ts` `useDebounceCallback`
The existing `@project/utils/debounce` is already in the monorepo and used elsewhere. Using a shared utility keeps consistency. A 150ms delay balances responsiveness with batching.

### 2. `useTransition` for validation/decorations over manual debounce
React 19 `useTransition` lets the editor input priority stay high while deferring marker/decorations updates. This avoids the complexity of managing separate debounce timers for each hook while keeping the UI responsive during typing.

### 3. Debounce color tag picker events instead of using transition
Cursor/scroll events fire at high frequency and don't need state transition semantics. A short debounce (50ms) on the refresh call prevents unnecessary computation without visual lag.

### 4. No debounce for file event subscription
This hook only runs on `path` changes, not keystrokes — negligible cost.

## Risks / Trade-offs

- **[Debounce delay]** 150ms onChange delay means upstream consumers see slightly stale values during fast typing. Mitigation: This is standard editor behavior (VS Code debounces at ~200ms). The delay is imperceptible for most use cases.
- **[Transition overhead]** `useTransition` adds a small cost per render. Mitigation: Only applied to expensive operations, and React optimizes transitions internally.
- **[Color picker lag]** 50ms debounce on cursor events could feel slightly delayed. Mitigation: 50ms is below human perception threshold (typically ~100ms).
