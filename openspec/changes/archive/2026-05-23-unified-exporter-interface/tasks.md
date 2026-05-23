## 1. Core — Exporter Interface

- [x] 1.1 Add `@project/zip` as a dependency in `packages/core/package.json`
- [x] 1.2 Create `packages/core/src/exporter.ts` with `Exporter` interface and `getExporter()` factory
- [x] 1.3 Export `Exporter` and `getExporter` from `packages/core/src/index.ts`

## 2. Core — JsonExporter Implementation

- [x] 2.1 Create `packages/core/src/json-exporter.ts` with `JsonExporter` class implementing `Exporter`
- [x] 2.2 Implement recursive file collection using `ProjectFileSystem.readdir()` / `readFile()`
- [x] 2.3 Build ZIP via `@project/zip`'s `createZip()` and return `Uint8Array`
- [x] 2.4 Export `JsonExporter` from `packages/core/src/index.ts`

## 3. Web App — ExportMenu Update

- [x] 3.1 Rewrite `ExportMenu.tsx` from dropdown to single button
- [x] 3.2 Wire button click to `getExporter(project.language).export(context)`
- [x] 3.3 Trigger browser download of the resulting ZIP file as `<project-name>.zip`
- [x] 3.4 Handle export errors gracefully (console.error + user-facing feedback via alert or toast)

## 4. Locale — Cleanup

- [x] 4.1 Remove `exportMenu.exportImage` key from `apps/web/public/locales/en/translation.json`
- [x] 4.2 Remove `exportMenu.exportImage` key from `apps/web/public/locales/vi/translation.json`
