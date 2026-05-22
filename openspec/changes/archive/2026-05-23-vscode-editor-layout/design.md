## Context

The project currently has a basic page structure but no dedicated editor page. The existing apps/web/ contains the frontend application. A VS Code-inspired layout is needed for project editing — a top toolbar, resizable left/right panels, and a status bar.

## Goals / Non-Goals

**Goals:**
- Build a reusable EditorPage component that composes Toolbar, StatusBar, and split panels
- Implement resizable left/right panels with drag handles
- Create a top Toolbar with Files and Export dropdown menus
- Create a bottom StatusBar showing project name, file count, and status text
- Keep panel content generic (content injected via React props/slots)

**Non-Goals:**
- File tree / editor content implementation (panels are content-agnostic)
- Menu item actions (just menu structure and dropdown rendering)
- Keyboard shortcuts
- Multiple editor tabs or tab bar

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | React (existing stack) | Matches current codebase; no new dependency needed |
| Split panel | Custom CSS Flexbox + drag handle | Lightweight; no heavy library needed for two panels |
| State management | React useState + lifting state up | Simple layout state (panel sizes, visibility) — no global store needed |
| Menu rendering | Custom dropdown components | Avoids menu library dependency; only 2 menus needed |
| Resize mechanism | mousedown/mousemove on drag handle | Direct DOM events for smooth resize; no re-render overhead |

## Risks / Trade-offs

- [Drag handle usability] → Will use a visible grip area (8px wide) with cursor change
- [Panel collapse at small widths] → Set minimum panel widths and add collapse threshold
- [Menu click-away behavior] → Click-outside handler to close menus
