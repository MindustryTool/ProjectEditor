import { useCallback, useRef } from "react";

import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";
import { useHistoryStore } from "../store/history-store";

import { type CanvasState, hexToUint32, uint32ToRgba, rgbaToHex } from "../utils/canvas-state";
import {
  drawLine, drawCircle, drawEllipse, drawRectangle,
  floodFill, replaceColor, sprayPixels, drawBrushStamp,
  drawBezier, getSymmetryPoints,
} from "../utils/drawing-tools";
import type { Layer } from "../utils/pixel-canvas";
import { isSelectionActive } from "../utils/selection-tools";

export interface DirtyRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function constrainToSelection(canvas: CanvasState, beforeCanvas: CanvasState, width: number): void {
  const pixelCanvas = useLayerStore.getState().canvas;
  const mask = pixelCanvas?.selectionMask ?? null;
  if (!mask || !isSelectionActive(mask)) return;
  const height = canvas.height;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) {
        const idx = y * width + x;
        canvas.setPixelAtIndex(idx, beforeCanvas.getPixelAtIndex(idx));
      }
    }
  }
}

export function useDrawingTools() {
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const beforeStrokeRef = useRef<CanvasState | null>(null);
  const dirtyRectsRef = useRef<DirtyRect[]>([]);
  const rafRef = useRef<number | null>(null);
  const renderFnRef = useRef<((rects: DirtyRect[]) => void) | null>(null);
  const xRef = useRef(-1);
  const yRef = useRef(-1);
  const bezierPointsRef = useRef<[number, number][]>([]);
  const tool = usePixelEditorStore((s) => s.tool);
  const foregroundColor = usePixelEditorStore((s) => s.foregroundColor);
  const tolerance = usePixelEditorStore((s) => s.tolerance);
  const sprayDensity = usePixelEditorStore((s) => s.sprayDensity);
  const sprayRadius = usePixelEditorStore((s) => s.sprayRadius);
  const brushSize = usePixelEditorStore((s) => s.brushSize);
  const brushOpacity = usePixelEditorStore((s) => s.brushOpacity);
  const brushShape = usePixelEditorStore((s) => s.brushShape);
  const symmetry = usePixelEditorStore((s) => s.symmetry);
  const symmetrySegments = usePixelEditorStore((s) => s.symmetrySegments);
  const pixelPerfect = usePixelEditorStore((s) => s.pixelPerfect);
  const setDirty = usePixelEditorStore((s) => s.setDirty);
  const canvas = useLayerStore((s) => s.canvas);
  const document = useLayerStore((s) => s.document);

  const markDirty = useCallback((x: number, y: number, w: number = 1, h: number = 1) => {
    dirtyRectsRef.current.push({ x, y, w, h });
  }, []);

  const scheduleRender = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rects = dirtyRectsRef.current;
      dirtyRectsRef.current = [];
      if (rects.length > 0) {
        renderFnRef.current?.(rects);
      }
    });
  }, []);

  const setRenderFn = useCallback((fn: (rects: DirtyRect[]) => void) => {
    renderFnRef.current = fn;
  }, []);

  const drawPixelWithSymmetry = useCallback((layerCanvas: CanvasState, x: number, y: number, color: string) => {
    const uint32Color = hexToUint32(color);
    layerCanvas.setPixel(x, y, uint32Color);
    if (symmetry === "none") return;
    const points = getSymmetryPoints(x, y, layerCanvas.width, layerCanvas.height, symmetry, symmetrySegments);
    for (const [px, py] of points) {
      layerCanvas.setPixel(px, py, uint32Color);
    }
  }, [symmetry, symmetrySegments]);

  const drawLineWithSymmetry = useCallback((layerCanvas: CanvasState, x0: number, y0: number, x1: number, y1: number, color: string) => {
    drawLine(layerCanvas, x0, y0, x1, y1, color);
    if (symmetry === "none") return;
    const points0 = getSymmetryPoints(x0, y0, layerCanvas.width, layerCanvas.height, symmetry, symmetrySegments);
    const points1 = getSymmetryPoints(x1, y1, layerCanvas.width, layerCanvas.height, symmetry, symmetrySegments);
    const len = Math.max(points0.length, points1.length);
    for (let i = 0; i < len; i++) {
      const p0 = points0[Math.min(i, points0.length - 1)]!;
      const p1 = points1[Math.min(i, points1.length - 1)]!;
      drawLine(layerCanvas, p0[0], p0[1], p1[0], p1[1], color);
    }
  }, [symmetry, symmetrySegments]);

    const getActiveLayer = useCallback((): Layer | null => {
      if (!canvas) return null;
      const layer = canvas.currentLayer;
      if (layer.locked) return null;
      return layer;
    }, [canvas]);

  const constrainPixelPerfect = useCallback((x: number, y: number, startX: number, startY: number): [number, number] => {
    if (!pixelPerfect) return [x, y];
    const dx = x - startX;
    const dy = y - startY;
    if (dx === 0 && dy === 0) return [x, y];
    if (Math.abs(dx) > Math.abs(dy)) {
      return [x, startY];
    }
    return [startX, y];
  }, [pixelPerfect]);

  const handlePointerDown = useCallback(
    (x: number, y: number, button: number) => {
      xRef.current = x;
      yRef.current = y;
      lastPointRef.current = { x, y };
      beforeStrokeRef.current = null;
      const layer = getActiveLayer();
      if (!layer || !canvas) return;
      const width = canvas.width;

      switch (tool) {
        case "pencil":
        case "eraser":
        case "brush": {
          const beforeCanvas = layer.canvas.clone();
          beforeStrokeRef.current = beforeCanvas;
          layer.canvas.beginRecord();
          if (tool === "brush") {
            drawBrushStamp(layer.canvas, x, y, brushSize, foregroundColor, brushShape, brushOpacity);
          } else {
            drawPixelWithSymmetry(layer.canvas, x, y, tool === "eraser" ? "#00000000" : foregroundColor);
          }
          constrainToSelection(layer.canvas, beforeCanvas, width);
          markDirty(x - brushSize, y - brushSize, brushSize * 2, brushSize * 2);
          scheduleRender();
          setDirty(true);
          document?.markDirty();
          break;
        }
        case "line":
        case "rectangle":
        case "filled-rectangle":
        case "circle":
        case "filled-circle":
        case "ellipse":
        case "filled-ellipse": {
          const beforeCanvas = layer.canvas.clone();
          beforeStrokeRef.current = beforeCanvas;
          layer.canvas.beginRecord();
          break;
        }
        case "fill-bucket": {
          layer.canvas.beginRecord();
          const beforeCanvas = layer.canvas.clone();
          if (button === 2) {
            replaceColor(layer.canvas, x, y, foregroundColor, tolerance);
          } else {
            floodFill(layer.canvas, x, y, foregroundColor, tolerance);
          }
          constrainToSelection(layer.canvas, beforeCanvas, width);
          const entry = layer.canvas.endRecord("Fill", layer.id);
          useHistoryStore.getState().pushEntry(entry);
          markDirty(0, 0, canvas.width, canvas.height);
          scheduleRender();
          setDirty(true);
          document?.markDirty();
          break;
        }
        case "color-picker": {
          const { r, g, b, a } = getPixelColor(layer.canvas, x, y);
          const store = usePixelEditorStore.getState();
          if (button === 2) {
            store.setBackgroundColor(rgbaToHex(r, g, b, a));
          } else {
            store.setForegroundColor(rgbaToHex(r, g, b, a));
          }
          break;
        }
        case "curve": {
          bezierPointsRef.current = [...bezierPointsRef.current, [x, y]];
          break;
        }
        case "spray": {
          layer.canvas.beginRecord();
          const beforeCanvas = layer.canvas.clone();
          sprayPixels(layer.canvas, x, y, sprayRadius, sprayDensity, foregroundColor);
          constrainToSelection(layer.canvas, beforeCanvas, width);
          const entry = layer.canvas.endRecord("Spray", layer.id);
          useHistoryStore.getState().pushEntry(entry);
          markDirty(Math.max(0, x - sprayRadius), Math.max(0, y - sprayRadius), sprayRadius * 2, sprayRadius * 2);
          scheduleRender();
          setDirty(true);
          document?.markDirty();
          break;
        }
      }
    },
    [tool, foregroundColor, tolerance, sprayDensity, sprayRadius, brushSize, brushOpacity, brushShape, getActiveLayer, setDirty, canvas, document, markDirty, scheduleRender, drawPixelWithSymmetry],
  );

  const handlePointerMove = useCallback(
    (x: number, y: number) => {
      xRef.current = x;
      yRef.current = y;
      const last = lastPointRef.current;
      if (!last) return;
      const layer = getActiveLayer();
      if (!layer || !canvas) return;
      const width = canvas.width;
      const [cx, cy] = constrainPixelPerfect(x, y, last.x, last.y);

      switch (tool) {
        case "pencil": {
          const minX = Math.min(last.x, cx);
          const maxX = Math.max(last.x, cx);
          const minY = Math.min(last.y, cy);
          const maxY = Math.max(last.y, cy);
          const before = beforeStrokeRef.current ? layer.canvas.clone() : null;
          drawLineWithSymmetry(layer.canvas, last.x, last.y, cx, cy, foregroundColor);
          if (before) constrainToSelection(layer.canvas, before, width);
          lastPointRef.current = { x: cx, y: cy };
          markDirty(minX, minY, maxX - minX + 1, maxY - minY + 1);
          scheduleRender();
          break;
        }
        case "brush": {
          const minX = Math.min(last.x, cx);
          const maxX = Math.max(last.x, cx);
          const minY = Math.min(last.y, cy);
          const maxY = Math.max(last.y, cy);
          const before = beforeStrokeRef.current ? layer.canvas.clone() : null;
          const dx = cx - last.x;
          const dy = cy - last.y;
          const steps = Math.max(Math.abs(dx), Math.abs(dy));
          for (let i = 0; i <= steps; i++) {
            const t = steps > 0 ? i / steps : 1;
            const px = Math.round(last.x + dx * t);
            const py = Math.round(last.y + dy * t);
            drawBrushStamp(layer.canvas, px, py, brushSize, foregroundColor, brushShape, brushOpacity);
          }
          if (before) constrainToSelection(layer.canvas, before, width);
          lastPointRef.current = { x: cx, y: cy };
          markDirty(minX - brushSize, minY - brushSize, maxX - minX + brushSize * 2 + 1, maxY - minY + brushSize * 2 + 1);
          scheduleRender();
          break;
        }
        case "eraser": {
          const minX = Math.min(last.x, cx);
          const maxX = Math.max(last.x, cx);
          const minY = Math.min(last.y, cy);
          const maxY = Math.max(last.y, cy);
          const before = beforeStrokeRef.current ? layer.canvas.clone() : null;
          drawLineWithSymmetry(layer.canvas, last.x, last.y, cx, cy, "#00000000");
          if (before) constrainToSelection(layer.canvas, before, width);
          lastPointRef.current = { x, y };
          markDirty(minX, minY, maxX - minX + 1, maxY - minY + 1);
          scheduleRender();
          break;
        }
      }
    },
    [tool, foregroundColor, brushSize, brushOpacity, brushShape, getActiveLayer, canvas, markDirty, scheduleRender, constrainPixelPerfect, drawLineWithSymmetry],
  );

  const handlePointerUp = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const rects = dirtyRectsRef.current;
    dirtyRectsRef.current = [];
    if (rects.length > 0) {
      renderFnRef.current?.(rects);
    }

    const beforeStroke = beforeStrokeRef.current;
    const last = lastPointRef.current;
    if (!beforeStroke || !last || !canvas) {
      beforeStrokeRef.current = null;
      lastPointRef.current = null;
      xRef.current = -1;
      yRef.current = -1;
      return;
    }

    const layer = getActiveLayer();
    if (!layer) {
      beforeStrokeRef.current = null;
      lastPointRef.current = null;
      xRef.current = -1;
      yRef.current = -1;
      return;
    }

    const width = canvas.width;
    let cmdName = tool === "eraser" ? "Eraser" : tool === "brush" ? "Brush" : "Draw";

    switch (tool) {
      case "line": {
        if (last.x !== xRef.current || last.y !== yRef.current) {
          drawLine(layer.canvas, last.x, last.y, xRef.current, yRef.current, foregroundColor);
          const minX = Math.min(last.x, xRef.current);
          const maxX = Math.max(last.x, xRef.current);
          const minY = Math.min(last.y, yRef.current);
          const maxY = Math.max(last.y, yRef.current);
          markDirty(minX, minY, maxX - minX + 1, maxY - minY + 1);
        }
        constrainToSelection(layer.canvas, beforeStroke, width);
        cmdName = "Line";
        break;
      }
      case "rectangle":
        drawRectangle(layer.canvas, last.x, last.y, xRef.current, yRef.current, foregroundColor, false);
        constrainToSelection(layer.canvas, beforeStroke, width);
        cmdName = "Rectangle";
        break;
      case "filled-rectangle":
        drawRectangle(layer.canvas, last.x, last.y, xRef.current, yRef.current, foregroundColor, true);
        constrainToSelection(layer.canvas, beforeStroke, width);
        cmdName = "Filled Rectangle";
        break;
      case "circle":
        drawCircle(layer.canvas, last.x, last.y, Math.round(Math.hypot(xRef.current - last.x, yRef.current - last.y)), foregroundColor, false);
        constrainToSelection(layer.canvas, beforeStroke, width);
        cmdName = "Circle";
        break;
      case "filled-circle":
        drawCircle(layer.canvas, last.x, last.y, Math.round(Math.hypot(xRef.current - last.x, yRef.current - last.y)), foregroundColor, true);
        constrainToSelection(layer.canvas, beforeStroke, width);
        cmdName = "Filled Circle";
        break;
      case "ellipse":
        drawEllipse(layer.canvas, last.x, last.y, Math.abs(xRef.current - last.x), Math.abs(yRef.current - last.y), foregroundColor, false);
        constrainToSelection(layer.canvas, beforeStroke, width);
        cmdName = "Ellipse";
        break;
      case "filled-ellipse":
        drawEllipse(layer.canvas, last.x, last.y, Math.abs(xRef.current - last.x), Math.abs(yRef.current - last.y), foregroundColor, true);
        constrainToSelection(layer.canvas, beforeStroke, width);
        cmdName = "Filled Ellipse";
        break;
    }

    if (layer.canvas.isRecording()) {
      const entry = layer.canvas.endRecord(cmdName, layer.id);
      useHistoryStore.getState().pushEntry(entry);
    }

    setDirty(true);
    document?.markDirty();
    useLayerStore.getState().forceRender();

    beforeStrokeRef.current = null;
    lastPointRef.current = null;
    xRef.current = -1;
    yRef.current = -1;
  }, [getActiveLayer, tool, canvas, document, foregroundColor, setDirty, markDirty]);

  const finalizeCurve = useCallback(() => {
    const points = bezierPointsRef.current;
    if (points.length < 2) return;
    const layer = getActiveLayer();
    if (!layer || !canvas) return;
    const width = canvas.width;
    layer.canvas.beginRecord();
    const beforeCanvas = layer.canvas.clone();
    drawBezier(layer.canvas, points, foregroundColor);
    constrainToSelection(layer.canvas, beforeCanvas, width);
    const entry = layer.canvas.endRecord("Curve", layer.id);
    useHistoryStore.getState().pushEntry(entry);
    setDirty(true);
    document?.markDirty();
    useLayerStore.getState().forceRender();
    bezierPointsRef.current = [];
  }, [getActiveLayer, canvas, foregroundColor, setDirty, document]);

  const cancelCurve = useCallback(() => {
    bezierPointsRef.current = [];
  }, []);

  return { handlePointerDown, handlePointerMove, handlePointerUp, setRenderFn, markDirty, scheduleRender, finalizeCurve, cancelCurve, bezierPointsRef };
}

function getPixelColor(canvas: CanvasState, x: number, y: number): { r: number; g: number; b: number; a: number } {
  return uint32ToRgba(canvas.getPixel(x, y));
}
