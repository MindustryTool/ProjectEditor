import { create } from "zustand";

export type BrushShape = "square" | "circle" | "dither";

export type ToolType =
  | "pencil"
  | "eraser"
  | "fill-bucket"
  | "color-picker"
  | "line"
  | "rectangle"
  | "filled-rectangle"
  | "circle"
  | "filled-circle"
  | "ellipse"
  | "filled-ellipse"
  | "curve"
  | "spray"
  | "hand"
  | "move"
  | "select-rect"
  | "select-ellipse"
  | "magic-wand"
  | "color-select"
  | "lasso"
  | "polygon"
  | "scale"
  | "brush";

export interface PixelEditorState {
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

export interface PixelEditorActions {
  setTool: (tool: ToolType) => void;
  setForegroundColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  setBrushFlow: (flow: number) => void;
  setBrushHardness: (hardness: number) => void;
  setBrushShape: (shape: BrushShape) => void;
  setTolerance: (tolerance: number) => void;
  setSprayDensity: (density: number) => void;
  setSprayRadius: (radius: number) => void;
  setPixelPerfect: (on: boolean) => void;
  setSymmetry: (symmetry: "none" | "horizontal" | "vertical" | "radial") => void;
  setSymmetrySegments: (segments: number) => void;
  setGridVisible: (visible: boolean) => void;
  setPixelGridVisible: (visible: boolean) => void;
  setRulersVisible: (visible: boolean) => void;
  setGuidesVisible: (visible: boolean) => void;
  setLayerBoundsVisible: (visible: boolean) => void;
  setOnionSkinVisible: (visible: boolean) => void;
  setCheckerboardVisible: (visible: boolean) => void;
  toggleGrid: () => void;
  togglePixelGrid: () => void;
  toggleRulers: () => void;
  toggleGuides: () => void;
  toggleLayerBounds: () => void;
  toggleOnionSkin: () => void;
  toggleCheckerboard: () => void;
  setDirty: (dirty: boolean) => void;
  swapColors: () => void;
  resetColors: () => void;
  setShowNewCanvasDialog: (show: boolean) => void;
  setShowResizeDialog: (show: boolean) => void;
}

const defaultColors = {
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
};

export const usePixelEditorStore = create<PixelEditorState & PixelEditorActions>()((set) => ({
  tool: "pencil",
  brushSize: 1,
  brushOpacity: 1,
  brushFlow: 1,
  brushHardness: 1,
  brushShape: "circle",
  tolerance: 32,
  sprayDensity: 0.5,
  sprayRadius: 10,
  pixelPerfect: false,
  symmetry: "none",
  symmetrySegments: 4,
  gridVisible: false,
  pixelGridVisible: false,
  rulersVisible: false,
  guidesVisible: false,
  layerBoundsVisible: false,
  onionSkinVisible: false,
  checkerboardVisible: true,
  dirty: false,
  showNewCanvasDialog: false,
  showResizeDialog: false,

  ...defaultColors,

  setTool: (tool) => set({ tool }),
  setForegroundColor: (color) => set({ foregroundColor: color }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setBrushSize: (size) => set({ brushSize: Math.max(1, Math.min(100, size)) }),
  setBrushOpacity: (opacity) => set({ brushOpacity: Math.max(0, Math.min(1, opacity)) }),
  setBrushFlow: (flow) => set({ brushFlow: Math.max(0, Math.min(1, flow)) }),
  setBrushHardness: (hardness) => set({ brushHardness: Math.max(0, Math.min(1, hardness)) }),
  setBrushShape: (shape) => set({ brushShape: shape }),
  setTolerance: (tolerance) => set({ tolerance: Math.max(0, Math.min(255, tolerance)) }),
  setSprayDensity: (density) => set({ sprayDensity: Math.max(0, Math.min(1, density)) }),
  setSprayRadius: (radius) => set({ sprayRadius: Math.max(1, Math.min(100, radius)) }),
  setPixelPerfect: (on) => set({ pixelPerfect: on }),
  setSymmetry: (symmetry) => set({ symmetry }),
  setSymmetrySegments: (segments) => set({ symmetrySegments: Math.max(2, Math.min(32, segments)) }),
  setGridVisible: (visible: boolean) => set({ gridVisible: visible }),
  setPixelGridVisible: (visible: boolean) => set({ pixelGridVisible: visible }),
  setRulersVisible: (visible: boolean) => set({ rulersVisible: visible }),
  setGuidesVisible: (visible: boolean) => set({ guidesVisible: visible }),
  setLayerBoundsVisible: (visible: boolean) => set({ layerBoundsVisible: visible }),
  setOnionSkinVisible: (visible: boolean) => set({ onionSkinVisible: visible }),
  setCheckerboardVisible: (visible: boolean) => set({ checkerboardVisible: visible }),
  toggleGrid: () => set((s) => ({ gridVisible: !s.gridVisible })),
  togglePixelGrid: () => set((s) => ({ pixelGridVisible: !s.pixelGridVisible })),
  toggleRulers: () => set((s) => ({ rulersVisible: !s.rulersVisible })),
  toggleGuides: () => set((s) => ({ guidesVisible: !s.guidesVisible })),
  toggleLayerBounds: () => set((s) => ({ layerBoundsVisible: !s.layerBoundsVisible })),
  toggleOnionSkin: () => set((s) => ({ onionSkinVisible: !s.onionSkinVisible })),
  toggleCheckerboard: () => set((s) => ({ checkerboardVisible: !s.checkerboardVisible })),
  setDirty: (dirty) => set({ dirty }),
  swapColors: () => set((s) => ({ foregroundColor: s.backgroundColor, backgroundColor: s.foregroundColor })),
  resetColors: () => set(defaultColors),
  setShowNewCanvasDialog: (show) => set({ showNewCanvasDialog: show }),
  setShowResizeDialog: (show) => set({ showResizeDialog: show }),
}));
