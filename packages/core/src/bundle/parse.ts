import type { BundleEntry, BundleFile } from "./types";

export function parseBundle(content: string): BundleFile {
	const lines = content.split(/\r?\n/);
	const entries: BundleEntry[] = [];

	for (let i = 0; i < lines.length; i++) {
		const raw = lines[i]!;

		if (raw.trim() === "") {
			entries.push({ type: "blank", raw });
			continue;
		}

		if (raw.trim().startsWith("#")) {
			entries.push({ type: "comment", raw });
			continue;
		}

		const eqIndex = findSeparator(raw);
		if (eqIndex !== -1) {
			const key = raw.slice(0, eqIndex).trim();
			const value = raw.slice(eqIndex + 1).trim();
			entries.push({ type: "entry", key, value, raw });
		} else {
			console.warn(`[bundle] invalid line skipped: "${raw}"`);
			entries.push({ type: "invalid", raw });
		}
	}

	return { entries };
}

function findSeparator(line: string): number {
	let escaped = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (ch === "\\") {
			escaped = true;
			continue;
		}
		if (ch === "=" || ch === ":") {
			return i;
		}
	}
	return -1;
}
