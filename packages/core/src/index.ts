export type * from "./project/store.js";
export type { Exporter, ExportContext, ExportFs } from "./exporter.js";
export type { ImportResult } from "./importer.js";
export type { ProjectContext, RecentFileEntry } from "./project/session.js";
export type { FileEntry, FileStore } from "./file/store.js";
export type { UseFileResult } from "./file/use-file-content.js";
export type { UseFileStringResult } from "./file/use-file-content-string.js";
export type {
	SeverityLevel,
	ValidationResult,
	ValidatorFn,
	ValidatorRegistration,
	ValidatorRegistry,
	ValidationSummary,
	ValidationStore,
} from "./validation/types";

export { JsonExporter } from "./json-exporter.js";
export { importProject } from "./importer.js";

export * from "./types";

export { useAppStore } from "./project/store.js";
export { useProjectSession, useCurrentProject, selectIsExpanded } from "./project/session.js";

export { useFileStore, isDirty, isError, getEntry, selectEntry, exists, selectIsSaving } from "./file/store.js";

export { WriteQueue, getWriteQueue, disposeWriteQueue } from "./write-queue.js";
export { useFile } from "./file/use-file-content.js";
export { useFileString } from "./file/use-file-content-string.js";

export { severityLabel, isErrorOrWarning } from "./validation/types";
export { findUnknownProperties } from "./validation/utils";
export { createValidatorRegistry } from "./validation/registry";
export { createValidationRunner } from "./validation/runner";
export type { ValidationRunner } from "./validation/runner";
export { useValidationStore } from "./validation/store";
export { createDefaultValidators, hasDefaultValidatorMatch } from "./validation/validators";
export { ValidationResults } from "./validation/types";
export type {
	ValidationBatchFile,
	ValidationFilesResponse,
	ValidationFilesRequest,
	ValidationFileRequest,
	ValidationFileResponse,
	ValidationWorkerApi,
} from "./validation/worker";

export { parseBundle, writeBundle, SUPPORTED_LOCALES, FLAG_MAP, getLocaleFromFilename, isBundleFilename } from "./bundle/index.js";
export type { BundleEntry, BundleEntryType, BundleFile } from "./bundle/types.js";

export { ProjectFileSystem, createProjectFileSystem, deleteProjectFiles } from "./project-file-system.js";
export type { ProjectFileSystemOptions } from "./project-file-system.js";
