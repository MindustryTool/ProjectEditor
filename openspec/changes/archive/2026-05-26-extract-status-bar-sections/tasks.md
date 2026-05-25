## 1. Create StatusBarLeft Component

- [x] 1.1 Create `statusbar/StatusBarLeft.tsx` with component, interface, and store subscription for project name
- [x] 1.2 Write component JSX: project name, pipe separator, file count using `useTranslation`

## 2. Create StatusBarCenter Component

- [x] 2.1 Create `statusbar/StatusBarCenter.tsx` with component and interface
- [x] 2.2 Write component JSX: ready status text using `useTranslation`

## 3. Create StatusBarRight Component

- [x] 3.1 Create `statusbar/StatusBarRight.tsx` with component, interface, and store subscription for validation summary
- [x] 3.2 Write component JSX: conditional error/warning spans and lucide-react icons

## 4. Update EditorShell

- [x] 4.1 Import new components from `./statusbar/StatusBarLeft`, `StatusBarCenter`, `StatusBarRight`
- [x] 4.2 Replace inline StatusBar JSX props with component usage
- [x] 4.3 Remove unused imports (`FileJson`, `Image` from lucide-react, `useProjectStore`, `useValidationStore` if no longer needed elsewhere)
