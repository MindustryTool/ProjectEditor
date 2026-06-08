import { useCallback, useMemo, useState } from "react";
import { useFileString, useProjectSession } from "@project/core";
import { parseBundle, writeBundle, isBundleFilename, SUPPORTED_LOCALES, getLocaleFromFilename } from "@project/core";
import type { BundleEntry } from "@project/core";

export interface BundleRow {
	id: number;
	key: string;
	value: string;
	existsInBundle: boolean;
	isInvalid: boolean;
}

export interface BundleFileData {
	path: string;
	localeCode: string | null;
	localeName: string;
	rows: BundleRow[];
	comparisonRows: BundleRow[] | null;
	isLoading: boolean;
	updateValue: (key: string, value: string) => void;
	updateComparisonValue: (key: string, value: string) => void;
	save: () => void;
	saveComparison: () => void;
	availableComparisonFiles: { path: string; localeName: string }[];
	setComparisonPath: (path: string | null) => void;
	comparisonPath: string | null;
}

export function useBundleFile(path: string, contentKeys: string[]): BundleFileData {
	const { data, isLoading, write } = useFileString(path);
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);

	const allEntries = treeSnapshot.getEntries();

	const bundleFiles = useMemo(
		() =>
			allEntries
				.filter((e) => e.kind === "file" && e.path.startsWith("bundles/") && isBundleFilename(e.name) && e.path !== path)
				.map((e) => ({
					path: e.path,
					localeName: SUPPORTED_LOCALES[getLocaleFromFilename(e.name) ?? ""] ?? e.name,
				})),
		[allEntries, path],
	);

	const localeCode = useMemo(() => {
		const filename = path.split("/").pop() ?? "";
		return getLocaleFromFilename(filename);
	}, [path]);

	const localeName = useMemo(() => {
		if (!localeCode) return "Default";
		return SUPPORTED_LOCALES[localeCode] ?? localeCode;
	}, [localeCode]);

	const bundleFile = useMemo(() => {
		if (data === null) return null;
		try { return parseBundle(data); } catch { return null; }
	}, [data]);

	const rows: BundleRow[] = useMemo(() => {
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
	}, [bundleFile, contentKeys]);

	const [editMap, setEditMap] = useState<Record<string, string>>({});

	const displayRows: BundleRow[] = useMemo(
		() => rows.map((r) => (r.isInvalid ? r : editMap[r.key] !== undefined ? { ...r, value: editMap[r.key]! } : r)),
		[rows, editMap],
	);

	const updateValue = useCallback((key: string, value: string) => {
		setEditMap((prev) => ({ ...prev, [key]: value }));
	}, []);

	const save = useCallback(() => {
		write((prev: string | null) => {
			const current = prev ?? "";
			const parsed = parseBundle(current);
			const seenKeys = new Set<string>();

			const newEntries: BundleEntry[] = [];
			for (const entry of parsed.entries) {
				if (entry.type === "entry" && entry.key) {
					seenKeys.add(entry.key);
					const edited = editMap[entry.key];
					newEntries.push(edited !== undefined ? { ...entry, value: edited } : entry);
				} else {
					newEntries.push(entry);
				}
			}

			for (const [key, value] of Object.entries(editMap)) {
				if (!seenKeys.has(key)) {
					newEntries.push({ type: "entry", key, value, raw: "" });
				}
			}

			return writeBundle({ entries: newEntries });
		});
		setEditMap({});
	}, [write, editMap]);

	const [comparisonPath, setComparisonPath] = useState<string | null>(null);
	const { data: comparisonData, write: comparisonWrite } = useFileString(comparisonPath ?? "");

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

	const [comparisonEditMap, setComparisonEditMap] = useState<Record<string, string>>({});

	const displayComparisonRows: BundleRow[] | null = useMemo(() => {
		if (!comparisonRows) return null;
		return comparisonRows.map((r) => {
			const edited = comparisonEditMap[r.key];
			return edited !== undefined ? { ...r, value: edited } : r;
		});
	}, [comparisonRows, comparisonEditMap]);

	const updateComparisonValue = useCallback((key: string, value: string) => {
		setComparisonEditMap((prev) => ({ ...prev, [key]: value }));
	}, []);

	const saveComparison = useCallback(() => {
		if (!comparisonPath) return;
		comparisonWrite((prev: string | null) => {
			const current = prev ?? "";
			const parsed = parseBundle(current);
			const seenKeys = new Set<string>();

			const newEntries: BundleEntry[] = [];
			for (const entry of parsed.entries) {
				if (entry.type === "entry" && entry.key) {
					seenKeys.add(entry.key);
					const edited = comparisonEditMap[entry.key];
					newEntries.push(edited !== undefined ? { ...entry, value: edited } : entry);
				} else {
					newEntries.push(entry);
				}
			}

			for (const [key, value] of Object.entries(comparisonEditMap)) {
				if (!seenKeys.has(key)) {
					newEntries.push({ type: "entry", key, value, raw: "" });
				}
			}

			return writeBundle({ entries: newEntries });
		});
		setComparisonEditMap({});
	}, [comparisonPath, comparisonWrite, comparisonEditMap]);

	return {
		path,
		localeCode,
		localeName,
		rows: displayRows,
		comparisonRows: displayComparisonRows,
		isLoading,
		updateValue,
		updateComparisonValue,
		save,
		saveComparison,
		availableComparisonFiles: bundleFiles,
		setComparisonPath,
		comparisonPath,
	};
}
