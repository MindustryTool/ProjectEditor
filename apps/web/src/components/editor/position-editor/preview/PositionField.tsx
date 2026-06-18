import { Input } from "#/components/ui/input";

export function PositionField({
	label,
	value,
	onChange,
	onCommit,
	onRevert,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	onCommit: () => void;
	onRevert: () => void;
}) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-sm">{label}</span>
			<Input
				type="number"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onBlur={onCommit}
				onKeyDown={(e) => {
					if (e.key === "Enter") onCommit();
					if (e.key === "Escape") onRevert();
				}}
				onClick={(e) => e.stopPropagation()}
			/>
		</div>
	);
}
