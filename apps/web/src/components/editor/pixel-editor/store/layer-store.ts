import { create } from "zustand";
import { type Layer, PixelCanvas, PixelDocument } from "../utils/pixel-canvas";

export interface LayerStore {
  canvas: PixelCanvas | null;
  document: PixelDocument | null;
  renderVersion: number;
  setCanvas: (canvas: PixelCanvas | null) => void;
  setDocument: (doc: PixelDocument | null) => void;
  forceRender: () => void;
  addLayer: (name?: string) => void;
  removeLayer: (index: number) => void;
  duplicateLayer: (index: number) => void;
  renameLayer: (index: number, name: string) => void;
  moveLayer: (from: number, to: number) => void;
  setCurrentLayer: (index: number) => void;
  setCurrentLayerById: (id: string) => void;
  setLayerVisibility: (index: number, visible: boolean) => void;
  setLayerOpacity: (index: number, opacity: number) => void;
  setLayerBlendMode: (index: number, mode: Layer["blendMode"]) => void;
  setLayerLocked: (index: number, locked: boolean) => void;
  createGroup: (name?: string) => void;
  addLayerToGroup: (groupId: string, layerIndex: number) => void;
  removeLayerFromGroup: (index: number) => void;
  setLayerExpanded: (id: string, expanded: boolean) => void;
  getCompositeData: () => Uint8ClampedArray;
}

export const useLayerStore = create<LayerStore>()((set, get) => ({
  canvas: null,
  document: null,
  renderVersion: 0,

  setCanvas: (canvas) => set({ canvas, document: null, renderVersion: 0 }),
  setDocument: (doc) => set({ document: doc, canvas: doc?.canvas ?? null, renderVersion: 0 }),

  forceRender: () => set((s) => ({ renderVersion: s.renderVersion + 1 })),

  addLayer: (name) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.addLayer(name);
    set({ canvas: cloneCanvas(canvas) });
  },

  removeLayer: (index) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.removeLayer(index);
    set({ canvas: cloneCanvas(canvas) });
  },

  duplicateLayer: (index) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.duplicateLayer(index);
    set({ canvas: cloneCanvas(canvas) });
  },

  renameLayer: (index, name) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.renameLayer(index, name);
    set({ canvas: cloneCanvas(canvas) });
  },

  moveLayer: (from, to) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.moveLayer(from, to);
    set({ canvas: cloneCanvas(canvas) });
  },

  setCurrentLayer: (index) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setCurrentLayer(index);
    set({ canvas: cloneCanvas(canvas) });
  },

  setCurrentLayerById: (id) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setCurrentLayerById(id);
    set({ canvas: cloneCanvas(canvas) });
  },

  setLayerVisibility: (index, visible) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerVisibility(index, visible);
    set({ canvas: cloneCanvas(canvas) });
  },

  setLayerOpacity: (index, opacity) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerOpacity(index, opacity);
    set({ canvas: cloneCanvas(canvas) });
  },

  setLayerBlendMode: (index, mode) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerBlendMode(index, mode);
    set({ canvas: cloneCanvas(canvas) });
  },

  setLayerLocked: (index, locked) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerLocked(index, locked);
    set({ canvas: cloneCanvas(canvas) });
  },

  createGroup: (name) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.createGroup(name);
    set({ canvas: cloneCanvas(canvas) });
  },

  addLayerToGroup: (groupId, layerIndex) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.addLayerToGroup(groupId, layerIndex);
    set({ canvas: cloneCanvas(canvas) });
  },

  removeLayerFromGroup: (index) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.removeLayerFromGroup(index);
    set({ canvas: cloneCanvas(canvas) });
  },

  setLayerExpanded: (id, expanded) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerExpanded(id, expanded);
    set({ canvas: cloneCanvas(canvas) });
  },

  getCompositeData: () => {
    const { canvas } = get();
    if (!canvas) return new Uint8ClampedArray();
    return canvas.getCompositeData();
  },
}));

function cloneCanvas(canvas: PixelCanvas): PixelCanvas {
  const clone = PixelCanvas.deserialize(canvas.serialize());
  return clone;
}
