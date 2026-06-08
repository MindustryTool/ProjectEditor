import { parseBundle } from "@project/core";
import type { BundleRow, StateFilter } from "./types";

export function parseRows(data: string | null, contentKeys: string[]): BundleRow[] {
	if (data === null) return [];

	const bundleFile = parseBundle(data);
	if (!bundleFile) return [];

	const result: BundleRow[] = [];
	let id = 0;
	const seenKeys = new Set<string>();

	for (const entry of bundleFile.entries) {
		if (entry.type === "entry" && entry.key) {
			seenKeys.add(entry.key);
			result.push({ id: id++, key: entry.key, value: entry.value ?? "", existsInBundle: true, isInvalid: false });
		} else if (entry.type === "invalid") {
			result.push({ id: id++, key: "(invalid)", value: entry.raw, existsInBundle: true, isInvalid: true });
		}
	}

	for (const ck of contentKeys) {
		if (!seenKeys.has(ck)) {
			result.push({ id: id++, key: ck, value: "", existsInBundle: false, isInvalid: false });
		}
	}

	return result;
}

export function getCounts(rows: BundleRow[]): Record<StateFilter, number> {
	return {
		all: rows.length,
		translated: rows.filter((r) => r.existsInBundle && !r.isInvalid && r.value !== "").length,
		untranslated: rows.filter((r) => !r.existsInBundle || r.value === "").length,
		invalid: rows.filter((r) => r.isInvalid).length,
	};
}
