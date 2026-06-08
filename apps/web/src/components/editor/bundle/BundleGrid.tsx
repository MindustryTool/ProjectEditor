import { memo, useCallback, useMemo, useRef, useState } from "react";
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
import { useVirtualizer } from "@tanstack/react-virtual";

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

	const scrollRef = useRef<HTMLDivElement>(null);

	const showComparison = comparison.comparisonRows !== null;
	const gridCols = showComparison ? "grid-cols-[35%_1fr_1fr]" : "grid-cols-[35%_1fr]";

	const virtualizer = useVirtualizer({
		count: filteredRows.length,
		getScrollElement: () => scrollRef.current,
		estimateSize: () => 40,
		overscan: 5,
		getItemKey: (index) => filteredRows[index]!.id,
	});

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

			<div className="flex-1 overflow-y-auto min-h-0 border border-border/50" ref={scrollRef}>
				<div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-xs border-b border-border/50">
					<div className={`grid ${gridCols} text-xs`}>
						<div className="text-left py-2 px-3 font-medium text-muted-foreground/70">Key</div>
						<div className="text-left py-2 px-3 font-medium text-muted-foreground/70">
							{localeCode === null ? "Value" : localeName}
						</div>
						{showComparison && (
							<div className="text-left py-2 px-3 font-medium text-muted-foreground/70">
								{comparison.availableComparisonFiles.find((f) => f.path === comparison.comparisonPath)?.localeName ?? ""}
							</div>
						)}
					</div>
				</div>

				{filteredRows.length === 0 ? (
					<div className={`grid ${gridCols} text-xs py-8`}>
						<div className="col-span-full text-center text-muted-foreground/50">{t("bundle-editor.no-matching-entries")}</div>
					</div>
				) : (
					<div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const row = filteredRows[virtualItem.index]!;
							return (
								<div
									key={row.id}
									data-index={virtualItem.index}
									ref={virtualizer.measureElement}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: `${virtualItem.size}px`,
										transform: `translateY(${virtualItem.start}px)`,
									}}
								>
									<Row
										row={row}
										comparisonRow={comparison.comparisonRows?.find((c) => c.key === row.key) ?? null}
										onValueChange={onValueChange}
										onComparisonValueChange={comparison.updateComparisonValue}
									/>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
});
