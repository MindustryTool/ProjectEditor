import { useCallback, useRef, useState } from "react";
import type Konva from "konva";

const DEAD_ZONE = 5;

interface TouchState {
	prevPinchDistance: number;
	isPinching: boolean;
	isPanning: boolean;
	panStartPos: { x: number; y: number };
	panStartPointer: { x: number; y: number };
}

export function useCanvasInteraction(width: number, height: number) {
	const stageRef = useRef<Konva.Stage>(null);
	const scaleRef = useRef(1);
	const posRef = useRef({ x: 0, y: 0 });
	const touchRef = useRef<TouchState | null>(null);
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

	const applyTransform = useCallback(() => {
		const stage = stageRef.current;
		if (!stage) return;
		stage.position(posRef.current);
		stage.scale({ x: scaleRef.current, y: scaleRef.current });
		forceRender((n) => n + 1);
	}, []);

	const getStagePoint = useCallback((clientX: number, clientY: number) => {
		const stage = stageRef.current;
		if (!stage) return { x: clientX, y: clientY };
		const box = stage.container().getBoundingClientRect();
		return { x: clientX - box.left, y: clientY - box.top };
	}, []);

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

	const handleDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
		posRef.current = clampPosition(e.target.x(), e.target.y(), scaleRef.current);
		forceRender((n) => n + 1);
	}, [clampPosition]);

	const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
		posRef.current = clampPosition(e.target.x(), e.target.y(), scaleRef.current);
		forceRender((n) => n + 1);
	}, [clampPosition]);

	const handleTouchStart = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
		const touches = e.evt.touches;
		if (touches.length >= 2) {
			const t1 = touches[0]!;
			const t2 = touches[1]!;
			const dx = t1.clientX - t2.clientX;
			const dy = t1.clientY - t2.clientY;
			touchRef.current = {
				prevPinchDistance: Math.sqrt(dx * dx + dy * dy),
				isPinching: true,
				isPanning: false,
				panStartPos: { x: 0, y: 0 },
				panStartPointer: { x: 0, y: 0 },
			};
		} else if (touches.length === 1) {
			const t = touches[0]!;
			const stagePoint = getStagePoint(t.clientX, t.clientY);
			touchRef.current = {
				prevPinchDistance: 0,
				isPinching: false,
				isPanning: false,
				panStartPos: { ...posRef.current },
				panStartPointer: stagePoint,
			};
		}
	}, [getStagePoint]);

	const handleTouchMove = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
		e.evt.preventDefault();
		const state = touchRef.current;
		if (!state) return;
		const stage = stageRef.current;
		if (!stage) return;
		const touches = e.evt.touches;

		if (state.isPinching && touches.length >= 2) {
			const t1 = touches[0]!;
			const t2 = touches[1]!;
			const dx = t1.clientX - t2.clientX;
			const dy = t1.clientY - t2.clientY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const factor = dist / state.prevPinchDistance;
			const mx = (t1.clientX + t2.clientX) / 2;
			const my = (t1.clientY + t2.clientY) / 2;
			const stagePoint = getStagePoint(mx, my);
			const oldScale = scaleRef.current;
			const newScale = Math.max(0.1, Math.min(10, oldScale * factor));
			const currentPos = posRef.current;

			const mousePointTo = {
				x: (stagePoint.x - currentPos.x) / oldScale,
				y: (stagePoint.y - currentPos.y) / oldScale,
			};

			posRef.current = clampPosition(stagePoint.x - mousePointTo.x * newScale, stagePoint.y - mousePointTo.y * newScale, newScale);
			scaleRef.current = newScale;
			state.prevPinchDistance = dist;
			applyTransform();
		} else if (!state.isPinching && touches.length === 1) {
			const t = touches[0]!;
			const stagePoint = getStagePoint(t.clientX, t.clientY);
			const dx = stagePoint.x - state.panStartPointer.x;
			const dy = stagePoint.y - state.panStartPointer.y;

			if (!state.isPanning && (Math.abs(dx) > DEAD_ZONE || Math.abs(dy) > DEAD_ZONE)) {
				state.isPanning = true;
			}

			if (state.isPanning) {
				posRef.current = clampPosition(
					state.panStartPos.x + dx,
					state.panStartPos.y + dy,
					scaleRef.current,
				);
				applyTransform();
			}
		}
	}, [clampPosition, applyTransform, getStagePoint]);

	const handleTouchEnd = useCallback(() => {
		touchRef.current = null;
	}, []);

	return {
		stageRef,
		scaleRef,
		posRef,
		handleWheel,
		handleDragMove,
		handleDragEnd,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
		forceRender,
	};
}
