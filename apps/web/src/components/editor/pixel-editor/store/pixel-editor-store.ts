import { create } from "zustand";

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
  | "brush";

export interface PixelEditorState {
  width: number;
  height: number;
  tool: ToolType;
  foregroundColor: string;
  backgroundColor: string;
  brushSize: number;
  brushOpacity: number;
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
  palette: string[];
  lockedColors: number[];
}

export interface PixelEditorActions {
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setTool: (tool: ToolType) => void;
  setForegroundColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  setTolerance: (tolerance: number) => void;
  setSprayDensity: (density: number) => void;
  setSprayRadius: (radius: number) => void;
  setPixelPerfect: (on: boolean) => void;
  setSymmetry: (symmetry: "none" | "horizontal" | "vertical" | "radial") => void;
  setSymmetrySegments: (segments: number) => void;
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
  resetCanvas: (width: number, height: number) => void;
  addPaletteColor: (color: string) => void;
  removePaletteColor: (index: number) => void;
  reorderPalette: (from: number, to: number) => void;
  toggleLockColor: (index: number) => void;
  setPalette: (palette: string[]) => void;
  setLockedColors: (locked: number[]) => void;
}

const DEFAULT_PALETTE = [
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff",
  "#808080", "#c0c0c0", "#800000", "#008000", "#000080", "#808000", "#800080", "#008080",
  "#ff8800", "#88ff00", "#0088ff", "#ff0088", "#8800ff", "#00ff88", "#ff4400", "#44ff00",
];

const defaultColors = {
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
};

export const usePixelEditorStore = create<PixelEditorState & PixelEditorActions>()((set) => ({
  width: 64,
  height: 64,
  tool: "pencil",
  brushSize: 1,
  brushOpacity: 1,
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
  palette: [...DEFAULT_PALETTE],
  lockedColors: [],

  ...defaultColors,

  setWidth: (width) => set({ width }),
  setHeight: (height) => set({ height }),
  setTool: (tool) => set({ tool }),
  setForegroundColor: (color) => set({ foregroundColor: color }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setBrushSize: (size) => set({ brushSize: Math.max(1, Math.min(100, size)) }),
  setBrushOpacity: (opacity) => set({ brushOpacity: Math.max(0, Math.min(1, opacity)) }),
  setTolerance: (tolerance) => set({ tolerance: Math.max(0, Math.min(255, tolerance)) }),
  setSprayDensity: (density) => set({ sprayDensity: Math.max(0, Math.min(1, density)) }),
  setSprayRadius: (radius) => set({ sprayRadius: Math.max(1, Math.min(100, radius)) }),
  setPixelPerfect: (on) => set({ pixelPerfect: on }),
  setSymmetry: (symmetry) => set({ symmetry }),
  setSymmetrySegments: (segments) => set({ symmetrySegments: Math.max(2, Math.min(32, segments)) }),
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
  resetCanvas: (width, height) => set({ width, height, dirty: false }),

  addPaletteColor: (color) => set((s) => {
    if (s.palette.length >= 64) return s;
    return { palette: [...s.palette, color] };
  }),

  removePaletteColor: (index) => set((s) => {
    if (s.lockedColors.includes(index)) return s;
    const newPalette = s.palette.filter((_, i) => i !== index);
    const newLocked = s.lockedColors
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
    return { palette: newPalette, lockedColors: newLocked };
  }),

  reorderPalette: (from, to) => set((s) => {
    const newPalette = [...s.palette];
    const [moved] = newPalette.splice(from, 1);
    newPalette.splice(to, 0, moved!);
    const newLocked = s.lockedColors.map((i) => {
      if (i === from) return to;
      if (from < i && i <= to) return i - 1;
      if (to <= i && i < from) return i + 1;
      return i;
    });
    return { palette: newPalette, lockedColors: newLocked };
  }),

  toggleLockColor: (index) => set((s) => {
    const isLocked = s.lockedColors.includes(index);
    return {
      lockedColors: isLocked
        ? s.lockedColors.filter((i) => i !== index)
        : [...s.lockedColors, index],
    };
  }),

  setPalette: (palette) => set({ palette }),
  setLockedColors: (locked) => set({ lockedColors: locked }),
}));
