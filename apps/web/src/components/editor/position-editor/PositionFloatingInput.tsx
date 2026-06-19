import { usePositionEdit } from "./preview/usePositionEdit";
import { PositionInputs } from "./preview/PositionInputs";
import type { PositionEditHandler } from "./preview/types";

export function PositionFloatingInput({
	position,
	onPositionChange,
	floatingPos,
	containerWidth,
}: {
	position: { x: { value: number; path: string }; y: { value: number; path: string } };
	onPositionChange?: PositionEditHandler;
	floatingPos: { x: number; y: number };
	containerWidth: number;
}) {
	const posEdit = usePositionEdit(position, onPositionChange);

	const OFFSET_Y = -60;
	const PANEL_WIDTH = 140;

	let left = floatingPos.x - PANEL_WIDTH / 2;
	if (left < 4) left = 4;
	if (left + PANEL_WIDTH > containerWidth - 4) left = containerWidth - PANEL_WIDTH - 4;

	const top = floatingPos.y + OFFSET_Y;

	return (
		<div
			className="absolute z-50 bg-card border border-border rounded-lg shadow-xl p-2 flex flex-col gap-1"
			style={{
				left: `${left}px`,
				top: `${top}px`,
				width: `${PANEL_WIDTH}px`,
			}}
			onClick={(e) => e.stopPropagation()}
		>
			<PositionInputs {...posEdit} />
		</div>
	);
}
