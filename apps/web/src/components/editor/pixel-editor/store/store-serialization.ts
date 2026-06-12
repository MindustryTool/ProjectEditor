import type { SerializedCanvas, SerializedDocument } from "../utils/pixel-canvas";
import type { ToolType, BrushShape, PixelEditorState } from "./pixel-editor-store";
import type { SerializedHistoryStore } from "./history-store";

export interface SerializedPixelEditorState {
  tool: ToolType;
  foregroundColor: string;
  backgroundColor: string;
  brushSize: number;
  brushOpacity: number;
  brushFlow: number;
  brushHardness: number;
  brushShape: BrushShape;
  tolerance: number;
  sprayDensity: number;
  sprayRadius: number;
  pixelPerfect: boolean;
  symmetry: "none" | "horizontal" | "vertical" | "radial";
  symmetrySegments: number;
  gridVisible: boolean;
  pixelGridVisible: boolean;
  rulersVisible: boolean;
  guidesVisible: boolean;
  layerBoundsVisible: boolean;
  onionSkinVisible: boolean;
  checkerboardVisible: boolean;
  dirty: boolean;
  showNewCanvasDialog: boolean;
  showResizeDialog: boolean;
}

export interface SerializedLayerStore {
  canvas: SerializedCanvas | null;
  document: SerializedDocument | null;
}

export interface SerializedStores {
  editor: SerializedPixelEditorState;
  layers: SerializedLayerStore;
  history: SerializedHistoryStore;
}

export function serializeUint8Array(arr: Uint8Array | Uint8ClampedArray | null): number[] | null {
  if (!arr) return null;
  return Array.from(arr);
}

export function deserializeUint8Array(arr: number[] | null): Uint8Array | null {
  if (!arr) return null;
  return new Uint8Array(arr);
}

export function deserializeUint8ClampedArray(arr: number[] | null): Uint8ClampedArray | null {
  if (!arr) return null;
  return new Uint8ClampedArray(arr);
}

export function serializeUint32Array(arr: Uint32Array | Uint8ClampedArray | null): number[] | null {
  if (!arr) return null;
  return Array.from(arr);
}

export function deserializeUint32Array(arr: number[] | null): Uint32Array | null {
  if (!arr) return null;
  return new Uint32Array(arr);
}

export function serializeEditorState(state: PixelEditorState): SerializedPixelEditorState {
  const { tool, foregroundColor, backgroundColor, brushSize, brushOpacity, brushFlow, brushHardness, brushShape, tolerance, sprayDensity, sprayRadius, pixelPerfect, symmetry, symmetrySegments, gridVisible, pixelGridVisible, rulersVisible, guidesVisible, layerBoundsVisible, onionSkinVisible, checkerboardVisible, dirty, showNewCanvasDialog, showResizeDialog } = state;
  return {
    tool,
    foregroundColor,
    backgroundColor,
    brushSize,
    brushOpacity,
    brushFlow,
    brushHardness,
    brushShape,
    tolerance,
    sprayDensity,
    sprayRadius,
    pixelPerfect,
    symmetry,
    symmetrySegments,
    gridVisible,
    pixelGridVisible,
    rulersVisible,
    guidesVisible,
    layerBoundsVisible,
    onionSkinVisible,
    checkerboardVisible,
    dirty,
    showNewCanvasDialog,
    showResizeDialog,
  };
}
