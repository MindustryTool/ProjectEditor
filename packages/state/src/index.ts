export type { AppSettings, ProjectRecord } from "./stores/project";
export type { ProjectContext, RecentFileEntry } from "./stores/session";
export { useAppStore } from "./stores/project";
export { useProjectSession, useCurrentProject, TreeSnapshot } from "./stores/session";

export type { FileEntry, FileStore } from "./stores/file";
export { useFileStore, isDirty, isError, getEntry, selectEntry, selectIsSaving } from "./stores/file";

export { WriteQueue, getWriteQueue, disposeWriteQueue } from "./services/write-queue";
export type { UseFileResult } from "./hooks/use-file-content";
export { useFile } from "./hooks/use-file-content";
export type { UseFileStringResult } from "./hooks/use-file-content-string";
export { useFileString } from "./hooks/use-file-content-string";

export { Severity, severityLabel, isErrorOrWarning } from "./validation/types";
export { findUnknownProperties } from "./validation/utils.js";
export type {
	SeverityLevel,
	ValidationResult,
	ValidatorFn,
	ValidatorRegistration,
	ValidatorRegistry,
	ValidationSummary,
	ValidationStore,
} from "./validation/types";
export { createValidatorRegistry } from "./validation/registry";
export { createValidationRunner } from "./validation/runner";
export type { ValidationRunner } from "./validation/runner";
export { useValidationStore } from "./validation/store";
export { createDefaultValidators } from "./validation/validators";
export { ValidationResults } from "./validation/types";
