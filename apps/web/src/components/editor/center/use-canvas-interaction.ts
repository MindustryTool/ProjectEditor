import { useCallback, useRef, useState } from "react";
import type Konva from "konva";

export function useCanvasInteraction(width: number, height: number) {
	const stageRef = useRef<Konva.Stage>(null);
	const scaleRef = useRef(1);
	const posRef = useRef({ x: 0, y: 0 });
	const [, forceRender] = useState(0);

const clampPosition = useCallback(
	(x: number, y: number, scale: number) => {
		const minX = -(width * scale);
		const maxX = width;
		const minY = -(height * scale);
		const maxY = height;

		return {
			x: Math.min(maxX, Math.max(minX, x)),
			y: Math.min(maxY, Math.max(minY, y)),
		};
	},
	[width, height],
);

	const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
		e.evt.preventDefault();
		const stage = stageRef.current;
		if (!stage) return;
		const oldScale = scaleRef.current;
		const pointer = stage.getPointerPosition();
		if (!pointer) return;
		const stagePos = posRef.current;

		const mousePointTo = {
			x: (pointer.x - stagePos.x) / oldScale,
			y: (pointer.y - stagePos.y) / oldScale,
		};

		const direction = e.evt.deltaY > 0 ? -1 : 1;
		const factor = direction > 0 ? 1.1 : 1 / 1.1;
		const newScale = Math.max(0.1, Math.min(10, oldScale * factor));

		posRef.current = clampPosition(pointer.x - mousePointTo.x * newScale, pointer.y - mousePointTo.y * newScale, newScale);

		scaleRef.current = newScale;
		stage.position(posRef.current);
		stage.scale({ x: newScale, y: newScale });
		forceRender((n) => n + 1);
	}, [clampPosition]);

	const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
		posRef.current = clampPosition(e.target.x(), e.target.y(), scaleRef.current);
		forceRender((n) => n + 1);
	}, [clampPosition]);

	return { stageRef, scaleRef, posRef, handleWheel, handleDragEnd, forceRender };
}
