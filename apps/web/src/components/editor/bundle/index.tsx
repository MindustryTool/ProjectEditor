import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { useFileName } from "#/hooks/use-path";
import { useBundleFile, type BundleRow } from "./use-bundle-file";

type StateFilter = "all" | "translated" | "untranslated" | "invalid";

interface BundleGridProps {
	path: string;
	contentKeys: string[];
}

const STATE_FILTERS: StateFilter[] = ["all", "translated", "untranslated", "invalid"];

export const BundleGrid = memo(function BundleGrid({ path, contentKeys }: BundleGridProps) {
	const { t } = useTranslation();
	const fileName = useFileName();
	const [searchQuery, setSearchQuery] = useState("");
	const [stateFilter, setStateFilter] = useState<StateFilter>("all");

	const bundle = useBundleFile(path, contentKeys);

	const counts = useMemo(
		() => ({
			all: bundle.rows.length,
			translated: bundle.rows.filter((r) => r.existsInBundle && !r.isInvalid).length,
			untranslated: bundle.rows.filter((r) => !r.existsInBundle).length,
			invalid: bundle.rows.filter((r) => r.isInvalid).length,
		}),
		[bundle.rows],
	);

	const filteredRows = useMemo(() => {
		let result = bundle.rows;
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
	}, [bundle.rows, searchQuery, stateFilter]);

	if (bundle.isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">{t("bundle-editor.loading")}</div>
		);
	}

	return (
		<div className="flex flex-col h-full w-full gap-3">
			<div className="flex items-center justify-between shrink-0">
				<div className="flex items-center gap-2">
					{fileName !== null && <span className="text-sm font-semibold text-foreground">{fileName}</span>}
					{bundle.localeCode !== null && (
						<span className="text-xs tracking-wide text-muted-foreground/70 uppercase">{bundle.localeName}</span>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2 flex-wrap shrink-0">
				<Input
					placeholder={t("bundle-editor.search")}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="h-8 w-48 text-xs"
				/>
				<div className="flex items-center h-8 gap-px bg-muted rounded-md px-1 py-0.5">
					{STATE_FILTERS.map((f) => (
						<button
							key={f}
							type="button"
							onClick={() => setStateFilter(f)}
							className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-all ${
								stateFilter === f ? "bg-background text-foreground shadow-xs" : "text-muted-foreground/60 hover:text-foreground"
							}`}
						>
							{t(`bundle-editor.${f}`)} ({counts[f]})
						</button>
					))}
				</div>
				{bundle.availableComparisonFiles.length > 0 && (
					<div className="ml-auto">
						<Select value={bundle.comparisonPath ?? ""} onValueChange={(v) => bundle.setComparisonPath(v || null)}>
							<SelectTrigger size="sm">
								<SelectValue className="text-xs" placeholder={t("bundle-editor.compare-with")} />
							</SelectTrigger>
							<SelectContent>
								{bundle.availableComparisonFiles.map((f) => (
									<SelectItem key={f.path} value={f.path}>
										{f.localeName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</div>

			<div className="flex-1 overflow-y-auto min-h-0 border border-border/50">
				<table className="w-full text-xs">
					<thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-xs border-b border-border/50">
						<tr>
							<th className="text-left py-2 px-3 font-medium text-muted-foreground/70 w-[35%]">Key</th>
							<th className="text-left py-2 px-3 font-medium text-muted-foreground/70">
								{bundle.localeCode === null ? "Value" : bundle.localeName}
							</th>
							{bundle.comparisonRows !== null && (
								<th className="text-left py-2 px-3 font-medium text-muted-foreground/70">
									{bundle.availableComparisonFiles.find((f) => f.path === bundle.comparisonPath)?.localeName ?? ""}
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{filteredRows.map((row) => (
							<Row
								key={row.id}
								row={row}
								comparisonRow={bundle.comparisonRows?.find((c) => c.key === row.key) ?? null}
								onValueChange={bundle.updateValue}
								onComparisonValueChange={bundle.updateComparisonValue}
							/>
						))}
						{filteredRows.length === 0 && (
							<tr>
								<td colSpan={bundle.comparisonRows !== null ? 3 : 2} className="py-8 text-center text-muted-foreground/50 text-xs">
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

const Row = memo(function Row({
	row,
	comparisonRow,
	onValueChange,
	onComparisonValueChange,
}: {
	row: BundleRow;
	comparisonRow: BundleRow | null;
	onValueChange: (key: string, value: string) => void;
	onComparisonValueChange: (key: string, value: string) => void;
}) {
	const isMissing = !row.existsInBundle;

	if (row.isInvalid) {
		return (
			<tr className="border-b border-border/20">
				<td className="py-1.5 px-3 text-red-400/70 font-mono text-xs" colSpan={comparisonRow !== null ? 3 : 2}>
					{row.value}
				</td>
			</tr>
		);
	}

	return (
		<tr className={`border-b border-border/20 transition-colors ${isMissing ? "bg-yellow-500/6" : "hover:bg-muted/30"}`}>
			<td className="py-1.5 px-3 font-mono text-xs text-foreground/80">{row.key}</td>
			<td className="py-1.5 px-3">
				<Input
					value={row.value}
					onChange={(e) => onValueChange(row.key, e.target.value)}
					className="h-7 text-xs w-full font-mono"
				/>
			</td>
			{comparisonRow !== null && (
				<td className="py-1.5 px-3">
					<Input
						value={comparisonRow.value}
						onChange={(e) => onComparisonValueChange(comparisonRow.key, e.target.value)}
						disabled={!comparisonRow.existsInBundle}
						className={`h-7 text-xs w-full font-mono ${!comparisonRow.existsInBundle ? "opacity-40" : ""}`}
					/>
				</td>
			)}
		</tr>
	);
});
