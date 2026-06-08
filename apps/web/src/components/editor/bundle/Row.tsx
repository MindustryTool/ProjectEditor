import { memo, useState } from "react";
import type { BundleRow } from "./types";

interface RowProps {
	row: BundleRow;
	comparisonRow: BundleRow | null;
	onValueChange: (key: string, value: string) => void;
	onComparisonValueChange: (key: string, value: string) => void;
}

export const Row = memo(function Row({
	row,
	comparisonRow,
	onValueChange,
	onComparisonValueChange,
}: RowProps) {
	const isMissing = !row.existsInBundle;

	if (row.isInvalid) {
		return (
			<tr className="border-b border-border/20">
				<td className="py-1 px-1 text-red-400/70 font-mono text-xs" colSpan={comparisonRow !== null ? 3 : 2}>
					{row.value}
				</td>
			</tr>
		);
	}

	return (
		<tr className={`border-b h-10 border-border/20 transition-colors ${isMissing ? "bg-yellow-300/6" : "hover:bg-muted/30"}`}>
			<td className="py-1 px-1 font-mono text-xs text-foreground/80">{row.key}</td>
			<td className="py-1 px-1">
				<RowInput value={row.value} onChange={(v) => onValueChange(row.key, v)} />
			</td>
			{comparisonRow !== null && (
				<td className="py-1 px-1">
					<RowInput
						value={comparisonRow.value}
						onChange={(v) => onComparisonValueChange(comparisonRow.key, v)}
					/>
				</td>
			)}
		</tr>
	);
});

const RowInput = memo(function RowInput({
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string) => void;
}) {
	const [local, setLocal] = useState(value);

	return (
		<input
			value={local}
			onChange={(e) => {
				setLocal(e.target.value);
				onChange(e.target.value);
			}}
            autoFocus
			className={`text-xs w-full font-mono border-none appearance-none bg-transparent outline-none ring-0 focus:ring-0`}
		/>
	);
});
