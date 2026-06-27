import type Konva from "konva";
import { useCallback } from "react";
import type { HitboxPositionData } from "@project/schema";
import { HJSON } from "@project/hjson";
import { Group, Rect } from "react-konva";

export function HitboxItem({
	region,
	write,
	onSelect,
	isSelected,
}: {
	region: HitboxPositionData;
	write: (data: string | ((prev: string | null) => string)) => string;
	onSelect?: (key: string) => void;
	isSelected?: boolean;
}) {
	const half = region.size.value * 4;

	const handleClick = useCallback(() => {
		onSelect?.(region.size.path);
	}, [onSelect, region.size.path]);

	const handleResizeDragMove = useCallback((event: Konva.KonvaEventObject<DragEvent>) => {
		event.cancelBubble = true;
	}, []);

	const handleResizeDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const newHalf = Math.round(Math.abs(event.target.x()) / 4);
			const clamped = Math.max(1, newHalf);
			if (region.size.value === clamped) return;
			write((prev) => {
				if (!prev) return prev ?? "";
				return (
					HJSON.parseWithCache(prev).path(region.size.path)?.replaceValue(prev, clamped) ?? prev
				);
			});
		},
		[region.size.path, region.size.value, write],
	);

	return (
		<Group x={0} y={0}>
			{isSelected && (
				<Rect
					x={-half - 4}
					y={-half - 4}
					width={half * 2 + 8}
					height={half * 2 + 8}
					stroke="#eab308"
					strokeWidth={2}
					dash={[4, 4]}
					listening={false}
				/>
			)}
			<Rect
				x={-half}
				y={-half}
				width={half * 2}
				height={half * 2}
				stroke="#ef4444"
				strokeWidth={2}
				fill="transparent"
				listening={false}
			/>
			<Rect
				x={half - 4}
				y={-4}
				width={8}
				height={8}
				fill="#ffffff"
				stroke="#ef4444"
				strokeWidth={2}
				draggable
				onClick={handleClick}
				onTap={handleClick}
				onDragMove={handleResizeDragMove}
				onDragEnd={handleResizeDragEnd}
			/>
		</Group>
	);
}
