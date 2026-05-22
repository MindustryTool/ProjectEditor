# Project Editor

> Offline-first Mindustry mod editor — edit metadata, manage assets, build logic graphs, and pack your mod, all from your browser.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)
![TanStack Start](https://img.shields.io/badge/TanStack_Start-FF4154?logo=tanstack&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=fff)

## Features

<details open>
<summary><strong>Mod Editing</strong></summary>

- Edit mod metadata & content definitions
- Manage assets & localization strings
- JSON / HJSON editing with syntax highlighting
</details>

<details open>
<summary><strong>File System</strong></summary>

- Open / save local folders via the File System Access API
- Import / export mods as ZIP archives
- Autosave with persistent local workspace (IndexedDB + OPFS)
</details>

<details open>
<summary><strong>Visual Editors</strong></summary>

- Logic graph editor for processor code
- Tech tree editor for content relationships
- Content graph tools for dependency visualization
</details>

<details open>
<summary><strong>Offline First</strong></summary>

- Installable PWA with full local caching
- Zero server dependency — everything runs client-side
- Works fully disconnected after first load
</details>

---

## Getting Started

### Prerequisites

- **Node.js** >= 22
- **pnpm** >= 10

```bash
npm install -g pnpm
```

### Installation

```bash
git clone https://github.com/your-org/project-editor.git
cd project-editor
pnpm install
```

### Run

```bash
# Start all apps in development
pnpm dev

# Start only the web app (TanStack Start)
pnpm --filter @app/web dev

# Start only the desktop-style app
pnpm --filter @app/app dev
```

### Build

```bash
pnpm build
pnpm typecheck
```

---

## Project Structure

```
apps/
├── web/        TanStack Start (SSR browser app, PWA target)
└── app/        Vite + React (standalone / native wrapper target)

packages/
├── config/     Shared constants & defaults
├── core/       Business logic & project models
├── fs/         File System Access API adapter
├── state/      Zustand store for global state
├── storage/    IndexedDB / OPFS persistence layer
├── ui/         Shared React UI components (Button, FileTree, Editor)
├── utils/      Debounce, throttle, file-size formatting
├── validation/ Zod schemas for project & settings
└── zip/        fflate wrapper for ZIP compress/extract

tooling/
├── eslint/     Shared ESLint flat config
├── typescript/ Shared tsconfig presets
└── prettier/   Shared Prettier config
```

---

## Website

**Production:** `https://project-editor.mindustry-tool.com` (placeholder)  
**Staging:** `https://staging.project-editor.mindustry-tool.com` (placeholder)

---

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## Support & Contact

- **Discord:** [Mindustry Tool Discord](https://mindustry-tool.com/links/mindustry-tool)
- **Issues:** [GitHub Issues](https://github.com/your-org/project-editor/issues)
