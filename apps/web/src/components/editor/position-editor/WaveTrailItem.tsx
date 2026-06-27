import type Konva from "konva";
import { useCallback } from "react";
import type { WaveTrailPositionData } from "@project/schema";
import { updatePositionData } from "#/components/editor/position-editor/utils";
import { Circle, Group, Line } from "react-konva";

const SIZE = 12;
const WIDTH = 2;

export function WaveTrailItem({
	region,
	write,
	onSelect,
	isSelected,
}: {
	region: WaveTrailPositionData;
	write: (data: string | ((prev: string | null) => string)) => string;
	onSelect?: (key: string) => void;
	isSelected?: boolean;
}) {
	const x = region.position.x.value * 4;
	const y = -region.position.y.value * 4;

	const handleDragMove = useCallback((event: Konva.KonvaEventObject<DragEvent>) => {
		event.cancelBubble = true;
	}, []);

	const handleDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const dx = Math.round(event.target.x() / 4);
			const dy = Math.round(event.target.y() / 4);
			write((prev) => updatePositionData(prev ?? "", region.position.x.path, region.position.y.path, dx, -dy) ?? prev ?? "");
		},
		[region.position.x.path, region.position.y.path, write],
	);

	const handleMirrorDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const dx = Math.round(event.target.x() / 4);
			const dy = Math.round(event.target.y() / 4);
			write((prev) => updatePositionData(prev ?? "", region.position.x.path, region.position.y.path, -dx, -dy) ?? prev ?? "");
		},
		[region.position.x.path, region.position.y.path, write],
	);

	const handleSelectClick = useCallback(() => {
		onSelect?.(region.position.x.path);
	}, [onSelect, region.position.x.path]);

	const waveContent = (
		<>
			<Circle radius={SIZE} fill="#1e3a5f" stroke="#60a5fa" strokeWidth={WIDTH} />
			<Line points={[-8, -3, -4, -7, 0, -3, 4, 1, 8, -3]} stroke="#93c5fd" strokeWidth={1.5} tension={0.4} lineCap="round" />
			<Line points={[-8, 3, -4, -1, 0, 3, 4, 7, 8, 3]} stroke="#93c5fd" strokeWidth={1.5} tension={0.4} lineCap="round" />
		</>
	);

	return (
		<>
			<Group x={x} y={y} draggable onDragMove={handleDragMove} onDragEnd={handleDragEnd} onClick={handleSelectClick} onTap={handleSelectClick}>
				{isSelected && (
					<Circle radius={SIZE + 4} stroke="#eab308" strokeWidth={2} dash={[4, 4]} />
				)}
				{waveContent}
			</Group>
			<Group x={-x} y={y} draggable onDragMove={handleDragMove} onDragEnd={handleMirrorDragEnd} onClick={handleSelectClick} onTap={handleSelectClick}>
				{isSelected && (
					<Circle radius={SIZE + 4} stroke="#eab308" strokeWidth={2} dash={[4, 4]} />
				)}
				{waveContent}
			</Group>
		</>
	);
}
