import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	useCurrentProject,
	useFileContentStore,
	useValidationStore,
	Severity,
	createDefaultValidators,
	createValidationRunner,
} from "@project/state";
import type { ValidationContext } from "@project/state";

const registry = createDefaultValidators();
const DEBOUNCE_MS = 500;

function extractPath(compositeKey: string): string {
	const idx = compositeKey.indexOf("::");
	return idx >= 0 ? compositeKey.slice(idx + 2) : compositeKey;
}

function decodeContent(data: ArrayBuffer | null | undefined): string {
	if (data == null) return "";
	if (data.byteLength === 0) return "";
	return new TextDecoder().decode(data);
}

export function ValidationProvider({ children }: { children: ReactNode }) {
	const projectContext = useCurrentProject();
	const queryClient = useQueryClient();
	const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

	useQuery({
		queryKey: ["items", projectContext.project.id],
		queryFn: async () => {
			const entries = await projectContext.fs.listFiles("content/item/");
			return entries.filter((e) => e.kind === "file" && e.name.endsWith(".json")).map((e) => ({ name: e.name.replace(/\.json$/, "") }));
		},
	});

	const runner = useMemo(() => {
		const context: ValidationContext = {
			getItems: () => {
				const items = queryClient.getQueryData<{ name: string }[]>(["items", projectContext.project.id]);
				return items ?? [];
			},
		};
		return createValidationRunner(registry, context);
	}, [queryClient, projectContext.project.id]);

	useEffect(() => {
		const timers = timersRef.current;

		function scheduleValidation(compositeKey: string, data: ArrayBuffer | null | undefined) {
			const path = extractPath(compositeKey);
			const existing = timers.get(path);
			if (existing) clearTimeout(existing);
			timers.set(
				path,
				setTimeout(() => {
					timers.delete(path);
					try {
						const content = decodeContent(data);
						const results = runner.validate(path, content);
						useValidationStore.getState().setResults(path, results);
					} catch (err) {
						useValidationStore.getState().setResults(path, [
							{
								path,
								severity: Severity.error,
								messageKey: err instanceof Error ? err.message : "Unknown error",
								startLine: 1,
								startColumn: 1,
							},
						]);
					}
				}, DEBOUNCE_MS),
			);
		}

		function clearValidationResults(compositeKey: string) {
			const path = extractPath(compositeKey);
			useValidationStore.getState().clearResults(path);
		}

		const unsub = useFileContentStore.subscribe((state, prevState) => {
			const curr = state.fileContents;
			const prev = prevState.fileContents;
			for (const key of Object.keys(curr)) {
				const currEntry = curr[key]!;
				const prevEntry = prev[key];
				if (currEntry.currentVersion !== (prevEntry?.currentVersion ?? 0) || prevEntry === undefined || prevEntry.loading === true) {
					scheduleValidation(key, currEntry.data);
				}
			}
			for (const key of Object.keys(prev)) {
				if (!curr[key]) {
					clearValidationResults(key);
				}
			}
		});

		return () => {
			unsub();
			for (const [, timer] of timers) {
				clearTimeout(timer);
			}
			timers.clear();
		};
	}, [runner]);

	return children;
}
