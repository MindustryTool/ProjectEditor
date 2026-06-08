import { memo, useCallback, useState } from "react";
import type { BundleRow } from "./types";

interface RowProps {
	row: BundleRow;
	comparisonRow: BundleRow | null;
	onValueChange: (key: string, value: string | null) => void;
	onComparisonValueChange: (key: string, value: string) => void;
}

export const Row = memo(function Row({ row, comparisonRow, onValueChange, onComparisonValueChange }: RowProps) {
	const isInvalid = row.state === "invalid";
	const gridCols = comparisonRow !== null ? "grid-cols-[35%_1fr_1fr_40px]" : "grid-cols-[35%_1fr_40px]";

	const handleOnChange = useCallback((v: string) => onValueChange(row.key, v), [row.key, onValueChange]);

	if (isInvalid) {
		return (
			<div className={`grid ${gridCols} h-10 max-h-10 min-h-10 border-b border-border/20`}>
				<div className="col-span-full flex items-center py-1 px-1 text-red-400/70 font-mono text-xs text-ellipsis w-full text-nowrap overflow-hidden">
					{row.value}
				</div>
			</div>
		);
	}

	const rowBg = row.state === "missing" ? "bg-yellow-300/6" : row.state === "extra" ? "bg-blue-300/6" : "hover:bg-muted/30";

	return (
		<div className={`grid ${gridCols} items-center h-10 max-h-10 min-h-10 border-b border-border/20 transition-colors ${rowBg}`}>
			<div className="h-full flex items-center px-1.5 font-mono text-xs text-foreground/80 w-full text-ellipsis">{row.key}</div>
			<div className="h-full flex items-center px-1.5 border-l">
				<RowInput value={row.value} onChange={handleOnChange} />
			</div>
			{comparisonRow !== null && (
				<div className="h-full flex items-center px-1.5 border-l">
					<ComparationRowInput value={comparisonRow} onChange={onComparisonValueChange} />
				</div>
			)}
			{row.state === "extra" && (
				<div className="flex items-center justify-center w-10">
					<button
						type="button"
						onClick={() => onValueChange(row.key, null)}
						className="size-5 text-destructive flex items-center justify-center rounded hover:text-red-400 hover:bg-red-400/10 transition-colors"
						title="Delete key"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M3 6h18" />
							<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
							<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
						</svg>
					</button>
				</div>
			)}
		</div>
	);
});

const ComparationRowInput = memo(function ComparationRowInput({
	value,
	onChange,
}: {
	value: BundleRow;
	onChange: (key: string, value: string) => void;
}) {
	const handleComparison = useCallback((v: string) => onChange(value.key, v), [value.key, onChange]);

	return <RowInput value={value.value} onChange={handleComparison} />;
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
