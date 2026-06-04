import type { ProjectContents } from "@project/types";
import type { ValidationResult } from "./types";

export interface ValidationFileRequest {
	requestId: number;
	path: string;
	content: string;
	contents: ProjectContents;
}

export interface ValidationBatchFile {
	path: string;
	content: string;
}

export interface ValidationFilesRequest {
	requestId: number;
	files: ValidationBatchFile[];
	contents: ProjectContents;
}

export interface ValidationFileResponse {
	requestId: number;
	path: string;
	results: ValidationResult[];
}

export interface ValidationFilesResponse {
	requestId: number;
	resultsByPath: Record<string, ValidationResult[]>;
}

export interface ValidationWorkerApi {
	validateFile(request: ValidationFileRequest): Promise<ValidationFileResponse>;
	validateFiles(request: ValidationFilesRequest): Promise<ValidationFilesResponse>;
	setLocale(locale: string): Promise<void>;
}
