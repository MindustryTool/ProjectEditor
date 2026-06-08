import { memo, useState } from "react";
import type { BundleRow } from "./types";

interface RowProps {
	row: BundleRow;
	comparisonRow: BundleRow | null;
	onValueChange: (key: string, value: string) => void;
	onComparisonValueChange: (key: string, value: string) => void;
}

export const Row = memo(function Row({ row, comparisonRow, onValueChange, onComparisonValueChange }: RowProps) {
	const isMissing = !row.existsInBundle;
	const gridCols = comparisonRow !== null ? "grid-cols-[35%_1fr_1fr]" : "grid-cols-[35%_1fr]";

	if (row.isInvalid) {
		return (
			<div className={`grid ${gridCols} h-10 max-h-10 min-h-10 border-b border-border/20`}>
				<div className="col-span-full flex items-center py-1 px-1 text-red-400/70 font-mono text-xs text-ellipsis w-full text-nowrap overflow-hidden">
					{row.value}
				</div>
			</div>
		);
	}

	return (
		<div
			className={`grid ${gridCols} divide-x items-center h-10 max-h-10 min-h-10 border-b border-border/20 transition-colors ${isMissing ? "bg-yellow-300/6" : "hover:bg-muted/30"}`}
		>
			<div className="h-full flex items-center px-1.5 font-mono text-xs text-foreground/80 w-full text-ellipsis">{row.key}</div>
			<div className="h-full flex items-center px-1.5">
				<RowInput value={row.value} onChange={(v) => onValueChange(row.key, v)} />
			</div>
			{comparisonRow !== null && (
				<div className="h-full flex items-center px-1.5">
					<RowInput value={comparisonRow.value} onChange={(v) => onComparisonValueChange(comparisonRow.key, v)} />
				</div>
			)}
		</div>
	);
});

const RowInput = memo(function RowInput({
	value,
	onChange,
	placeholder,
}: {
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
}) {
	const [local, setLocal] = useState(value);

	return (
		<input
			value={local}
			onChange={(e) => {
				setLocal(e.target.value);
				onChange(e.target.value);
			}}
			placeholder={placeholder}
			className={`text-xs w-full font-mono border-none appearance-none bg-transparent outline-none ring-0 focus:ring-0`}
		/>
	);
});
