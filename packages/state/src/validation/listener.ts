import { useFileContentStore } from "../stores/file-content";
import { createDefaultValidators } from "./validators";
import { createValidationRunner } from "./runner";
import { useValidationStore } from "./store";
import { Severity } from "./types";

const registry = createDefaultValidators();
const runner = createValidationRunner(registry);

const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
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

function scheduleValidation(compositeKey: string, data: ArrayBuffer | null | undefined) {
	const path = extractPath(compositeKey);
	const existing = debounceTimers.get(path);
	if (existing) clearTimeout(existing);

	debounceTimers.set(
		path,
		setTimeout(() => {
			debounceTimers.delete(path);

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

let registered = false;

export function registerValidationListener() {
	if (registered) return;
	registered = true;

	useFileContentStore.subscribe((state, prevState) => {
		const curr = state.fileContents;
		const prev = prevState.fileContents;

		for (const key of Object.keys(curr)) {
			const currEntry = curr[key]!;
			const prevEntry = prev[key];
			if (currEntry.currentVersion !== (prevEntry?.currentVersion ?? 0) || currEntry.currentVersion === 0) {
				scheduleValidation(key, currEntry.data);
			}
		}

		for (const key of Object.keys(prev)) {
			if (!curr[key]) {
				clearValidationResults(key);
			}
		}
	});
}

registerValidationListener();
