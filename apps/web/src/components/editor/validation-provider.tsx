import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
	useFileStore,
	useValidationStore,
	Severity,
	createDefaultValidators,
	createValidationRunner,
	useAppStore,
	useProjectSession,
} from "@project/state";
import type { ValidationContext } from "@project/state";
import { useShallow } from "zustand/react/shallow";
import { useItems } from "#/hooks/use-items";

const registry = createDefaultValidators();
const runner = createValidationRunner(registry);

export interface ValidationContextValue {
	validateFile: (path: string, content: () => Promise<string>) => Promise<void>;
}

const ValidationFileContext = createContext<ValidationContextValue | null>(null);

export function useValidationContext(): ValidationContextValue {
	const ctx = useContext(ValidationFileContext);
	if (!ctx) throw new Error("useValidationContext must be used within a ValidationProvider");
	return ctx;
}

function decodeContent(data: ArrayBuffer | null | undefined): string {
	if (data == null) return "";
	if (data.byteLength === 0) return "";
	return new TextDecoder().decode(data);
}

function toErrorResult(path: string, err: unknown) {
	return [
		{
			path,
			severity: Severity.error,
			messageKey: err instanceof Error ? err.message : "Unknown error",
			startLine: 1,
			startColumn: 1,
		},
	];
}

function cacheKey(projectId: string, path: string): string {
	return `${projectId}::${path}`;
}

function scheduleValidation(
	projectId: string,
	path: string,
	timers: Map<string, NodeJS.Timeout>,
	delay: number,
	context: ValidationContext,
) {
	const key = cacheKey(projectId, path);
	const existing = timers.get(path);
	if (existing) clearTimeout(existing);

	timers.set(
		path,
		setTimeout(async () => {
			timers.delete(path);
			try {
				const getContent = () => {
					const entry = useFileStore.getState().fileContents[key];
					return Promise.resolve(decodeContent(entry?.data));
				};
				const results = await runner.validate(path, getContent, context);
				useValidationStore.getState().setResults(path, results);
			} catch (err) {
				useValidationStore.getState().setResults(path, toErrorResult(path, err));
			}
		}, delay),
	);
}

function extractPath(compositeKey: string): string {
	const idx = compositeKey.indexOf("::");
	return idx >= 0 ? compositeKey.slice(idx + 2) : compositeKey;
}

export function ValidationProvider({ children }: { children: ReactNode }) {
	const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
	const validationDelayMs = useAppStore(useShallow((s) => s.settings.validationDelayMs));
	const items = useItems({ base: true, project: true });
	const projectContext = useProjectSession((s) => s.projectContext);

	const context = useMemo(() => ({ getItems: () => items }), [items]);

	const ctxValue = useMemo<ValidationContextValue>(
		() => ({
			validateFile: async (path: string, getContent: () => Promise<string>) => {
				try {
					const results = await runner.validate(path, getContent, context);
					useValidationStore.getState().setResults(path, results);
				} catch (err) {
					useValidationStore.getState().setResults(path, toErrorResult(path, err));
				}
			},
		}),
		[context],
	);

	useEffect(() => {
		if (!projectContext) {
			return;
		}
		const events = projectContext.events;
		const projectId = projectContext.project.id;
		const timers = timersRef.current;

		const unsubWrite = events.on("file:write", (event) => {
			scheduleValidation(projectId, event.path, timers, validationDelayMs, context);
		});

		const unsubCreate = events.on("file:create", (event) => {
			scheduleValidation(projectId, event.path, timers, validationDelayMs, context);
		});

		const unsubDelete = events.on("file:delete", (event) => {
			useValidationStore.getState().clearResults(event.path);
		});

		const unsubHydration = useValidationStore.persist.onFinishHydration((state) => {
			for (const path of Object.keys(state.results.resultsByPath)) {
				useFileStore.getState().readFile(projectId, path, projectContext.fs);
			}
		});

		const unsubStore = useFileStore.subscribe((state, prevState) => {
			const prefix = `${projectId}::`;
			for (const key of Object.keys(state.fileContents)) {
				if (!key.startsWith(prefix)) continue;
				const curr = state.fileContents[key];
				const prev = prevState.fileContents[key];
				if (curr && !curr.loading && prev?.loading && curr.data !== prev.data) {
					const path = extractPath(key);
					scheduleValidation(projectId, path, timers, validationDelayMs, context);
				}
			}
		});

		return () => {
			unsubWrite();
			unsubCreate();
			unsubDelete();
			unsubHydration();
			unsubStore();
			for (const [, timer] of timers) {
				clearTimeout(timer);
			}
			timers.clear();
		};
	}, [projectContext, validationDelayMs, context]);

	return <ValidationFileContext.Provider value={ctxValue}>{children}</ValidationFileContext.Provider>;
}
