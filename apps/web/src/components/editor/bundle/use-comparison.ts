import { useCallback, useMemo, useState } from "react";
import { useFileString, useProjectSession, isBundleFilename, SUPPORTED_LOCALES, getLocaleFromFilename } from "@project/core";
import { parseBundle } from "@project/core";
import { writeKey } from "./write-key";
import type { BundleRow } from "./types";

export function useComparison(path: string, rows: BundleRow[]) {
	const [comparisonPath, setComparisonPath] = useState<string | null>(null);
	const { data: comparisonData, write: comparisonWrite } = useFileString(comparisonPath ?? "");

	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);

	const availableComparisonFiles = useMemo(() => {
		const allEntries = treeSnapshot.getEntries();
		return allEntries
			.filter((e) => e.kind === "file" && e.path.startsWith("bundles/") && isBundleFilename(e.name) && e.path !== path)
			.map((e) => ({
				path: e.path,
				localeName: SUPPORTED_LOCALES[getLocaleFromFilename(e.name) ?? ""] ?? e.name,
			}));
	}, [treeSnapshot, path]);

	const comparisonBundleFile = useMemo(() => {
		if (!comparisonData) return null;
		try { return parseBundle(comparisonData); } catch { return null; }
	}, [comparisonData]);

	const comparisonRows: BundleRow[] | null = useMemo(() => {
		if (!comparisonBundleFile) return null;
		const keyMap = new Map<string, string>();
		let id = 0;
		for (const entry of comparisonBundleFile.entries) {
			if (entry.type === "entry" && entry.key) {
				keyMap.set(entry.key, entry.value ?? "");
			}
		}
		return rows.map((r) => ({
			id: id++,
			key: r.key,
			value: keyMap.get(r.key) ?? "",
			existsInBundle: keyMap.has(r.key),
			isInvalid: false,
		}));
	}, [comparisonBundleFile, rows]);

	const updateComparisonValue = useCallback(
		(key: string, value: string) => {
			comparisonWrite((prev) => writeKey(prev, key, value));
		},
		[comparisonWrite],
	);

	return {
		comparisonRows,
		comparisonPath,
		setComparisonPath,
		availableComparisonFiles,
		updateComparisonValue,
	};
}
