import { useCallback, useRef, useState } from "react";
import type Konva from "konva";

export function useCanvasNavigation(stageRef: React.RefObject<Konva.Stage | null>) {
  const scaleRef = useRef(1);
  const [scale, setScaleState] = useState(1);
  const posRef = useRef({ x: 0, y: 0 });
  const [, forceRender] = useState(0);

  const zoomTo = useCallback(
    (newScale: number, centerX?: number, centerY?: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const clamped = Math.max(0.01, Math.min(32, newScale));
      if (centerX !== undefined && centerY !== undefined) {
        const mousePointTo = {
          x: (centerX - posRef.current.x) / scaleRef.current,
          y: (centerY - posRef.current.y) / scaleRef.current,
        };
        posRef.current = {
          x: centerX - mousePointTo.x * clamped,
          y: centerY - mousePointTo.y * clamped,
        };
      }
      scaleRef.current = clamped;
      setScaleState(clamped);
      stage.position(posRef.current);
      stage.scale({ x: clamped, y: clamped });
      forceRender((n) => n + 1);
    },
    [stageRef],
  );

  const zoomIn = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const center = { x: stage.width() / 2, y: stage.height() / 2 };
    zoomTo(scaleRef.current * 1.25, center.x, center.y);
  }, [zoomTo, stageRef]);

  const zoomOut = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const center = { x: stage.width() / 2, y: stage.height() / 2 };
    zoomTo(scaleRef.current / 1.25, center.x, center.y);
  }, [zoomTo, stageRef]);

  const zoomToFit = useCallback(
    (canvasWidth: number, canvasHeight: number, containerWidth: number, containerHeight: number) => {
      const scaleX = containerWidth / canvasWidth;
      const scaleY = containerHeight / canvasHeight;
      const fitScale = Math.min(scaleX, scaleY) * 0.9;
      scaleRef.current = fitScale;
      posRef.current = {
        x: (containerWidth - canvasWidth * fitScale) / 2,
        y: (containerHeight - canvasHeight * fitScale) / 2,
      };
      const stage = stageRef.current;
      if (stage) {
        stage.position(posRef.current);
        stage.scale({ x: fitScale, y: fitScale });
        forceRender((n) => n + 1);
      }
    },
    [stageRef],
  );

  const zoom100 = useCallback(() => {
    scaleRef.current = 1;
    posRef.current = { x: 0, y: 0 };
    const stage = stageRef.current;
    if (stage) {
      stage.position(posRef.current);
      stage.scale({ x: 1, y: 1 });
      forceRender((n) => n + 1);
    }
  }, [stageRef]);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const factor = direction > 0 ? 1.1 : 1 / 1.1;
      zoomTo(scaleRef.current * factor, pointer.x, pointer.y);
    },
    [zoomTo, stageRef],
  );

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      posRef.current = { x: e.target.x(), y: e.target.y() };
    },
    [],
  );

  const panTo = useCallback(
    (x: number, y: number) => {
      posRef.current = { x, y };
      const stage = stageRef.current;
      if (stage) {
        stage.position(posRef.current);
        forceRender((n) => n + 1);
      }
    },
    [stageRef],
  );

  const getScale = useCallback(() => scaleRef.current, []);
  const getPosition = useCallback(() => posRef.current, []);

  const resetView = useCallback(() => {
    scaleRef.current = 1;
    posRef.current = { x: 0, y: 0 };
    const stage = stageRef.current;
    if (stage) {
      stage.position(posRef.current);
      stage.scale({ x: 1, y: 1 });
      forceRender((n) => n + 1);
    }
  }, [stageRef]);

  return {
    scale,
    scaleRef,
    posRef,
    zoomIn,
    zoomOut,
    zoomToFit,
    zoom100,
    zoomTo,
    handleWheel,
    handleDragEnd,
    panTo,
    getScale,
    getPosition,
    resetView,
    forceRender,
  };
}


