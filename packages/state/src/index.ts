export type { AppSettings, ProjectRecord } from "./stores/project";
export type { ProjectContext, RecentFileEntry } from "./stores/session";
export { useAppStore } from "./stores/project";
export { useProjectSession, useCurrentProject, TreeSnapshot } from "./stores/session";

export type { FileContentEntry, FileContentStore } from "./stores/file-content";
export { useFileContentStore, isDirty, selectEntry, selectIsSaving } from "./stores/file-content";

export { WriteQueue, getWriteQueue, disposeWriteQueue } from "./services/write-queue";
export type { UseFileContentResult } from "./hooks/use-file-content";
export { useFileContent } from "./hooks/use-file-content";
export type { UseFileContentStringResult } from "./hooks/use-file-content-string";
export { useFileContentString } from "./hooks/use-file-content-string";

export { Severity, severityLabel, isErrorOrWarning } from "./validation/types";
export type {
	SeverityLevel,
	ValidationResult,
	ValidatorFn,
	ValidatorRegistration,
	ValidatorRegistry,
	ValidationSummary,
	ValidationStore,
	ValidationContext,
	ItemDto,
} from "./validation/types";
export { createValidatorRegistry } from "./validation/registry";
export { createValidationRunner } from "./validation/runner";
export type { ValidationRunner } from "./validation/runner";
export { useValidationStore } from "./validation/store";
export { createDefaultValidators } from "./validation/validators";
