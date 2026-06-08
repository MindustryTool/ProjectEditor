import { parseBundle } from "@project/core";
import type { BundleRow, RowState } from "./types";

export function parseRows(
	data: string | null,
	contentKeys: string[],
): { rows: BundleRow[]; all: number; translated: number; untranslated: number; extra: number; missing: number; invalid: number } {
	const rows: BundleRow[] = [];

	if (data === null) return { rows, all: 0, translated: 0, untranslated: 0, extra: 0, missing: 0, invalid: 0 };

	const bundleFile = parseBundle(data);
	if (!bundleFile) return { rows, all: 0, translated: 0, untranslated: 0, extra: 0, missing: 0, invalid: 0 };

	const contentKeySet = new Set(contentKeys);
	let id = 0;
	const seenKeys = new Set<string>();
	let all = 0;
	let translated = 0;
	let untranslated = 0;
	let extra = 0;
	let missing = 0;
	let invalid = 0;

	for (const entry of bundleFile.entries) {
		all++;
		if (entry.type === "entry" && entry.key) {
			seenKeys.add(entry.key);
			const isEmpty = (entry.value ?? "") === "";
			const inContent = contentKeySet.has(entry.key);
			let state: RowState;
			if (!inContent) {
				state = "extra";
				extra++;
			} else if (isEmpty) {
				state = "untranslated";
				untranslated++;
			} else {
				state = "translated";
				translated++;
			}
			rows.push({ id: id++, key: entry.key, value: entry.value ?? "", state });
		} else if (entry.type === "invalid") {
			invalid++;
			rows.push({ id: id++, key: "(invalid)", value: entry.raw, state: "invalid" });
		}
	}

	for (const ck of contentKeys) {
		if (!seenKeys.has(ck)) {
			missing++;
			all++;
			rows.push({ id: id++, key: ck, value: "", state: "missing" });
		}
	}

	return { rows, all, translated, untranslated, extra, missing, invalid };
}
