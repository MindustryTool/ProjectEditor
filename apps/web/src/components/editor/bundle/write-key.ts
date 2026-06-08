import { parseBundle, writeBundle } from "@project/core";
import type { BundleEntry } from "@project/core";

export function writeKey(
	prev: string | null,
	key: string,
	value: string,
): string {
	const current = prev ?? "";
	const parsed = parseBundle(current);
	const seenKeys = new Set<string>();

	const newEntries: BundleEntry[] = [];
	for (const entry of parsed.entries) {
		if (entry.type === "entry" && entry.key) {
			seenKeys.add(entry.key);
			newEntries.push(entry.key === key ? { ...entry, value } : entry);
		} else {
			newEntries.push(entry);
		}
	}

	if (!seenKeys.has(key)) {
		newEntries.push({ type: "entry", key, value, raw: "" });
	}

	return writeBundle({ entries: newEntries });
}
