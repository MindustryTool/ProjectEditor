import { useCallback, useRef } from "react";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";
import { useHistoryStore } from "../store/history-store";
import {
  createRectMask,
  createEllipseMask,
  createLassoMask,
  createPolygonMask,
  magicWandMask,
  colorSelectMask,
  combineMasks,
  getMaskBounds,
  deleteSelectedPixels,
  fillSelectedPixels,
  extractSelectionContent,
  pasteSelectionContent,
  isSelectionActive,
  expandMask,
  shrinkMask,
  featherMask,
  invertMask,
} from "../utils/selection-tools";
import {
  scaleContent,
  rotate90CW,
  rotate90CCW,
  flipHorizontal,
  flipVertical,
  applyScaledContentToLayer,
  getTransformHandles,
} from "../utils/transform-tools";

export function useSelectionTools() {
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);
  const selectionContentRef = useRef<Uint32Array | null>(null);
  const selectionContentWidthRef = useRef(0);
  const selectionContentHeightRef = useRef(0);
  const lassoPointsRef = useRef<[number, number][]>([]);

  const getCanvas = () => useLayerStore.getState().canvas;
  const getDocument = () => useLayerStore.getState().document;
  const getStore = () => usePixelEditorStore.getState();
  const setDirty = usePixelEditorStore((s) => s.setDirty);

  const applySelectionToLayer = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas) return;
    if (!canvas.selectionMask) return;
    const layer = canvas.currentLayer;
    if (layer.locked) return;

    layer.canvas.beginRecord();

    const origData = canvas.selectionOriginalData;
    if (origData && selectionContentRef.current && canvas.selectionBounds) {
      for (let i = 0; i < origData.length; i++) {
        layer.canvas.setPixelAtIndex(i, origData[i]!);
      }
      pasteSelectionContent(
        layer.canvas,
        selectionContentRef.current,
        selectionContentWidthRef.current,
        canvas.selectionBounds.x,
        canvas.selectionBounds.y,
      );
    }

    const entry = layer.canvas.endRecord("Apply Selection", layer.id);
    useHistoryStore.getState().pushEntry(entry);

    setDirty(true);
    getDocument()?.markDirty();
    useLayerStore.getState().forceRender();
  }, [setDirty]);

  const handleSelectionDown = useCallback((x: number, y: number, _button: number) => {
    const tool = getStore().tool;
    const canvas = getCanvas();
    if (!canvas) return;

    if (tool === "select-rect" || tool === "select-ellipse") {
      selectionStartRef.current = { x, y };
      return;
    }

    if (tool === "lasso") {
      lassoPointsRef.current = [[x, y]];
      selectionStartRef.current = { x, y };
      return;
    }

    if (tool === "polygon") {
      const points = lassoPointsRef.current;
      if (points.length > 0) {
        const first = points[0]!;
        if (Math.abs(x - first[0]) <= 2 && Math.abs(y - first[1]) <= 2) {
          const mask = createPolygonMask(canvas.width, canvas.height, points);
          finalizeSelection(mask);
          lassoPointsRef.current = [];
          return;
        }
      }
      lassoPointsRef.current = [...lassoPointsRef.current, [x, y] as [number, number]];
      selectionStartRef.current = { x, y };
      return;
    }

    if (tool === "magic-wand") {
      const tolerance = getStore().tolerance;
      const layer = canvas.currentLayer;
      const mask = magicWandMask(layer.canvas, x, y, tolerance);
      const existing = canvas.selectionMask;
      const mode = canvas.selectionMode;
      const combined = combineMasks(existing, mask, mode);
      canvas.selectionMask = combined;
      canvas.selectionBounds = getMaskBounds(combined, canvas.width, canvas.height);
      useLayerStore.getState().forceRender();
      setDirty(true);
    }

    if (tool === "color-select") {
      const tolerance = getStore().tolerance;
      const layer = canvas.currentLayer;
      const mask = colorSelectMask(layer.canvas, x, y, tolerance);
      const existing = canvas.selectionMask;
      const mode = canvas.selectionMode;
      const combined = combineMasks(existing, mask, mode);
      canvas.selectionMask = combined;
      canvas.selectionBounds = getMaskBounds(combined, canvas.width, canvas.height);
      useLayerStore.getState().forceRender();
      setDirty(true);
    }

    if (tool === "move" && isSelectionActive(canvas.selectionMask)) {
      selectionStartRef.current = { x, y };
      const selMask = canvas.selectionMask;
      if (canvas.selectionBounds && selMask) {
        const layer = canvas.currentLayer;
        const content = extractSelectionContent(layer.canvas, selMask);
        selectionContentRef.current = content.data;
        selectionContentWidthRef.current = content.width;
        selectionContentHeightRef.current = content.height;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDirty]);

  const handleSelectionMove = useCallback((x: number, y: number) => {
    const tool = getStore().tool;
    const start = selectionStartRef.current;
    if (!start) return;
    const canvas = getCanvas();
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const updateMask = (mask: Uint8Array) => {
      const mode = canvas.selectionMode;
      const existing = canvas.selectionMask;
      const combined = mode === "new" || !existing ? mask : combineMasks(existing, mask, mode);
      canvas.selectionMask = combined;
      canvas.selectionBounds = getMaskBounds(combined, width, height);
    };

    if (tool === "lasso") {
      lassoPointsRef.current = [...lassoPointsRef.current, [x, y] as [number, number]];
      const mask = createLassoMask(width, height, lassoPointsRef.current);
      updateMask(mask);
      useLayerStore.getState().forceRender();
      return;
    }

    if (tool === "select-rect") {
      const mask = createRectMask(width, height, start.x, start.y, x, y);
      updateMask(mask);
      useLayerStore.getState().forceRender();
      return;
    }

    if (tool === "select-ellipse") {
      const cx = start.x;
      const cy = start.y;
      const rx = x - cx;
      const ry = y - cy;
      const mask = createEllipseMask(width, height, cx, cy, rx, ry);
      updateMask(mask);
      useLayerStore.getState().forceRender();
      return;
    }

    if (tool === "move" && selectionContentRef.current) {
      const bounds = canvas.selectionBounds;
      if (!bounds) return;
      const dx = x - start.x;
      const dy = y - start.y;
      const layer = canvas.currentLayer;
      if (layer.locked) return;
      if (canvas.selectionOriginalData) {
        layer.canvas.pixels.set(canvas.selectionOriginalData);
      }
      const newBounds = {
        x: Math.max(0, Math.min(canvas.width - bounds.w, bounds.x + dx)),
        y: Math.max(0, Math.min(canvas.height - bounds.h, bounds.y + dy)),
        w: bounds.w,
        h: bounds.h,
      };
      canvas.selectionMoveOffset = { x: dx, y: dy };
      pasteSelectionContent(layer.canvas, selectionContentRef.current, selectionContentWidthRef.current, newBounds.x, newBounds.y);
      useLayerStore.getState().forceRender();
    }
  }, []);

  const handleSelectionUp = useCallback(() => {
    const tool = getStore().tool;
    const canvas = getCanvas();
    selectionStartRef.current = null;

    if (tool === "lasso") {
      if (lassoPointsRef.current.length > 2 && canvas) {
        const mask = createPolygonMask(canvas.width, canvas.height, lassoPointsRef.current);
        finalizeSelection(mask);
      }
      lassoPointsRef.current = [];
    }

    if (tool === "select-rect" || tool === "select-ellipse") {
      if (canvas) {
        canvas.selectionMoveOffset = null;
        useLayerStore.getState().forceRender();
      }
    }

    if (tool === "move") {
      if (canvas) {
        applySelectionToLayer();
        canvas.selectionMoveOffset = null;
        canvas.selectionOriginalData = null;
        useLayerStore.getState().forceRender();
      }
      selectionContentRef.current = null;
    }

    if (tool === "polygon") {
      selectionStartRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applySelectionToLayer]);

  const finalizeSelection = useCallback((mask: Uint8Array) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const mode = canvas.selectionMode;
    const existing = canvas.selectionMask;
    const combined = combineMasks(existing, mask, mode);
    canvas.selectionMask = combined;
    canvas.selectionBounds = getMaskBounds(combined, canvas.width, canvas.height);
    useLayerStore.getState().forceRender();
    setDirty(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   const deleteSelection = useCallback(() => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.selectionMask || !isSelectionActive(canvas.selectionMask)) return;
     const layer = canvas.currentLayer;
     if (layer.locked) return;

     layer.canvas.beginRecord();
     deleteSelectedPixels(layer.canvas, canvas.selectionMask);
     const entry = layer.canvas.endRecord("Delete Selection", layer.id);
     useHistoryStore.getState().pushEntry(entry);

     setDirty(true);
     getDocument()?.markDirty();
     useLayerStore.getState().forceRender();
   }, [setDirty]);

   const fillSelection = useCallback((color: string) => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.selectionMask || !isSelectionActive(canvas.selectionMask)) return;
     const layer = canvas.currentLayer;
     if (layer.locked) return;

     layer.canvas.beginRecord();
     fillSelectedPixels(layer.canvas, canvas.selectionMask, color);
     const entry = layer.canvas.endRecord("Fill Selection", layer.id);
     useHistoryStore.getState().pushEntry(entry);

     setDirty(true);
     getDocument()?.markDirty();
     useLayerStore.getState().forceRender();
   }, [setDirty]);

   const expandSelection = useCallback((pixels: number) => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.selectionMask) return;
     const mask = expandMask(canvas.selectionMask, canvas.width, canvas.height, pixels);
     canvas.selectionMask = mask;
     canvas.selectionBounds = getMaskBounds(mask, canvas.width, canvas.height);
     useLayerStore.getState().forceRender();
   }, []);

   const shrinkSelection = useCallback((pixels: number) => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.selectionMask) return;
     const mask = shrinkMask(canvas.selectionMask, canvas.width, canvas.height, pixels);
     canvas.selectionMask = mask;
     canvas.selectionBounds = getMaskBounds(mask, canvas.width, canvas.height);
     useLayerStore.getState().forceRender();
   }, []);

   const featherSelection = useCallback((radius: number) => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.selectionMask) return;
     const mask = featherMask(canvas.selectionMask, canvas.width, canvas.height, radius);
     canvas.selectionMask = mask;
     canvas.selectionBounds = getMaskBounds(mask, canvas.width, canvas.height);
     useLayerStore.getState().forceRender();
   }, []);

   const invertSelection = useCallback(() => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.selectionMask) return;
     const mask = invertMask(canvas.selectionMask);
     canvas.selectionMask = mask;
     canvas.selectionBounds = getMaskBounds(mask, canvas.width, canvas.height);
     useLayerStore.getState().forceRender();
   }, []);

   const selectAll = useCallback(() => {
     const canvas = getCanvas();
     if (!canvas) return;
     const mask = createRectMask(canvas.width, canvas.height, 0, 0, canvas.width - 1, canvas.height - 1);
     const existing = canvas.selectionMask;
     const mode = canvas.selectionMode;
     const combined = combineMasks(existing, mask, mode);
     canvas.selectionMask = combined;
     canvas.selectionBounds = getMaskBounds(combined, canvas.width, canvas.height);
     useLayerStore.getState().forceRender();
   }, []);

   const deselect = useCallback(() => {
     const canvas = getCanvas();
     if (!canvas) return;
     canvas.clearSelection();
     useLayerStore.getState().forceRender();
   }, []);

   const cutSelection = useCallback(() => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.selectionMask || !isSelectionActive(canvas.selectionMask)) return;
     const layer = canvas.currentLayer;
     if (layer.locked) return;

     const content = extractSelectionContent(layer.canvas, canvas.selectionMask);
     canvas.setClipboard(content.data, content.width, content.height);

     layer.canvas.beginRecord();
     deleteSelectedPixels(layer.canvas, canvas.selectionMask);
     const entry = layer.canvas.endRecord("Cut", layer.id);
     useHistoryStore.getState().pushEntry(entry);

     setDirty(true);
     getDocument()?.markDirty();
     useLayerStore.getState().forceRender();
   }, [setDirty]);

   const copySelection = useCallback(() => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.selectionMask || !isSelectionActive(canvas.selectionMask)) return;
     const layer = canvas.currentLayer;
     const content = extractSelectionContent(layer.canvas, canvas.selectionMask);
     canvas.setClipboard(content.data, content.width, content.height);
   }, []);

   const pasteSelection = useCallback((inPlace: boolean = false) => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.clipboardContent) return;
     const layer = canvas.currentLayer;
     if (layer.locked) return;
     const bounds = inPlace && canvas.selectionBounds ? canvas.selectionBounds : null;
     const destX = bounds ? bounds.x : Math.floor((canvas.width - canvas.clipboardWidth) / 2);
     const destY = bounds ? bounds.y : Math.floor((canvas.height - canvas.clipboardHeight) / 2);

     layer.canvas.beginRecord();
     pasteSelectionContent(layer.canvas, canvas.clipboardContent, canvas.clipboardWidth, destX, destY);
     const entry = layer.canvas.endRecord("Paste", layer.id);
     useHistoryStore.getState().pushEntry(entry);

     setDirty(true);
     getDocument()?.markDirty();
     useLayerStore.getState().forceRender();
   }, [setDirty]);

   const pasteAsNewLayer = useCallback(() => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.clipboardContent) return;
     const newLayer = canvas.addLayer("Pasted");
     newLayer.canvas.clear();
     pasteSelectionContent(
       newLayer.canvas,
       canvas.clipboardContent,
       canvas.clipboardWidth,
       Math.floor((canvas.width - canvas.clipboardWidth) / 2),
       Math.floor((canvas.height - canvas.clipboardHeight) / 2),
     );
     useLayerStore.getState().setCanvas(canvas);
     getDocument()?.markDirty();
     setDirty(true);
     useLayerStore.getState().forceRender();
   }, [setDirty]);

  const scaleHandleRef = useRef<{ type: "corner" | "edge"; index: number; startBounds: { x: number; y: number; w: number; h: number }; startPointer: { x: number; y: number } } | null>(null);

  const getHandleAt = useCallback((x: number, y: number, bounds: { x: number; y: number; w: number; h: number }): { type: "corner" | "edge"; index: number } | null => {
    const { corners, edges } = getTransformHandles(bounds);
    const hitRadius = 5;
    for (let i = 0; i < corners.length; i++) {
      const [hx, hy] = corners[i]!;
      if (Math.abs(x - hx) <= hitRadius && Math.abs(y - hy) <= hitRadius) {
        return { type: "corner", index: i };
      }
    }
    for (let i = 0; i < edges.length; i++) {
      const [hx, hy] = edges[i]!;
      if (Math.abs(x - hx) <= hitRadius && Math.abs(y - hy) <= hitRadius) {
        return { type: "edge", index: i };
      }
    }
    return null;
  }, []);

   const handleScaleDown = useCallback((x: number, y: number) => {
     const canvas = getCanvas();
     if (!canvas) return;
     const bounds = canvas.selectionBounds;
     if (!bounds) return;
     const handle = getHandleAt(x, y, bounds);
     if (!handle) return;
     scaleHandleRef.current = { ...handle, startBounds: { ...bounds }, startPointer: { x, y } };
     canvas.isTransforming = true;
     useLayerStore.getState().forceRender();
   }, [getHandleAt]);

   const handleScaleMove = useCallback((x: number, y: number) => {
     const handleInfo = scaleHandleRef.current;
     if (!handleInfo) return;
     const canvas = getCanvas();
     if (!canvas) return;
     const b = handleInfo.startBounds;
     const dx = x - handleInfo.startPointer.x;
     const dy = y - handleInfo.startPointer.y;

     let newW = b.w, newH = b.h, newX = b.x, newY = b.y;
     const isShift = false;

     switch (handleInfo.index) {
       case 0:
         newX = Math.max(0, Math.min(b.x + b.w - 1, b.x + dx));
         newY = Math.max(0, Math.min(b.y + b.h - 1, b.y + dy));
         newW = b.x + b.w - newX;
         newH = b.y + b.h - newY;
         break;
       case 1:
         newX = b.x;
         newY = Math.max(0, Math.min(b.y + b.h - 1, b.y + dy));
         newW = Math.max(1, Math.min(canvas.width - newX, b.w + dx));
         newH = b.y + b.h - newY;
         break;
       case 2:
         newX = b.x;
         newY = b.y;
         newW = Math.max(1, Math.min(canvas.width - newX, b.w + dx));
         newH = Math.max(1, Math.min(canvas.height - newY, b.h + dy));
         break;
       case 3:
         newX = Math.max(0, Math.min(b.x + b.w - 1, b.x + dx));
         newY = b.y;
         newW = b.x + b.w - newX;
         newH = Math.max(1, Math.min(canvas.height - newY, b.h + dy));
         break;
     }

     if (handleInfo.type === "edge") {
       if (handleInfo.index === 0 || handleInfo.index === 2) {
         newH = Math.max(1, Math.round(b.h + dy));
         if (handleInfo.index === 2) newY = b.y;
         else newY = b.y + b.h - newH;
       } else {
         newW = Math.max(1, Math.round(b.w + dx));
         if (handleInfo.index === 1) newX = b.x;
         else newX = b.x + b.w - newW;
       }
     }

     if (!isShift) {
       const scaleRatio = newW / b.w;
       const snapW = Math.max(1, Math.round(scaleRatio) * b.w);
       const snapH = Math.max(1, Math.round(scaleRatio) * b.h);
       if (snapW <= canvas.width && snapH <= canvas.height) {
         newW = snapW;
         newH = snapH;
         if (handleInfo.index === 0 || handleInfo.index === 3) newX = b.x + b.w - newW;
         if (handleInfo.index === 0 || handleInfo.index === 1) newY = b.y + b.h - newH;
       }
     }

     newW = Math.max(1, newW);
     newH = Math.max(1, newH);

     canvas.selectionBounds = { x: newX, y: newY, w: newW, h: newH };
     useLayerStore.getState().forceRender();
   }, []);

   const handleScaleUp = useCallback(() => {
     const handleInfo = scaleHandleRef.current;
     scaleHandleRef.current = null;
     const canvas = getCanvas();
     if (!canvas) return;
     canvas.isTransforming = false;
     if (!handleInfo) return;
     const bounds = canvas.selectionBounds;
     if (!bounds) return;

     const origBounds = handleInfo.startBounds;
     const scaleX = bounds.w / origBounds.w;
     const scaleY = bounds.h / origBounds.h;

     const mask = canvas.selectionMask;
     if (!mask) return;
     const layer = canvas.currentLayer;
     if (layer.locked) return;

     const content = extractSelectionContent(layer.canvas, mask);
     const scaled = scaleContent(content.data, content.width, content.height, scaleX, scaleY);

     layer.canvas.beginRecord();
     deleteSelectedPixels(layer.canvas, mask);
     applyScaledContentToLayer(layer.canvas.pixels, canvas.width, scaled.data, scaled.width, scaled.height, bounds.x, bounds.y);

     const newMask = createRectMask(canvas.width, canvas.height, bounds.x, bounds.y, bounds.x + scaled.width - 1, bounds.y + scaled.height - 1);
     canvas.selectionMask = newMask;
     canvas.selectionBounds = getMaskBounds(newMask, canvas.width, canvas.height);
     const entry = layer.canvas.endRecord("Scale", layer.id);
     useHistoryStore.getState().pushEntry(entry);

     setDirty(true);
     getDocument()?.markDirty();
     useLayerStore.getState().forceRender();
   }, [setDirty]);

   const applyRotate = useCallback((angle: number) => {
     const canvas = getCanvas();
     if (!canvas) return;
     const mask = canvas.selectionMask;
     if (!mask || !canvas.selectionBounds) return;
     const layer = canvas.currentLayer;
     if (layer.locked) return;

     const content = extractSelectionContent(layer.canvas, mask);
     let rotated: { data: Uint32Array; width: number; height: number };
     switch (angle) {
       case 90: rotated = rotate90CW(content.data, content.width, content.height); break;
       case -90: rotated = rotate90CCW(content.data, content.width, content.height); break;
       case 180:
         rotated = scaleContent(content.data, content.width, content.height, -1, -1);
         break;
       default: return;
     }

     const bounds = canvas.selectionBounds;
     layer.canvas.beginRecord();
     deleteSelectedPixels(layer.canvas, mask);
     const cx = bounds.x + Math.floor((bounds.w - rotated.width) / 2);
     const cy = bounds.y + Math.floor((bounds.h - rotated.height) / 2);
     applyScaledContentToLayer(layer.canvas.pixels, canvas.width, rotated.data, rotated.width, rotated.height, cx, cy);

     const newMask = createRectMask(canvas.width, canvas.height, cx, cy, cx + rotated.width - 1, cy + rotated.height - 1);
     canvas.selectionMask = newMask;
     canvas.selectionBounds = getMaskBounds(newMask, canvas.width, canvas.height);
     const entry = layer.canvas.endRecord(`Rotate ${angle}°`, layer.id);
     useHistoryStore.getState().pushEntry(entry);

     setDirty(true);
     getDocument()?.markDirty();
     useLayerStore.getState().forceRender();
   }, [setDirty]);

   const applyFlip = useCallback((direction: "horizontal" | "vertical") => {
     const canvas = getCanvas();
     if (!canvas) return;
     const mask = canvas.selectionMask;
     if (!mask || !canvas.selectionBounds) return;
     const layer = canvas.currentLayer;
     if (layer.locked) return;

     const bounds = canvas.selectionBounds;
     const content = extractSelectionContent(layer.canvas, mask);
     const flipped: Uint32Array = direction === "horizontal"
       ? flipHorizontal(content.data, content.width)
       : flipVertical(content.data, content.width);

     layer.canvas.beginRecord();
     deleteSelectedPixels(layer.canvas, mask);
     pasteSelectionContent(layer.canvas, flipped, content.width, bounds.x, bounds.y);
     const entry = layer.canvas.endRecord(`Flip ${direction}`, layer.id);
     useHistoryStore.getState().pushEntry(entry);

     setDirty(true);
     getDocument()?.markDirty();
     useLayerStore.getState().forceRender();
   }, [setDirty]);

   const duplicateSelection = useCallback(() => {
     const canvas = getCanvas();
     if (!canvas) return;
     if (!canvas.selectionMask || !isSelectionActive(canvas.selectionMask)) return;
     const layer = canvas.currentLayer;
     if (layer.locked) return;
     const content = extractSelectionContent(layer.canvas, canvas.selectionMask);
     const bounds = canvas.selectionBounds;
     if (!bounds) return;
     const dx = bounds.w + 2;
     const dy = bounds.h + 2;
     const destX = Math.min(bounds.x + dx, canvas.width - content.width);
     const destY = Math.min(bounds.y + dy, canvas.height - content.height);

     layer.canvas.beginRecord();
     pasteSelectionContent(layer.canvas, content.data, content.width, destX, destY);
     const entry = layer.canvas.endRecord("Duplicate Selection", layer.id);
     useHistoryStore.getState().pushEntry(entry);

     setDirty(true);
     getDocument()?.markDirty();
     useLayerStore.getState().forceRender();
   }, [setDirty]);

  return {
    handleSelectionDown,
    handleSelectionMove,
    handleSelectionUp,
    deleteSelection,
    fillSelection,
    expandSelection,
    shrinkSelection,
    featherSelection,
    invertSelection,
    selectAll,
    deselect,
    cutSelection,
    copySelection,
    pasteSelection,
    pasteAsNewLayer,
    duplicateSelection,
    handleScaleDown,
    handleScaleMove,
    handleScaleUp,
    applyRotate,
    applyFlip,
    getHandleAt,
  };
}
