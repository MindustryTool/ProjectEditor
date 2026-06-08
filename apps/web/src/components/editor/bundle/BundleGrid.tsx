import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFileString, getLocaleFromFilename, SUPPORTED_LOCALES } from "@project/core";
import { useFileName } from "#/hooks/use-path";
import { parseRows, getCounts } from "./parse-rows";
import { writeKey } from "./write-key";
import { useComparison } from "./use-comparison";
import { BundleToolbar } from "./BundleToolbar";
import { Row } from "./Row";
import type { StateFilter } from "./types";
import { Separator } from "#/components/ui/separator";

interface BundleGridProps {
	path: string;
	contentKeys: string[];
	toggle?: React.ReactNode;
}

export const BundleGrid = memo(function BundleGrid({ path, contentKeys, toggle }: BundleGridProps) {
	const { t } = useTranslation();
	const fileName = useFileName();
	const { data, isLoading, write } = useFileString(path);
	const [searchQuery, setSearchQuery] = useState("");
	const [stateFilter, setStateFilter] = useState<StateFilter>("all");

	const localeCode = useMemo(() => {
		const filename = path.split("/").pop() ?? "";
		return getLocaleFromFilename(filename);
	}, [path]);

	const localeName = useMemo(() => {
		if (!localeCode) return "Default";
		return SUPPORTED_LOCALES[localeCode] ?? localeCode;
	}, [localeCode]);

	const rows = useMemo(() => parseRows(data, contentKeys), [data, contentKeys]);

	const counts = useMemo(() => getCounts(rows), [rows]);

	const comparison = useComparison(path, rows);

	const onValueChange = useCallback(
		(key: string, value: string) => {
			write((prev) => writeKey(prev, key, value));
		},
		[write],
	);

	const filteredRows = useMemo(() => {
		let result = rows;
		const sq = searchQuery.toLowerCase();

		if (sq) result = result.filter((r) => r.key.toLowerCase().includes(sq) || r.value.toLowerCase().includes(sq));

		switch (stateFilter) {
			case "translated":
				return result.filter((r) => r.existsInBundle && !r.isInvalid);
			case "untranslated":
				return result.filter((r) => !r.existsInBundle);
			case "invalid":
				return result.filter((r) => r.isInvalid);
			default:
				return result;
		}
	}, [rows, searchQuery, stateFilter]);

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">{t("bundle-editor.loading")}</div>
		);
	}

	return (
		<div className="flex flex-col h-full w-full gap-2 mt-2">
			<div className="flex items-center justify-between shrink-0">
				<div className="flex items-center gap-2 text-sm">
					{fileName !== null && <span className="font-semibold text-foreground">{fileName}</span>}
					{localeCode !== null && <span className="tracking-wide text-muted-foreground/70 uppercase">{localeName}</span>}
				</div>
				{toggle}
			</div>
			<Separator />
			<BundleToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				stateFilter={stateFilter}
				onStateFilterChange={setStateFilter}
				counts={counts}
				availableComparisonFiles={comparison.availableComparisonFiles}
				comparisonPath={comparison.comparisonPath}
				onComparisonPathChange={comparison.setComparisonPath}
			/>

			<div className="flex-1 overflow-y-auto min-h-0 border border-border/50">
				<table className="w-full text-xs">
					<thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-xs border-b border-border/50">
						<tr>
							<th className="text-left py-2 px-3 font-medium text-muted-foreground/70 w-[35%]">Key</th>
							<th className="text-left py-2 px-3 font-medium text-muted-foreground/70">
								{localeCode === null ? "Value" : localeName}
							</th>
							{comparison.comparisonRows !== null && (
								<th className="text-left py-2 px-3 font-medium text-muted-foreground/70">
									{comparison.availableComparisonFiles.find((f) => f.path === comparison.comparisonPath)?.localeName ?? ""}
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{filteredRows.map((row) => (
							<Row
								key={row.id}
								row={row}
								comparisonRow={comparison.comparisonRows?.find((c) => c.key === row.key) ?? null}
								onValueChange={onValueChange}
								onComparisonValueChange={comparison.updateComparisonValue}
							/>
						))}
						{filteredRows.length === 0 && (
							<tr>
								<td
									colSpan={comparison.comparisonRows !== null ? 3 : 2}
									className="py-8 text-center text-muted-foreground/50 text-xs"
								>
									{t("bundle-editor.no-matching-entries")}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
});
