## 1. Add replaceLine utility

- [x] 1.1 Add a `replaceLine(lines: string[], key: string, value: string): string[]` pure utility function to `ModHjsonPanel.tsx` that finds the line starting with `{key}:` and replaces it, or appends if not found

## 2. Store raw lines in ModHjsonPanel

- [x] 2.1 Add `useRef<string[]>([])` in the `ModHjsonPanel` component to hold the raw file lines
- [x] 2.2 In the `useEffect` that parses `data`, populate the lines ref from the initial file content (split by `\n`)
- [x] 2.3 In the empty-data branch, initialize the lines ref from `toHjson(defaultModHjson)` split into lines

## 3. Replace full-file update with line-targeted update

- [x] 3.1 Change the form's `onChange` handler to call `replaceLine(linesRef.current, fieldKey, value)` and pass the joined result to `update()`, instead of calling `update(toHjson(form.state.values))`
- [x] 3.2 Update the `removeDep` callback to replace only the `dependencies:` line instead of full rebuild
- [x] 3.3 Keep `toHjson()` only as a fallback for initial default content (empty file case)

## 4. Remove unused toHjson calls

- [x] 4.1 Verify `toHjson()` is no longer called on every form change
- [x] 4.2 Clean up any dead code if `toHjson` becomes unused (it's still needed for the empty-file default initialization)
