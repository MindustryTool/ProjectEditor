export type { Exporter, ExportContext, ExportFs } from "./exporter.js";
export { JsonExporter } from "./json-exporter.js";
export { importProject } from "./importer.js";
export type { ImportResult } from "./importer.js";

export * from "./types";
export type * from "./stores/project";

export type { ProjectContext, RecentFileEntry } from "./stores/session";
export { useAppStore } from "./stores/project";
export { useProjectSession, useCurrentProject, TreeSnapshot } from "./stores/session";
export { useExpandedStore, selectIsExpanded } from "./stores/expanded";

export type { FileEntry, FileStore } from "./stores/file";
export { useFileStore, isDirty, isError, getEntry, selectEntry, exists, selectIsSaving } from "./stores/file";

export { WriteQueue, getWriteQueue, disposeWriteQueue } from "./write-queue.js";
export type { UseFileResult } from "./hooks/use-file-content";
export { useFile } from "./hooks/use-file-content";
export type { UseFileStringResult } from "./hooks/use-file-content-string";
export { useFileString } from "./hooks/use-file-content-string";

export { severityLabel, isErrorOrWarning } from "./validation/types";
export { findUnknownProperties } from "./validation/utils";
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
