import type { BundleEntry, BundleFile } from "./types";

export function writeBundle(file: BundleFile): string {
	const entryGroups: { leading: BundleEntry[]; entry: BundleEntry; trailing: BundleEntry[] }[] = [];
	let currentComment: BundleEntry[] = [];

	for (const entry of file.entries) {
		if (entry.type === "comment" || entry.type === "blank") {
			currentComment.push(entry);
		} else if (entry.type === "entry") {
			entryGroups.push({ leading: currentComment, entry, trailing: [] });
			currentComment = [];
		} else if (entry.type === "invalid") {
			entryGroups.push({ leading: currentComment, entry, trailing: [] });
			currentComment = [];
		}
	}

	const leftoverComments = currentComment;

	entryGroups.sort((a, b) => {
		if (a.entry.type === "invalid" && b.entry.type === "invalid") return 0;
		if (a.entry.type === "invalid") return 1;
		if (b.entry.type === "invalid") return -1;
		const keyA = a.entry.key ?? "";
		const keyB = b.entry.key ?? "";
		return keyA.localeCompare(keyB);
	});

	const lines: string[] = [];

	for (const group of entryGroups) {
		for (const c of group.leading) {
			lines.push(c.raw);
		}
		if (group.entry.type === "entry" && group.entry.key !== undefined) {
			lines.push(`${group.entry.key} = ${group.entry.value ?? ""}`);
		} else if (group.entry.type === "invalid") {
			lines.push(group.entry.raw);
		}
		for (const c of group.trailing) {
			lines.push(c.raw);
		}
	}

	for (const c of leftoverComments) {
		lines.push(c.raw);
	}

	const result = lines.join("\n");
	if (!result.endsWith("\n")) {
		return result + "\n";
	}
	return result;
}
