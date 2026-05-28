import { useEffect, useMemo, useRef, type ReactNode } from "react";
import {
	useFileContentStore,
	useValidationStore,
	Severity,
	createDefaultValidators,
	createValidationRunner,
	useProjectSession,
    useAppStore,
} from "@project/state";
import type { ValidationContext } from "@project/state";
import { useShallow } from "zustand/react/shallow";
import { useBaseItems } from "#/hooks/use-base-items";

const registry = createDefaultValidators();
const runner = createValidationRunner(registry);

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
	const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
    const validationDelayMs = useAppStore(useShallow((s) => s.settings.validationDelayMs));

	const modItems = useProjectSession(
		useShallow((s) =>
			s.treeSnapshot
				.getEntries()
				.filter((e) => e.kind === "file" && e.path.includes("content/items") && e.name.endsWith(".json"))
				.map((e) => e.name.replace(".json", "")),
		),
	);

	const { data: baseItems } = useBaseItems();

	const context = useMemo(() => {
		const context: ValidationContext = {
			getItems: () => {
				const result = [];
				if (baseItems) {
					result.push(...baseItems);
				}
				result.push(...modItems.map((i) => ({ name: i })));
				return result;
			},
		};
		return context;
	}, [baseItems]);

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
						const results = runner.validate(path, content, context);
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
				}, validationDelayMs),
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
	}, [context]);

	return children;
}
