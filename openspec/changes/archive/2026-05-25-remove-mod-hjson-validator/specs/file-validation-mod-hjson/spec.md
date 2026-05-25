## REMOVED Requirements

### Requirement: Validator validates mod.hjson structure
**Reason**: Redundant — `ModHjsonPanel` form component validates mod.hjson fields inline against `ModHjsonSchema`. File-level validator duplicates this logic with no additional benefit.
**Migration**: mod.hjson validation is now handled exclusively by the ModHjsonPanel form component. Any caller relying on the file-level validator for mod.hjson must use ModHjsonPanel's built-in field validation instead. If raw-text editing of mod.hjson is needed in the future, a new validator can be registered via `createValidatorRegistry()`.
