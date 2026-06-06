import { spawn } from "threads";
import type { ModuleThread } from "threads";
import type { ProjectContents } from "@project/types";
import type { ValidationBatchFile, ValidationResult, ValidationWorkerApi } from "@project/core";
import { hasDefaultValidatorMatch, useFileStore, useProjectSession, useValidationStore } from "@project/core";

function decodeContent(data: ArrayBuffer | null | undefined): string {
	if (data == null) return "";
	if (data.byteLength === 0) return "";
	return new TextDecoder().decode(data);
}

function cacheKey(projectId: string, path: string): string {
	return `${projectId}::${path}`;
}

class ValidationService {
	private worker: ModuleThread<ValidationWorkerApi> | null = null;
	private workerPromise: Promise<ModuleThread<ValidationWorkerApi>> | null = null;
	private timers = new Map<string, ReturnType<typeof setTimeout>>();
	private latestRequestIdByPath = new Map<string, number>();
	private latestBatchRequestId = 0;

	private _contents: ProjectContents | null = null;
	private _lang: string | undefined;
	private _validationDelayMs = 1500;

	set contents(c: ProjectContents | null) {
		this._contents = c;
	}

	set lang(l: string | undefined) {
		this._lang = l;
	}

	set validationDelayMs(ms: number) {
		this._validationDelayMs = ms;
	}

	async ensureWorker(): Promise<ModuleThread<ValidationWorkerApi>> {
		if (this.worker) return this.worker;
		if (this.workerPromise) return this.workerPromise;

		const promise = spawn<ValidationWorkerApi>(
			new Worker(new URL("../workers/validation-worker.ts", import.meta.url), { type: "module" }),
		);
		this.workerPromise = promise;

		try {
			const w = await promise;
			this.worker = w;
			this.workerPromise = null;
			return w;
		} catch (error) {
			this.workerPromise = null;
			throw error;
		}
	}

	validateFile = async (path: string, getContent: () => Promise<string>): Promise<void> => {
		if (!hasDefaultValidatorMatch(path)) return;
		if (!this._contents) return;

		const requestId = (this.latestRequestIdByPath.get(path) ?? 0) + 1;
		this.latestRequestIdByPath.set(path, requestId);

		try {
			const content = await getContent();
			const worker = await this.ensureWorker();
			if (this._lang) {
				await worker.setLocale(this._lang);
			}

			const response = await worker.validateFile({
				requestId,
				path,
				content,
				contents: this._contents,
			});

			if (this.latestRequestIdByPath.get(path) !== response.requestId) return;

			useValidationStore.getState().setResults(path, response.results);
		} catch (err) {
			if (this.latestRequestIdByPath.get(path) !== requestId) return;
			console.error(err);
		}
	};

	validateFiles = async (files: ValidationBatchFile[]): Promise<Record<string, ValidationResult[]> | null> => {
		if (files.length === 0) return {};
		if (!this._contents) return null;

		const requestId = ++this.latestBatchRequestId;

		try {
			const worker = await this.ensureWorker();
			if (this._lang) {
				await worker.setLocale(this._lang);
			}

			const response = await worker.validateFiles({
				requestId,
				files,
				contents: this._contents,
			});

			if (this.latestBatchRequestId !== response.requestId) return null;

			for (const [path, results] of Object.entries(response.resultsByPath)) {
				useValidationStore.getState().setResults(path, results);
			}

			return response.resultsByPath;
		} catch (err) {
			if (this.latestBatchRequestId !== requestId) return null;
			console.error(err);
			return {};
		}
	};

	revalidateFiles(projectId: string) {
		const paths = Object.keys(useValidationStore.getState().results.resultsByPath);
		for (const path of paths) {
			this.scheduleValidation(projectId, path);
		}
	}

	scheduleValidation(projectId: string, path: string): void {
		if (!hasDefaultValidatorMatch(path)) {
			return;
		}

		if (!useProjectSession.getState().treeSnapshot.contains(path)) {
			return;
		}

		const key = cacheKey(projectId, path);
		const existing = this.timers.get(key);
		if (existing) {
			clearTimeout(existing);
		}

		this.timers.set(
			key,
			setTimeout(() => {
				this.timers.delete(key);
				const startTime = Date.now();
				this.validateFile(path, () => this.defaultContentLoader(projectId, path)).then(() => {
					const duration = Date.now() - startTime;
					if (duration > 10) {
						console.log(`Validation ${path} took ${duration}ms`);
					}
				});
			}, this._validationDelayMs),
		);
	}

	private async defaultContentLoader(projectId: string, path: string): Promise<string> {
		const key = cacheKey(projectId, path);
		const entry = useFileStore.getState().fileContents[key];
		if (entry?.data) {
			return decodeContent(entry.data);
		}

		const ctx = useProjectSession.getState().projectContext;
		if (!ctx) return "";
		const data = await ctx.fs.readTextFile(path);
		return data ?? "";
	}

	cancelPending(path: string, projectId: string): void {
		const key = cacheKey(projectId, path);
		const timer = this.timers.get(key);
		if (timer) {
			clearTimeout(timer);
			this.timers.delete(key);
		}
		this.latestRequestIdByPath.delete(path);
	}

	clearAllTimers(): void {
		for (const [, timer] of this.timers) {
			clearTimeout(timer);
		}
		this.timers.clear();
	}
}

export const validationService = new ValidationService();
