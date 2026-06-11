import { useCallback, useRef } from "react";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";
import { useHistoryStore, type HistoryCommand } from "../store/history-store";
import { drawPixel, drawLine, drawCircle, drawEllipse, drawRectangle, floodFill, replaceColor, sprayPixels } from "../utils/drawing-tools";
import { type Layer } from "../utils/pixel-canvas";

interface DirtyRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function useDrawingTools() {
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeSnapshotRef = useRef<Uint8ClampedArray | null>(null);
  const dirtyRectsRef = useRef<DirtyRect[]>([]);
  const rafRef = useRef<number | null>(null);
  const renderFnRef = useRef<((rects: DirtyRect[]) => void) | null>(null);
  const xRef = useRef(-1);
  const yRef = useRef(-1);
  const tool = usePixelEditorStore((s) => s.tool);
  const foregroundColor = usePixelEditorStore((s) => s.foregroundColor);
  const tolerance = usePixelEditorStore((s) => s.tolerance);
  const sprayDensity = usePixelEditorStore((s) => s.sprayDensity);
  const sprayRadius = usePixelEditorStore((s) => s.sprayRadius);
  const setDirty = usePixelEditorStore((s) => s.setDirty);
  const canvas = useLayerStore((s) => s.canvas);
  const document = useLayerStore((s) => s.document);
  const pushCommand = useHistoryStore((s) => s.pushCommand);
  const pushSnapshot = useHistoryStore((s) => s.pushSnapshot);
  const forceRender = useLayerStore((s) => s.forceRender);

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

  const getActiveLayer = useCallback((): Layer | null => {
    if (!canvas) return null;
    const layer = canvas.currentLayer;
    if (layer.locked) return null;
    return layer;
  }, [canvas]);

  const handlePointerDown = useCallback(
    (x: number, y: number, button: number) => {
      xRef.current = x;
      yRef.current = y;
      lastPointRef.current = { x, y };
      const layer = getActiveLayer();
      if (!layer || !canvas) return;
      const width = canvas.width;

      switch (tool) {
        case "pencil":
        case "eraser":
          strokeSnapshotRef.current = new Uint8ClampedArray(layer.data);
          drawPixel(layer, x, y, tool === "eraser" ? "#00000000" : foregroundColor, width);
          markDirty(x, y);
          scheduleRender();
          setDirty(true);
          document?.markDirty();
          break;
        case "line":
        case "rectangle":
        case "filled-rectangle":
        case "circle":
        case "filled-circle":
        case "ellipse":
        case "filled-ellipse":
          strokeSnapshotRef.current = new Uint8ClampedArray(layer.data);
          break;
        case "fill-bucket": {
          const prevData = new Uint8ClampedArray(layer.data);
          if (button === 2) {
            replaceColor(layer.data, width, x, y, foregroundColor, tolerance);
          } else {
            floodFill(layer.data, width, x, y, foregroundColor, tolerance);
          }
          const cmd: HistoryCommand = {
            name: "Fill",
            do: () => {},
            undo: () => { layer.data.set(prevData); forceRender(); },
          };
          pushCommand(cmd);
          if (canvas) pushSnapshot("Fill", JSON.stringify(canvas.serialize()));
          markDirty(0, 0, canvas.width, canvas.height);
          scheduleRender();
          setDirty(true);
          document?.markDirty();
          break;
        }
        case "color-picker": {
          const [r, g, b, a] = getPixelColor(layer.data, width, x, y);
          const store = usePixelEditorStore.getState();
          if (button === 2) {
            store.setBackgroundColor(rgbaToHex(r, g, b, a));
          } else {
            store.setForegroundColor(rgbaToHex(r, g, b, a));
          }
          break;
        }
        case "spray": {
          const prevData = new Uint8ClampedArray(layer.data);
          sprayPixels(layer.data, width, x, y, sprayRadius, sprayDensity, foregroundColor);
          const cmd: HistoryCommand = {
            name: "Spray",
            do: () => {},
            undo: () => { layer.data.set(prevData); forceRender(); },
          };
          pushCommand(cmd);
          if (canvas) pushSnapshot("Spray", JSON.stringify(canvas.serialize()));
          markDirty(Math.max(0, x - sprayRadius), Math.max(0, y - sprayRadius), sprayRadius * 2, sprayRadius * 2);
          scheduleRender();
          setDirty(true);
          document?.markDirty();
          break;
        }
      }
    },
    [tool, foregroundColor, tolerance, sprayDensity, sprayRadius, getActiveLayer, pushCommand, setDirty, canvas, document, markDirty, scheduleRender, forceRender],
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

      switch (tool) {
        case "pencil": {
          const minX = Math.min(last.x, x);
          const maxX = Math.max(last.x, x);
          const minY = Math.min(last.y, y);
          const maxY = Math.max(last.y, y);
          drawLine(layer.data, width, last.x, last.y, x, y, foregroundColor);
          lastPointRef.current = { x, y };
          markDirty(minX, minY, maxX - minX + 1, maxY - minY + 1);
          scheduleRender();
          break;
        }
        case "eraser": {
          const minX = Math.min(last.x, x);
          const maxX = Math.max(last.x, x);
          const minY = Math.min(last.y, y);
          const maxY = Math.max(last.y, y);
          drawLine(layer.data, width, last.x, last.y, x, y, "#00000000");
          lastPointRef.current = { x, y };
          markDirty(minX, minY, maxX - minX + 1, maxY - minY + 1);
          scheduleRender();
          break;
        }
      }
    },
    [tool, foregroundColor, getActiveLayer, canvas, markDirty, scheduleRender],
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
    const snapshot = strokeSnapshotRef.current;
    const last = lastPointRef.current;
    if (snapshot && last && canvas) {
      const layer = getActiveLayer();
      if (layer) {
        const width = canvas.width;
        let cmdName = tool === "eraser" ? "Eraser" : "Draw";
        switch (tool) {
          case "line": {
            if (last.x !== xRef.current || last.y !== yRef.current) {
              drawLine(layer.data, width, last.x, last.y, xRef.current, yRef.current, foregroundColor);
              const minX = Math.min(last.x, xRef.current);
              const maxX = Math.max(last.x, xRef.current);
              const minY = Math.min(last.y, yRef.current);
              const maxY = Math.max(last.y, yRef.current);
              markDirty(minX, minY, maxX - minX + 1, maxY - minY + 1);
            }
            cmdName = "Line";
            break;
          }
          case "rectangle":
            drawRectangle(layer.data, width, last.x, last.y, xRef.current, yRef.current, foregroundColor, false);
            cmdName = "Rectangle";
            break;
          case "filled-rectangle":
            drawRectangle(layer.data, width, last.x, last.y, xRef.current, yRef.current, foregroundColor, true);
            cmdName = "Filled Rectangle";
            break;
          case "circle":
            drawCircle(layer.data, width, last.x, last.y, Math.round(Math.hypot(xRef.current - last.x, yRef.current - last.y)), foregroundColor, false);
            cmdName = "Circle";
            break;
          case "filled-circle":
            drawCircle(layer.data, width, last.x, last.y, Math.round(Math.hypot(xRef.current - last.x, yRef.current - last.y)), foregroundColor, true);
            cmdName = "Filled Circle";
            break;
          case "ellipse":
            drawEllipse(layer.data, width, last.x, last.y, Math.abs(xRef.current - last.x), Math.abs(yRef.current - last.y), foregroundColor, false);
            cmdName = "Ellipse";
            break;
          case "filled-ellipse":
            drawEllipse(layer.data, width, last.x, last.y, Math.abs(xRef.current - last.x), Math.abs(yRef.current - last.y), foregroundColor, true);
            cmdName = "Filled Ellipse";
            break;
        }
        const cmd: HistoryCommand = {
          name: cmdName,
          do: () => {},
          undo: () => { layer.data.set(snapshot); forceRender(); },
        };
        pushCommand(cmd);
        pushSnapshot(cmdName, JSON.stringify(canvas.serialize()));
        setDirty(true);
        document?.markDirty();
        document?.createVersionSnapshot(cmdName);
        forceRender();
      }
    }
    strokeSnapshotRef.current = null;
    lastPointRef.current = null;
    xRef.current = -1;
    yRef.current = -1;
  }, [getActiveLayer, pushCommand, tool, canvas, document, foregroundColor, setDirty, forceRender, markDirty]);

  return { handlePointerDown, handlePointerMove, handlePointerUp, setRenderFn, markDirty, scheduleRender };
}

function getPixelColor(data: Uint8ClampedArray, width: number, x: number, y: number): [number, number, number, number] {
  if (x < 0 || x >= width) return [0, 0, 0, 0];
  const height = data.length / (width * 4);
  if (y < 0 || y >= height) return [0, 0, 0, 0];
  const i = (y * width + x) * 4;
  return [data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!];
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  return `#${[r, g, b, a].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
