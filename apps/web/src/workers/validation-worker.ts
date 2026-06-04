import { loadValibotI18n } from "#/i18n/valibot-i18n";
import {
	createDefaultValidators,
	createValidationRunner,
	type ValidationFilesRequest,
	type ValidationFilesResponse,
	type ValidationFileRequest,
	type ValidationFileResponse,
	type ValidationWorkerApi,
} from "@project/core";
import { expose } from "threads/worker";

const registry = createDefaultValidators();
const runner = createValidationRunner(registry);

const validationWorker: ValidationWorkerApi = {
	async validateFile(request: ValidationFileRequest): Promise<ValidationFileResponse> {
		const results = await runner.validate(request.path, async () => request.content, request.contents);

		return {
			requestId: request.requestId,
			path: request.path,
			results,
		};
	},

	async validateFiles(request: ValidationFilesRequest): Promise<ValidationFilesResponse> {
		const resultsByPath: Record<string, Awaited<ValidationFileResponse["results"]>> = {};

		for (const file of request.files) {
			resultsByPath[file.path] = await runner.validate(file.path, async () => file.content, request.contents);
		}

		return {
			requestId: request.requestId,
			resultsByPath,
		};
	},

	async setLocale(locale: string) {
		await loadValibotI18n(locale);
	},
};

export type ValidationWorkerModule = typeof validationWorker;

expose(validationWorker);
