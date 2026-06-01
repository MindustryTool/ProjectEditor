import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
	useFileStore,
	useValidationStore,
	Severity,
	createDefaultValidators,
	createValidationRunner,
	useAppStore,
	useProjectSession,
	useCurrentProject,
} from "@project/state";
import type { ValidationContext, ValidationRunner, ValidatorRegistry } from "@project/state";
import { useShallow } from "zustand/react/shallow";
import { useItems } from "#/hooks/use-items";
import { useBlocks } from "#/hooks/use-blocks";
import { useLiquids } from "#/hooks/use-liquids";
import { useSectors } from "#/hooks/use-sectors";
import { useStatuses } from "#/hooks/use-statuses";
import { useUnits } from "#/hooks/use-units";
import { usePath } from "#/hooks/use-path";

const registry = createDefaultValidators();
const runner = createValidationRunner(registry);

export interface ValidationContextValue {
	registry: ValidatorRegistry;
	runner: ValidationRunner;
	context: ValidationContext;
	validateFile: (path: string) => Promise<void>;
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
				const getContent = async () => {
					const entry = useFileStore.getState().fileContents[key];
					if (entry && entry.data) {
						return decodeContent(entry.data);
					}
					const data = await useProjectSession.getState().projectContext!.fs.readTextFile(path);
					if (data === null) {
						return "";
					}
					return data;
				};
				const results = await runner.validate(path, getContent, context);
				useValidationStore.getState().setResults(path, results);
			} catch (err) {
				useValidationStore.getState().setResults(path, toErrorResult(path, err));
			}
		}, delay),
	);
}

export function ValidationProvider({ children }: { children: ReactNode }) {
	const [path] = usePath();
	const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
	const validationDelayMs = useAppStore(useShallow((s) => s.settings.validationDelayMs));
	const items = useItems({ base: true, project: true });
	const blocks = useBlocks();
	const liquids = useLiquids();
	const sectors = useSectors();
	const statuses = useStatuses();
	const units = useUnits();
	const projectContext = useCurrentProject();
	const projectId = projectContext.project.id;

	const validationContext = useMemo(
		() => ({
			getItems: () => items,
			getBlocks: () => blocks,
			getLiquids: () => liquids,
			getSectors: () => sectors,
			getStatuses: () => statuses,
			getUnits: () => units,
		}),
		[items, blocks, liquids, sectors, statuses, units],
	);

	const ctxValue = useMemo<ValidationContextValue>(
		() => ({
			registry,
			runner,
			context: validationContext,
			validateFile: async (path: string) => {
				try {
					const getContent = async () => {
						const key = cacheKey(projectId, path);
						const entry = useFileStore.getState().fileContents[key];
						
                        if (entry && entry.data) {
							return decodeContent(entry.data);
						}

						const data = await useProjectSession.getState().projectContext!.fs.readTextFile(path);
						
                        if (data === null) {
							return "";
						}

						return data;
					};
					const results = await runner.validate(path, getContent, validationContext);
					useValidationStore.getState().setResults(path, results);
				} catch (err) {
					useValidationStore.getState().setResults(path, toErrorResult(path, err));
				}
			},
		}),
		[validationContext],
	);

	useEffect(() => {
		if (path && projectId) {
			scheduleValidation(projectId, path, timersRef.current, validationDelayMs, validationContext);
		}
	}, [path, projectId, validationContext, validationDelayMs]);

	useEffect(() => {
		if (!projectId) {
			return;
		}

		for (const path of Object.keys(useValidationStore.getState().results.resultsByPath)) {
			scheduleValidation(projectId, path, timersRef.current, validationDelayMs, validationContext);
		}
	}, [projectId, validationContext, validationDelayMs]);

	useEffect(() => {
		if (!projectContext) {
			return;
		}

		const events = projectContext.events;
		const projectId = projectContext.project.id;
		const timers = timersRef.current;

		const unsubWrite = events.on("file:write", (event) => {
			scheduleValidation(projectId, event.path, timers, validationDelayMs, validationContext);
		});

		const unsubCreate = events.on("file:create", (event) => {
			scheduleValidation(projectId, event.path, timers, validationDelayMs, validationContext);
		});

		const unsubDelete = events.on("file:delete", (event) => {
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
	}, [projectContext, validationDelayMs, validationContext]);

	return <ValidationFileContext.Provider value={ctxValue}>{children}</ValidationFileContext.Provider>;
}
