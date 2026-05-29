import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFileStore, useValidationStore, Severity, createDefaultValidators, createValidationRunner, useAppStore } from "@project/state";
import type { ValidationContext } from "@project/state";
import { useShallow } from "zustand/react/shallow";
import { useItems } from "#/hooks/use-items";

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

function runValidation(
	compositeKey: string,
	data: ArrayBuffer | null | undefined,
	timers: Map<string, NodeJS.Timeout>,
	delay: number,
	context: ValidationContext,
) {
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
				useValidationStore.getState().setResults(path, toErrorResult(path, err));
			}
		}, delay),
	);
}

function clearResults(compositeKey: string) {
	useValidationStore.getState().clearResults(extractPath(compositeKey));
}

function shouldValidate(
	currEntry: { currentVersion: number; loading?: boolean },
	prevEntry: { currentVersion?: number; loading?: boolean } | undefined,
) {
	return (
		currEntry.currentVersion !== (prevEntry?.currentVersion ?? 0) ||
		prevEntry === undefined ||
		prevEntry.loading === true
	);
}

function handleFileChanges(
	curr: Record<string, { currentVersion: number; data: ArrayBuffer | null | undefined; loading?: boolean }>,
	prev: Record<string, { currentVersion: number; data: ArrayBuffer | null | undefined; loading?: boolean }>,
	timers: Map<string, NodeJS.Timeout>,
	delay: number,
	context: ValidationContext,
) {
	for (const key of Object.keys(curr)) {
		const currEntry = curr[key]!;
		const prevEntry = prev[key];
		if (shouldValidate(currEntry, prevEntry)) {
			runValidation(key, currEntry.data, timers, delay, context);
		}
	}
	for (const key of Object.keys(prev)) {
		if (!curr[key]) {
			clearResults(key);
		}
	}
}

export function ValidationProvider({ children }: { children: ReactNode }) {
	const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
	const validationDelayMs = useAppStore(useShallow((s) => s.settings.validationDelayMs));
	const items = useItems({ base: true, project: true });

	const context = useMemo(() => ({ getItems: () => items }), [items]);

	useEffect(() => {
		const timers = timersRef.current;
		const unsub = useFileStore.subscribe((state, prevState) => {
			handleFileChanges(state.fileContents, prevState.fileContents, timers, validationDelayMs, context);
		});

		return () => {
			unsub();
			for (const [, timer] of timers) {
				clearTimeout(timer);
			}
			timers.clear();
		};
	}, [validationDelayMs, context]);

	return children;
}
