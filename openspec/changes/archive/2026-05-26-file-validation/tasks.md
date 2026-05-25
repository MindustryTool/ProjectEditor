## 1. Validation Core Package

- [x] 1.1 Create `packages/file-validation` package with `package.json` (name: `@project/file-validation`, deps: valibot)
- [x] 1.2 Define types: `ValidationSeverity`, `ValidationResult`, `Validator`, `ValidationStore`
- [x] 1.3 Implement `ValidatorRegistry` — register validators by glob pattern, match paths
- [x] 1.4 Implement `ValidationRunner` — run matching validators for a path+content, aggregate results
- [x] 1.5 Implement `useValidationStore` zustand store — map path → results, derived total counts
- [x] 1.6 Export public API from index.ts

## 2. Validators

- [x] 2.1 Implement `modHjsonValidator` — parse mod.hjson, validate against ModHjsonSchema, return results per field
- [x] 2.2 Implement `contentJsonValidator` — parse JSON, check required fields per content type, check duplicates
- [x] 2.3 Implement `jsonSyntaxValidator` — try/catch JSON.parse, return error with line/col on failure
- [x] 2.4 Register all validators in a default registry factory

## 3. i18n Keys

- [x] 3.1 Add validation message keys to `en/translation.json` (validation.* namespace)
- [x] 3.2 Add validation message keys to `vi/translation.json`
- [x] 3.3 Use message key + interpolation pattern in validators (not raw strings)

## 4. MonacoEditor Integration

- [x] 4.1 Create `useValidationMarkers` hook — subscribes to validation store, calls `monaco.editor.setModelMarkers()`
- [x] 4.2 Integrate hook into MonacoEditor component — run on file content change with debounce
- [x] 4.3 Map severity to marker severity (error → monaco.MarkerSeverity.Error, warning → Warning)

## 5. FileExplorer Integration

- [x] 5.1 Subscribe to validation store per file path in TreeNodeItem
- [x] 5.2 Show error/warning badge next to file names with count
- [x] 5.3 Style badges with appropriate colors (red for errors, yellow for warnings)

## 6. StatusBar Integration

- [x] 6.1 Subscribe to validation store total counts in EditorShell (passed to StatusBar)
- [x] 6.2 Display error and warning counts on right side of StatusBar
- [x] 6.3 Add i18n keys for statusBar.validationErrors and statusBar.validationWarnings

## 7. ExportMenu Integration

- [x] 7.1 Run all-project validation before triggering export
- [x] 7.2 Show validation error dialog if errors found (list of errors, "Cancel" / "Export anyway")
- [x] 7.3 Allow export to proceed if only warnings or clean
