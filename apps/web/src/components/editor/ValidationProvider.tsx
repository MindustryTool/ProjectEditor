import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
	hasDefaultValidatorMatch,
	useFileStore,
	useValidationStore,
	useAppStore,
	useProjectSession,
	useCurrentProject,
	type ValidationBatchFile,
	type ValidationResult,
	type ValidationWorkerApi,
} from "@project/core";
import { useShallow } from "zustand/react/shallow";
import { usePath } from "#/hooks/use-path";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import type { ModuleThread } from "threads";

export interface ValidationContextValue {
	validateFile: (path: string, getContent: () => Promise<string>) => Promise<void>;
	validateFiles: (files: ValidationBatchFile[]) => Promise<Record<string, ValidationResult[]> | null>;
}

const ValidationFileContext = createContext<ValidationContextValue | null>(null);

export function useValidationContext(): ValidationContextValue {
	const ctx = useContext(ValidationFileContext);

	if (!ctx) throw new Error("useValidationContext() must be used within a ValidationProvider");

	return ctx;
}

function decodeContent(data: ArrayBuffer | null | undefined): string {
	if (data == null) return "";
	if (data.byteLength === 0) return "";
	return new TextDecoder().decode(data);
}

function toErrorResult(path: string, err: unknown): ValidationResult[] {
	return [
		{
			path,
			severity: "error",
			messageKey: err instanceof Error ? err.message : "Unknown error",
			startLine: 1,
			startColumn: 1,
			duration: 0,
		},
	];
}

function cacheKey(projectId: string, path: string): string {
	return `${projectId}::${path}`;
}

function createDefaultContentLoader(projectId: string, path: string) {
	return async () => {
		const key = cacheKey(projectId, path);
		const entry = useFileStore.getState().fileContents[key];
		if (entry?.data) {
			return decodeContent(entry.data);
		}

		const data = await useProjectSession.getState().projectContext!.fs.readTextFile(path);
		return data ?? "";
	};
}

export function ValidationProvider({ children }: { children: ReactNode }) {
	const [path] = usePath();
	const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
	const workerRef = useRef<ModuleThread<ValidationWorkerApi> | null>(null);
	const workerPromiseRef = useRef<Promise<ModuleThread<ValidationWorkerApi>> | null>(null);
	const latestRequestIdByPathRef = useRef<Map<string, number>>(new Map());
	const latestBatchRequestIdRef = useRef(0);
	const validationDelayMs = useAppStore(useShallow((s) => s.settings.validation.validationDelayMs));
	const projectContext = useCurrentProject();
	const projectId = projectContext.project.id;
	const { contents } = useProjectContext();

	const getWorker = useCallback(async () => {
		if (typeof document === "undefined") throw new Error("Worker not available on server");
		if (workerRef.current) return workerRef.current;
		if (workerPromiseRef.current) return workerPromiseRef.current;

		const { spawn } = await import("threads");
		const workerPromise = spawn<ValidationWorkerApi>(
			new Worker(new URL("../../workers/validation-worker.ts", import.meta.url), { type: "module" }),
		);
		workerPromiseRef.current = workerPromise;

		try {
			const worker = await workerPromise;
			workerRef.current = worker;
			return worker;
		} catch (error) {
			workerPromiseRef.current = null;
			throw error;
		}
	}, []);

	const terminateWorker = useCallback(async () => {
		if (typeof document === "undefined") return;
		const { Thread } = await import("threads");
		const pendingWorker = workerPromiseRef.current;
		const activeWorker = workerRef.current;

		workerRef.current = null;
		workerPromiseRef.current = null;

		if (activeWorker) {
			await Thread.terminate(activeWorker);
			return;
		}

		if (pendingWorker) {
			const resolvedWorker = await pendingWorker.catch(() => null);
			if (resolvedWorker) {
				await Thread.terminate(resolvedWorker);
			}
		}
	}, []);

	const validateFile = useCallback(
		async (path: string, getContent: () => Promise<string>) => {
			if (!hasDefaultValidatorMatch(path)) {
				return;
			}

			const requestId = (latestRequestIdByPathRef.current.get(path) ?? 0) + 1;
			latestRequestIdByPathRef.current.set(path, requestId);

			try {
				const content = await getContent();
				const worker = await getWorker();
				const response = await worker.validateFile({
					requestId,
					path,
					content,
					contents,
				});

				if (latestRequestIdByPathRef.current.get(path) !== response.requestId) {
					return;
				}

				useValidationStore.getState().setResults(path, response.results);
                console.log("Validated file", path);
			} catch (err) {
				if (latestRequestIdByPathRef.current.get(path) !== requestId) {
					return;
				}

				useValidationStore.getState().setResults(path, toErrorResult(path, err));
				console.error(err);
			}
		},
		[contents, getWorker],
	);

	const validateFiles = useCallback(
		async (files: ValidationBatchFile[]) => {
			if (files.length === 0) return {};

			const requestId = latestBatchRequestIdRef.current + 1;
			latestBatchRequestIdRef.current = requestId;

			try {
				const worker = await getWorker();
				const response = await worker.validateFiles({
					requestId,
					files,
					contents,
				});

				if (latestBatchRequestIdRef.current !== response.requestId) return null;

				for (const [path, results] of Object.entries(response.resultsByPath)) {
					useValidationStore.getState().setResults(path, results);
				}

				return response.resultsByPath;
			} catch (err) {
				if (latestBatchRequestIdRef.current !== requestId) return null;

				const fallbackResults: Record<string, ValidationResult[]> = Object.fromEntries(
					files.map((file) => [file.path, toErrorResult(file.path, err)]),
				);
				for (const [path, results] of Object.entries(fallbackResults)) {
					useValidationStore.getState().setResults(path, results);
				}

				return fallbackResults;
			}
		},
		[contents, getWorker],
	);

	const scheduleValidation = useCallback(
		(path: string) => {
			if (!hasDefaultValidatorMatch(path)) {
				return;
			}

			const key = cacheKey(projectId, path);
			const timers = timersRef.current;
			const existing = timers.get(key);

			if (existing) {
				clearTimeout(existing);
			}

			timers.set(
				key,
				setTimeout(() => {
					timers.delete(key);
					validateFile(path, createDefaultContentLoader(projectId, path));
				}, validationDelayMs),
			);
		},
		[projectId, validateFile, validationDelayMs],
	);

	const ctxValue = useMemo<ValidationContextValue>(
		() => ({
			validateFile,
			validateFiles,
		}),
		[validateFile, validateFiles],
	);

	useEffect(() => {
		void getWorker();
		return () => {
			void terminateWorker();
		};
	}, [getWorker, terminateWorker]);

	useEffect(() => {
		if (path && projectId) {
			scheduleValidation(path);
		}
	}, [path, projectId, scheduleValidation]);

	useEffect(() => {
		for (const path of Object.keys(useValidationStore.getState().results.resultsByPath)) {
			scheduleValidation(path);
		}
	}, [projectId, scheduleValidation]);

	useEffect(() => {
		const events = projectContext.events;
		const timers = timersRef.current;

		const unsubWrite = events.on("file:write", (event) => {
			scheduleValidation(event.path);
		});

		const unsubCreate = events.on("file:create", (event) => {
			scheduleValidation(event.path);
		});

		const unsubDelete = events.on("file:delete", (event) => {
			const key = cacheKey(projectId, event.path);
			const timer = timers.get(key);
			if (timer) {
				clearTimeout(timer);
				timers.delete(key);
			}
			latestRequestIdByPathRef.current.delete(event.path);
			useValidationStore.getState().clearResults(event.path);
		});

		return () => {
			unsubWrite();
			unsubCreate();
			unsubDelete();
			for (const [, timer] of timers) {
				clearTimeout(timer);
			}
			timers.clear();
		};
	}, [projectContext, projectId, scheduleValidation]);

	return <ValidationFileContext.Provider value={ctxValue}>{children}</ValidationFileContext.Provider>;
}
