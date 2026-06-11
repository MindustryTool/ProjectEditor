import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import type Konva from "konva";
import { usePixelImage } from "../hooks/use-pixel-image";
import { useCanvasNavigation } from "../hooks/use-canvas-navigation";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";

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
  const spacePressed = useRef(false);
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
  const activeTool = usePixelEditorStore((s) => s.tool);

  const { getCanvas, updatePixels, updateRegion } = usePixelImage(width, height);
  const canvas = useLayerStore((s) => s.canvas);
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
        spacePressed.current = e.type === "keydown";
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
      if (e.evt.button === 1 || spacePressed.current) return;
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
      if (spacePressed.current) return;
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

  const handlePointerUp = useCallback(() => {
    onPointerUp?.();
  }, [onPointerUp]);

  const handleDragStart = useCallback(() => {
    posRef.current = { x: internalStageRef.current?.x() ?? 0, y: internalStageRef.current?.y() ?? 0 };
  }, [posRef]);

  const isPanning = activeTool === "hand" || spacePressed.current;

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
          {gridVisible && scaleRef.current >= 4 && (
            <GridLayer width={width} height={height} scale={scaleRef.current} />
          )}
        </Layer>
      </Stage>
      <ZoomControls scale={scale} zoomIn={zoomIn} zoomOut={zoomOut} />
    </div>
  );
}

function GridLayer({ width, height, scale }: { width: number; height: number; scale: number }) {
  const lines: React.ReactNode[] = [];
  const step = scale >= 8 ? 1 : Math.ceil(8 / scale);
  for (let x = 0; x <= width; x += step) {
    lines.push(
      <Rect
        key={`v${x}`}
        x={x}
        y={0}
        width={1 / scale}
        height={height}
        fill="rgba(0,0,0,0.15)"
        listening={false}
      />,
    );
  }
  for (let y = 0; y <= height; y += step) {
    lines.push(
      <Rect
        key={`h${y}`}
        x={0}
        y={y}
        width={width}
        height={1 / scale}
        fill="rgba(0,0,0,0.15)"
        listening={false}
      />,
    );
  }
  return <>{lines}</>;
}

import { ZoomIn, ZoomOut } from "lucide-react";

function ZoomControls({ scale, zoomIn, zoomOut }: { scale: number; zoomIn: () => void; zoomOut: () => void }) {
  return (
    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-card/90 backdrop-blur-sm border p-1 text-xs">
      <button
        className="rounded p-1 hover:bg-accent"
        onClick={zoomIn}
        title="Zoom In"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-12 text-center font-mono">
        {Math.round(scale * 100)}%
      </span>
      <button
        className="rounded p-1 hover:bg-accent"
        onClick={zoomOut}
        title="Zoom Out"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
