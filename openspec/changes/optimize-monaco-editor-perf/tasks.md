## 1. Debounce onChange callback

- [x] 1.1 Import `debounce` from `@project/utils` in `MonacoEditor.tsx`
- [x] 1.2 Create a debounced version of `onChange` using `useMemo` with a 150ms delay, referencing the stable `onChange` prop
- [x] 1.3 Replace `onChange={(newValue) => onChange(newValue ?? "")}` with `onChange={debouncedOnChange}` on the `<Editor>` component

## 2. Defer validation updates with useTransition

- [x] 2.1 In `useEditorValidation.ts`, import `useTransition` from `react`
- [x] 2.2 Wrap the `updateMarkers()` call in the `useEffect` with `startTransition()`
- [ ] 2.3 Ensure no visible regression — squigglies and error lens still appear after typing pauses

## 3. Defer color decoration updates with useTransition

- [x] 3.1 In `useColorTagDecorations.ts`, import `useTransition` from `react`
- [x] 3.2 Wrap the `updateColorDecorations()` call in the `useEffect` with `startTransition()`
- [ ] 3.3 Ensure color tags still render correctly after typing pauses

## 4. Debounce color tag picker cursor events

- [x] 4.1 In `useColorTagPicker.ts`, import `debounce` from `@project/utils`
- [x] 4.2 Debounce `refreshActiveColorTag` with a 50ms delay
- [x] 4.3 Replace direct `refreshActiveColorTag` calls in disposables with the debounced version
- [x] 4.4 Ensure the debounced function is properly cleaned up in the disposable dispose callbacks

## 5. Verify and cleanup

- [ ] 5.1 Test typing in a large file (5000+ lines) — verify no jank
- [ ] 5.2 Test color tag picker — verify popover tracks cursor correctly
- [ ] 5.3 Test with external file changes — verify `useFileEventSubscription` still works
- [x] 5.4 Run `npm run lint` and `npm run typecheck` in `apps/web`
