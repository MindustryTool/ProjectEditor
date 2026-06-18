import type Konva from "konva";
import { useCallback } from "react";
import type { ShootPositionData } from "@project/schema";
import { updatePositionData } from "#/components/editor/position-editor/utils";
import { Circle, Group, Line } from "react-konva";

const SIZE = 8;
const WIDTH = 2;
const STROKE = 0.5;

export function ShootItem({
	region,
	write,
}: {
	region: ShootPositionData;
	write: (data: string | ((prev: string | null) => string)) => string;
}) {
	const weaponX = region.weaponPosition.x.value;
	const weaponY = region.weaponPosition.y.value;
	const shootOffsetX = region.position.x.value;
	const shootOffsetY = region.position.y.value;
	const displayX = (weaponX + shootOffsetX) * 4;
	const displayY = -(weaponY + shootOffsetY) * 4;

	const handleDragMove = useCallback((event: Konva.KonvaEventObject<DragEvent>) => {
		event.cancelBubble = true;
	}, []);

	const handleDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const x = event.target.x() / 4;
			const y = event.target.y() / 4;
			const offsetX = x - weaponX;
			const offsetY = -y - weaponY;
			write((prev) => updatePositionData(prev ?? "", region.position.x.path, region.position.y.path, offsetX, offsetY) ?? prev ?? "");
		},
		[weaponX, weaponY, region.position.x.path, region.position.y.path, write],
	);

	const handleMirrorDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const x = event.target.x() / 4;
			const y = event.target.y() / 4;
			const offsetX = -x - weaponX;
			const offsetY = -y - weaponY;
			write((prev) => updatePositionData(prev ?? "", region.position.x.path, region.position.y.path, offsetX, offsetY) ?? prev ?? "");
		},
		[weaponX, weaponY, region.position.x.path, region.position.y.path, write],
	);

	return (
		<>
			<Group x={displayX} y={displayY} draggable onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
				<Line
					points={[-SIZE - STROKE / 2, -SIZE - STROKE / 2, SIZE + STROKE / 2, SIZE + STROKE / 2]}
					stroke="#000000"
					strokeWidth={WIDTH + STROKE * 2}
				/>
				<Line
					points={[SIZE + STROKE / 2, -SIZE - STROKE / 2, -SIZE - STROKE / 2, SIZE + STROKE / 2]}
					stroke="#000000"
					strokeWidth={WIDTH + STROKE * 2}
				/>
				<Line points={[-SIZE, -SIZE, SIZE, SIZE]} stroke="#ef4444" strokeWidth={WIDTH} />
				<Line points={[SIZE, -SIZE, -SIZE, SIZE]} stroke="#ef4444" strokeWidth={WIDTH} />
				<Circle radius={SIZE} stroke="#000000" strokeWidth={WIDTH + STROKE * 2} />
				<Circle radius={SIZE} stroke="#ef4444" strokeWidth={WIDTH} />
			</Group>
			{region.mirror && (
				<Group x={-displayX} y={displayY} draggable onDragMove={handleDragMove} onDragEnd={handleMirrorDragEnd}>
					<Line
						points={[-SIZE - STROKE / 2, -SIZE - STROKE / 2, SIZE + STROKE / 2, SIZE + STROKE / 2]}
						stroke="#000000"
						strokeWidth={WIDTH + STROKE * 2}
					/>
					<Line
						points={[SIZE + STROKE / 2, -SIZE - STROKE / 2, -SIZE - STROKE / 2, SIZE + STROKE / 2]}
						stroke="#000000"
						strokeWidth={WIDTH + STROKE * 2}
					/>
					<Line points={[-SIZE, -SIZE, SIZE, SIZE]} stroke="#ef4444" strokeWidth={WIDTH} />
					<Line points={[SIZE, -SIZE, -SIZE, SIZE]} stroke="#ef4444" strokeWidth={WIDTH} />
					<Circle radius={SIZE} stroke="#000000" strokeWidth={WIDTH + STROKE * 2} />
					<Circle radius={SIZE} stroke="#ef4444" strokeWidth={WIDTH} />
				</Group>
			)}
		</>
	);
}
