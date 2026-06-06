import { useCallback, useRef, useState } from "react";
import type Konva from "konva";

export function useCanvasInteraction() {
	const stageRef = useRef<Konva.Stage>(null);
	const scaleRef = useRef(1);
	const posRef = useRef({ x: 0, y: 0 });
	const [, forceRender] = useState(0);

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

		posRef.current = {
			x: pointer.x - mousePointTo.x * newScale,
			y: pointer.y - mousePointTo.y * newScale,
		};
		scaleRef.current = newScale;
		stage.position(posRef.current);
		stage.scale({ x: newScale, y: newScale });
		forceRender((n) => n + 1);
	}, []);

	const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
		posRef.current = { x: e.target.x(), y: e.target.y() };
		forceRender((n) => n + 1);
	}, []);

	return { stageRef, scaleRef, posRef, handleWheel, handleDragEnd, forceRender };
}
