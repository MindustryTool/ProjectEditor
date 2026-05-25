## 1. Shared Helper

- [x] 1.1 Add `resolveJsonContentImage` function to `~/lib/utils` that converts `content/**/<name>.json` to `sprites/<name>.png` (returns `null` for non-matching paths)

## 2. ContentList Grid Layout

- [x] 2.1 Replace flat list with a responsive CSS grid layout (`grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 p-2`)
- [x] 2.2 Create a card component per entry showing a folder/file icon and the entry name
- [x] 2.3 For `.json` files, call `resolveJsonContentImage` and render an `<img>` with the resolved sprite path, hiding on `onError`
- [x] 2.4 Add `useNavigate` + `useQueryState("path")` — clicking a folder navigates to its path, clicking a file navigates to the file path
- [x] 2.5 Integrate `CreateNewContentDialog` as a "+" card at the start of the grid

## 3. CreateNewContentDialog UI Update

- [x] 3.1 Restyle the dialog trigger to render as a grid card (bordered box with "+" icon and "New" label)
- [x] 3.2 Keep the existing dialog contents (name input, .zip suffix) unchanged
