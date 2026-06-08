import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import type { StateFilter } from "./types";

interface BundleToolbarProps {
	searchQuery: string;
	onSearchChange: (q: string) => void;
	stateFilter: StateFilter;
	onStateFilterChange: (f: StateFilter) => void;
	counts: Record<StateFilter, number>;
	availableComparisonFiles: { path: string; localeName: string }[];
	comparisonPath: string | null;
	onComparisonPathChange: (path: string | null) => void;
}

const STATE_FILTERS: StateFilter[] = ["all", "translated", "untranslated", "invalid"];

export const BundleToolbar = memo(function BundleToolbar({
	searchQuery,
	onSearchChange,
	stateFilter,
	onStateFilterChange,
	counts,
	availableComparisonFiles,
	comparisonPath,
	onComparisonPathChange,
}: BundleToolbarProps) {
	const { t } = useTranslation();

	return (
		<div className="flex items-center gap-2 flex-wrap shrink-0">
			<Input
				placeholder={t("bundle-editor.search")}
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				className="h-8 w-48 text-xs"
			/>
			<div className="flex items-center h-8 gap-px bg-muted rounded-md px-1 py-0.5">
				{STATE_FILTERS.map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => onStateFilterChange(f)}
						className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-all ${
							stateFilter === f ? "bg-background text-foreground shadow-xs" : "text-muted-foreground/60 hover:text-foreground"
						}`}
					>
						{t(`bundle-editor.${f}`)} ({counts[f]})
					</button>
				))}
			</div>
			{availableComparisonFiles.length > 0 && (
				<div className="ml-auto">
					<Select value={comparisonPath ?? ""} onValueChange={(v) => onComparisonPathChange(v || null)}>
						<SelectTrigger size="sm">
							<SelectValue className="text-xs" placeholder={t("bundle-editor.compare-with")} />
						</SelectTrigger>
						<SelectContent>
							{availableComparisonFiles.map((f) => (
								<SelectItem key={f.path} value={f.path}>
									{f.localeName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
		</div>
	);
});
