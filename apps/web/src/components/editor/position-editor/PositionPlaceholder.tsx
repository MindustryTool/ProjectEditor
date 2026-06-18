import type { EnginePositionData, PositionData, ShootPositionData } from "@project/schema";
import type Konva from "konva";
import { useCallback, useEffect, useState } from "react";
import { Arc, Circle, Group, Line, Rect, Text } from "react-konva";

const REGION_COLORS: Record<string, string> = {
	part: "#3b82f6",
	"draw-region": "#22c55e",
};
const DEFAULT_COLOR = "#6b7280";

type DragHandler = (x: number, y: number) => void;

export function useDragHandling(initX: number, initY: number, onDrag?: DragHandler) {
	const [localX, setLocalX] = useState(initX);
	const [localY, setLocalY] = useState(initY);

	useEffect(() => {
		setLocalX(initX);
		setLocalY(initY);
	}, [initX, initY]);

	const handleDragMove = useCallback((event: Konva.KonvaEventObject<DragEvent>) => {
		event.cancelBubble = true;
		setLocalX(event.target.x());
		setLocalY(event.target.y());
	}, []);

	const handleDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const x = Math.round(event.target.x() / 4);
			const y = Math.round(event.target.y() / 4);
			if (!onDrag) return;
			onDrag(x, -y);
		},
		[onDrag],
	);

	return { localX, localY, handleDragMove, handleDragEnd };
}

export function EnginePositionPlaceholder({ region, onDrag }: { region: EnginePositionData; onDrag?: DragHandler }) {
	const { localX, localY, handleDragMove, handleDragEnd } = useDragHandling(
		region.position.x.value * 4,
		-region.position.y.value * 4,
		onDrag,
	);
	const r = region.radius.value * 4;

	return (
		<Group x={localX} y={localY} draggable={!!onDrag} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
			<Circle radius={Math.max(r, 16)} fill="#eab308" stroke="#a16207" strokeWidth={2} opacity={0.7} />
			<Arc angle={region.rotation.value} innerRadius={0} outerRadius={Math.max(r, 16)} fill="#fef08a" opacity={0.5} />
			<Text
				text="engine"
				fontSize={9}
				fill="#713f12"
				width={40}
				height={16}
				offsetX={20}
				offsetY={8}
				align="center"
				verticalAlign="middle"
			/>
		</Group>
	);
}

export function ShootPositionPlaceholder({
	region,
	onDrag,
	initX,
	initY,
}: {
	region: ShootPositionData;
	onDrag?: DragHandler;
	initX?: number;
	initY?: number;
}) {
	const { localX, localY, handleDragMove, handleDragEnd } = useDragHandling(
		initX ?? region.position.x.value * 4,
		initY ?? -region.position.y.value * 4,
		onDrag,
	);
    
	const size = 6;

	return (
		<Group x={localX} y={localY} draggable={!!onDrag} onDragMove={handleDragMove} onDragEnd={handleDragEnd} offsetX={0} offsetY={0}>
			<Line points={[-size, -size, size, size]} stroke="#ef4444" strokeWidth={4} />
			<Line points={[size, -size, -size, size]} stroke="#ef4444" strokeWidth={4} />
		</Group>
	);
}

export function PositionPlaceholder({ region, onDrag }: { region: PositionData; onDrag?: DragHandler }) {
	const color = REGION_COLORS[region.type] ?? DEFAULT_COLOR;
	const { localX, localY, handleDragMove, handleDragEnd } = useDragHandling(
		region.position.x.value * 4,
		-region.position.y.value * 4,
		onDrag,
	);
	const label = region.type;

	return (
		<Group x={localX} y={localY} draggable={!!onDrag} onDragMove={handleDragMove} onDragEnd={handleDragEnd} offsetX={0} offsetY={0}>
			<Rect width={40} height={40} fill={color} stroke="white" strokeWidth={1} opacity={0.8} />
			<Text text={label} fontSize={9} fill="white" width={40} height={40} align="center" verticalAlign="middle" />
		</Group>
	);
}
