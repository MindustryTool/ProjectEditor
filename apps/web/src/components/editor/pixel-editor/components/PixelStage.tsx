import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import type Konva from "konva";
import { usePixelImage } from "../hooks/use-pixel-image";
import { useCanvasNavigation } from "../hooks/use-canvas-navigation";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";
import { SelectionOverlay } from "./SelectionOverlay";
import { PixelGridLayer } from "./PixelGridLayer";
import { GridLayer } from "./GridLayer";
import { OnionSkinOverlay } from "./OnionSkinOverlay";
import { LayerBoundsOverlay } from "./LayerBoundsOverlay";
import { TransformHandles } from "./TransformHandles";
import { ZoomControls } from "./ZoomControls";

interface DirtyRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PixelStageProps {
  width: number;
  height: number;
  onPointerDown?: (x: number, y: number, button: number) => void;
  onPointerMove?: (x: number, y: number) => void;
  onPointerUp?: () => void;
  setRenderFn?: (fn: (rects: DirtyRect[]) => void) => void;
  stageRef?: React.RefObject<Konva.Stage | null>;
}

export function PixelStage({ width, height, onPointerDown, onPointerMove, onPointerUp, setRenderFn }: PixelStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalStageRef = useRef<Konva.Stage>(null);
  const konvaImageRef = useRef<Konva.Image>(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
  const [spacePressed, setSpacePressed] = useState(false);
  const spacePressedRef = useRef(false);
  const fittedRef = useRef(false);

  const {
    scale,
    scaleRef,
    posRef,
    handleWheel,
    handleDragEnd,
    zoomIn,
    zoomOut,
    zoomToFit,
  } = useCanvasNavigation(internalStageRef);

  const checkerboardVisible = usePixelEditorStore((s) => s.checkerboardVisible);
  const gridVisible = usePixelEditorStore((s) => s.gridVisible);
  const pixelGridVisible = usePixelEditorStore((s) => s.pixelGridVisible);
  const activeTool = usePixelEditorStore((s) => s.tool);
  const onionSkinVisible = usePixelEditorStore((s) => s.onionSkinVisible);
  const layerBoundsVisible = usePixelEditorStore((s) => s.layerBoundsVisible);
  const [dashOffset, setDashOffset] = useState(0);

  const { getCanvas, updatePixels, updateRegion } = usePixelImage(width, height);
  const canvas = useLayerStore((s) => s.canvas);
  const selectionBounds = canvas?.selectionBounds ?? null;
  const selectionMask = canvas?.selectionMask ?? null;
  const isTransforming = canvas?.isTransforming ?? false;
  const renderVersion = useLayerStore((s) => s.renderVersion);

  const renderDirtyRects = useCallback(
    (rects: DirtyRect[]) => {
      if (!canvas) return;
      const stage = internalStageRef.current;
      if (!stage) return;
      const cw = canvas.width;
      const ch = canvas.height;
      for (const rect of rects) {
        const x = Math.max(0, rect.x);
        const y = Math.max(0, rect.y);
        const w = Math.min(rect.w, cw - x);
        const h = Math.min(rect.h, ch - y);
        if (w <= 0 || h <= 0) continue;
        const region = canvas.getCompositeRegion(x, y, w, h);
        updateRegion(region, x, y, w, h);
      }
      konvaImageRef.current?.getLayer()?.batchDraw();
    },
    [canvas, updateRegion],
  );

  useEffect(() => {
    if (!setRenderFn) return;
    setRenderFn(renderDirtyRects);
  }, [setRenderFn, renderDirtyRects]);

  useEffect(() => {
    if (!canvas) return;
    const composite = canvas.getCompositeData();
    updatePixels(composite);
    if (konvaImageRef.current) {
      konvaImageRef.current.image(getCanvas());
      konvaImageRef.current.getLayer()?.batchDraw();
    }
  }, [renderVersion, canvas, updatePixels, getCanvas]);

  useEffect(() => {
    if (!canvas || fittedRef.current) return;
    fittedRef.current = true;
    zoomToFit(width, height, containerSize.w, containerSize.h);
  }, [canvas, width, height, containerSize, zoomToFit]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const pressed = e.type === "keydown";
        spacePressedRef.current = pressed;
        setSpacePressed(pressed);
      }
    };
    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keyup", handler);
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      e.evt.preventDefault();
      if (e.evt.button === 1 || spacePressedRef.current) return;
      const stage = internalStageRef.current;
      if (!stage) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const x = Math.floor((pointer.x - posRef.current.x) / scaleRef.current);
      const y = Math.floor((pointer.y - posRef.current.y) / scaleRef.current);
      onPointerDown?.(x, y, e.evt.button);
    },
    [onPointerDown, scaleRef, posRef],
  );

  const handlePointerMove = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      e.evt.preventDefault();
      if (spacePressedRef.current) return;
      const stage = internalStageRef.current;
      if (!stage) return;
      if (!e.evt.buttons) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const x = Math.floor((pointer.x - posRef.current.x) / scaleRef.current);
      const y = Math.floor((pointer.y - posRef.current.y) / scaleRef.current);
      onPointerMove?.(x, y);
    },
    [onPointerMove, scaleRef, posRef],
  );

  const handlePointerUp = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      e.evt.preventDefault();
      onPointerUp?.();
    },
    [onPointerUp],
  );

  const handleDragStart = useCallback(() => {
    posRef.current = { x: internalStageRef.current?.x() ?? 0, y: internalStageRef.current?.y() ?? 0 };
  }, [posRef]);

  const isPanning = activeTool === "hand" || spacePressed;

  useEffect(() => {
    if (!selectionMask) return;
    const interval = setInterval(() => {
      setDashOffset((o) => (o + 1) % 8);
    }, 100);
    return () => clearInterval(interval);
  }, [selectionMask]);

  const canvasEl = getCanvas();

  const checkerboardPattern = useMemo(() => {
    if (!checkerboardVisible) return null;
    const size = 8;
    const pattern = document.createElement("canvas");
    pattern.width = size * 2;
    pattern.height = size * 2;
    const ctx = pattern.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(0, 0, size * 2, size * 2);
    ctx.fillStyle = "#aaaaaa";
    ctx.fillRect(0, 0, size, size);
    ctx.fillRect(size, size, size, size);
    return pattern;
  }, [checkerboardVisible]);

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden bg-background relative">
      <Stage
        ref={internalStageRef}
        width={containerSize.w}
        height={containerSize.h}
        draggable={isPanning}
        onWheel={handleWheel}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        scaleX={scaleRef.current}
        scaleY={scaleRef.current}
        x={posRef.current.x}
        y={posRef.current.y}
      >
        <Layer imageSmoothingEnabled={false}>
          {checkerboardPattern && (
            <KonvaImage
              image={checkerboardPattern}
              x={0}
              y={0}
              width={width}
              height={height}
              listening={false}
              perfectDrawEnabled={false}
            />
          )}
          {canvasEl && <KonvaImage ref={konvaImageRef} image={canvasEl} x={0} y={0} listening={false} />}
          {canvas && onionSkinVisible && <OnionSkinOverlay canvas={canvas} width={width} height={height} />}
          {canvas && layerBoundsVisible && <LayerBoundsOverlay canvas={canvas} width={width} height={height} />}
          {selectionBounds && (
            <SelectionOverlay
              bounds={selectionBounds}
              width={width}
              height={height}
              dashOffset={dashOffset}
            />
          )}
          {activeTool === "scale" && selectionBounds && !isTransforming && (
            <TransformHandles bounds={selectionBounds} />
          )}
          {gridVisible && scaleRef.current >= 4 && (
            <GridLayer width={width} height={height} scale={scaleRef.current} />
          )}
          {pixelGridVisible && scaleRef.current >= 6 && (
            <PixelGridLayer width={width} height={height} scale={scaleRef.current} />
          )}
        </Layer>
      </Stage>
      <ZoomControls scale={scale} zoomIn={zoomIn} zoomOut={zoomOut} />
    </div>
  );
}
