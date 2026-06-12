import { create } from "zustand";
import type { Layer, PixelCanvas } from "../utils/pixel-canvas";
import type { PixelDocument } from "../utils/pixel-canvas";

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
  setDocument: (doc) => set({ document: doc, canvas: doc?.canvas ?? null, renderVersion: doc?.canvas.renderVersion ?? 0 }),

  forceRender: () => set((s) => ({ renderVersion: s.renderVersion + 1 })),

  addLayer: (name) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.addLayer(name);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  removeLayer: (index) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.removeLayer(index);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  duplicateLayer: (index) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.duplicateLayer(index);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  renameLayer: (index, name) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.renameLayer(index, name);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  moveLayer: (from, to) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.moveLayer(from, to);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  setCurrentLayer: (index) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setCurrentLayer(index);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  setCurrentLayerById: (id) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setCurrentLayerById(id);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  setLayerVisibility: (index, visible) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerVisibility(index, visible);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  setLayerOpacity: (index, opacity) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerOpacity(index, opacity);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  setLayerBlendMode: (index, mode) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerBlendMode(index, mode);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  setLayerLocked: (index, locked) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerLocked(index, locked);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  createGroup: (name) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.createGroup(name);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  addLayerToGroup: (groupId, layerIndex) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.addLayerToGroup(groupId, layerIndex);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  removeLayerFromGroup: (index) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.removeLayerFromGroup(index);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  setLayerExpanded: (id, expanded) => {
    const { canvas } = get();
    if (!canvas) return;
    canvas.setLayerExpanded(id, expanded);
    canvas.bumpRender();
    set({ renderVersion: canvas.renderVersion });
  },

  getCompositeData: () => {
    const { canvas } = get();
    if (!canvas) return new Uint8ClampedArray();
    return canvas.getCompositeData();
  },
}));
