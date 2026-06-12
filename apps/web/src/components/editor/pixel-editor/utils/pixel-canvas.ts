import { CanvasState } from "./canvas-state";

export type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "difference" | "additive";

export interface Layer {
  id: string;
  name: string;
  canvas: CanvasState;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  locked: boolean;
  children: Layer[];
  expanded: boolean;
}

export interface SerializedLayer {
  id: string;
  name: string;
  canvas: { width: number; height: number; pixels: number[] };
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  locked: boolean;
  children: SerializedLayer[];
  expanded: boolean;
}

export interface SerializedCanvas {
  width: number;
  height: number;
  layers: SerializedLayer[];
  currentLayerIndex: number;
  currentLayerId: string;
  selectionMask?: number[] | null;
  selectionBounds?: { x: number; y: number; w: number; h: number } | null;
  selectionMode?: "new" | "add" | "subtract" | "intersect";
  selectionMoveOffset?: { x: number; y: number } | null;
  clipboardContent?: number[] | null;
  clipboardWidth?: number;
  clipboardHeight?: number;
  transformAngle?: number;
  transformPivot?: { x: number; y: number } | null;
  isTransforming?: boolean;
}

let nextId = 1;

function generateId(): string {
  return `layer-${nextId++}-${Date.now()}`;
}

export function createLayer(width: number, height: number, name?: string): Layer {
  return {
    id: generateId(),
    name: name ?? `Layer ${nextId - 1}`,
    canvas: new CanvasState(width, height),
    visible: true,
    opacity: 1,
    blendMode: "normal",
    locked: false,
    children: [],
    expanded: true,
  };
}

export function createEmptyGroup(name?: string): Layer {
  return {
    id: generateId(),
    name: name ?? `Group ${nextId - 1}`,
    canvas: new CanvasState(0, 0),
    visible: true,
    opacity: 1,
    blendMode: "normal",
    locked: false,
    children: [],
    expanded: true,
  };
}

export function cloneLayer(layer: Layer): Layer {
  return {
    ...layer,
    id: generateId(),
    name: `${layer.name} copy`,
    canvas: layer.canvas.clone(),
    children: layer.children.length > 0
      ? layer.children.map((child) => cloneLayer(child))
      : [],
  };
}

export function duplicateLayer(layer: Layer): Layer {
  return cloneLayer(layer);
}

export class PixelCanvas {
  readonly width: number;
  readonly height: number;
  readonly layers: Layer[];
  currentLayerId: string;
  currentLayerIndex: number;

  selectionMask: Uint8Array | null = null;
  selectionBounds: { x: number; y: number; w: number; h: number } | null = null;
  selectionMode: "new" | "add" | "subtract" | "intersect" = "new";
  selectionMoveOffset: { x: number; y: number } | null = null;
  selectionOriginalData: Uint32Array | null = null;

  clipboardContent: Uint32Array | null = null;
  clipboardWidth: number = 0;
  clipboardHeight: number = 0;

  transformAngle: number = 0;
  transformPivot: { x: number; y: number } | null = null;
  isTransforming: boolean = false;

  renderVersion: number = 0;

  constructor(width: number, height: number) {
    if (width < 1 || height < 1) {
      throw new Error(`Invalid canvas dimensions: ${width}x${height}`);
    }
    if (width > 1024 || height > 1024) {
      throw new Error(`Canvas dimensions exceed maximum: ${width}x${height}`);
    }
    this.width = Math.floor(width);
    this.height = Math.floor(height);
    this.layers = [createLayer(width, height, "Layer 1")];
    this.currentLayerId = this.layers[0]!.id;
    this.currentLayerIndex = 0;
  }

  bumpRender(): void {
    this.renderVersion++;
  }

  setClipboard(data: Uint32Array | null, width?: number, height?: number): void {
    this.clipboardContent = data;
    this.clipboardWidth = width ?? 0;
    this.clipboardHeight = height ?? 0;
  }

  setSelection(mask: Uint8Array | null, bounds: { x: number; y: number; w: number; h: number } | null): void {
    this.selectionMask = mask;
    this.selectionBounds = bounds;
  }

  clearSelection(): void {
    this.selectionMask = null;
    this.selectionBounds = null;
    this.selectionMoveOffset = null;
    this.selectionOriginalData = null;
  }

  get currentLayer(): Layer {
    return this.findLayerById(this.currentLayerId) ?? this.layers[0]!;
  }

  get layerCount(): number {
    return this.flatList().length;
  }

  get pixelCount(): number {
    return this.width * this.height;
  }

  flatList(): Layer[] {
    const result: Layer[] = [];
    for (const node of this.layers) {
      flattenNode(node, result, 0);
    }
    return result;
  }

  findLayerById(id: string, nodes?: Layer[]): Layer | undefined {
    const list = nodes ?? this.layers;
    for (const node of list) {
      if (node.id === id) return node;
      if (node.children.length > 0) {
        const found = this.findLayerById(id, node.children);
        if (found) return found;
      }
    }
    return undefined;
  }

  findParentOf(id: string, nodes?: Layer[]): { parent: Layer[]; index: number } | null {
    const list = nodes ?? this.layers;
    for (let i = 0; i < list.length; i++) {
      if (list[i]!.id === id) return { parent: list, index: i };
      if (list[i]!.children.length > 0) {
        const found = this.findParentOf(id, list[i]!.children);
        if (found) return found;
      }
    }
    return null;
  }

  flatIndexOf(id: string): number {
    return this.flatList().findIndex((l) => l.id === id);
  }

  addLayer(name?: string): Layer {
    const layer = createLayer(this.width, this.height, name);
    this.layers.push(layer);
    this.currentLayerId = layer.id;
    this.currentLayerIndex = this.layers.length - 1;
    return layer;
  }

  removeLayer(index: number): void {
    const flat = this.flatList();
    if (flat.length <= 1) throw new Error("Cannot remove the last layer");
    if (index < 0 || index >= flat.length) throw new Error(`Layer index out of bounds: ${index}`);
    const target = flat[index]!;
    const parentInfo = this.findParentOf(target.id);
    if (!parentInfo) return;
    const parent = parentInfo.parent;
    const idx = parentInfo.index;
    parent.splice(idx, 1);
    if (parent.length === 0 && parent !== this.layers) {
      for (const top of this.layers) {
        if (top.children === parent) { top.children = []; break; }
      }
    }
    const newFlat = this.flatList();
    if (newFlat.length === 0) {
      const replacement = createLayer(this.width, this.height);
      this.layers.push(replacement);
      this.currentLayerId = replacement.id;
      this.currentLayerIndex = 0;
      return;
    }
    if (!this.findLayerById(this.currentLayerId)) {
      this.currentLayerId = newFlat[newFlat.length - 1]!.id;
    }
    this.currentLayerIndex = this.flatIndexOf(this.currentLayerId);
  }

  duplicateLayer(index: number): Layer {
    const flat = this.flatList();
    if (index < 0 || index >= flat.length) throw new Error(`Layer index out of bounds: ${index}`);
    const original = flat[index]!;
    const parentInfo = this.findParentOf(original.id);
    if (!parentInfo) throw new Error("Layer not found in tree");
    const copy = cloneLayer(original);
    parentInfo.parent.splice(parentInfo.index + 1, 0, copy);
    this.currentLayerId = copy.id;
    this.currentLayerIndex = this.flatIndexOf(this.currentLayerId);
    return copy;
  }

  renameLayer(index: number, name: string): void {
    const flat = this.flatList();
    if (index < 0 || index >= flat.length) throw new Error(`Layer index out of bounds: ${index}`);
    flat[index]!.name = name;
  }

  moveLayer(fromIndex: number, toIndex: number): void {
    const flat = this.flatList();
    if (fromIndex < 0 || fromIndex >= flat.length) return;
    if (toIndex < 0 || toIndex >= flat.length) return;
    if (fromIndex === toIndex) return;
    const fromLayer = flat[fromIndex]!;
    const toLayer = flat[toIndex]!;
    const fromParent = this.findParentOf(fromLayer.id);
    const toParent = this.findParentOf(toLayer.id);
    if (!fromParent || !toParent) return;
    fromParent.parent.splice(fromParent.index, 1);
    const newFlat = this.flatList();
    const newToIdx = newFlat.findIndex((l) => l.id === toLayer.id);
    if (newToIdx < 0) return;
    const adjustedTo = this.findParentOf(toLayer.id);
    if (!adjustedTo) return;
    adjustedTo.parent.splice(adjustedTo.index, 0, fromLayer);
    this.currentLayerId = fromLayer.id;
    this.currentLayerIndex = this.flatIndexOf(this.currentLayerId);
  }

  setCurrentLayer(index: number): void {
    const flat = this.flatList();
    if (index < 0 || index >= flat.length) throw new Error(`Layer index out of bounds: ${index}`);
    this.currentLayerId = flat[index]!.id;
    this.currentLayerIndex = index;
  }

  setCurrentLayerById(id: string): void {
    const layer = this.findLayerById(id);
    if (!layer) return;
    this.currentLayerId = id;
    this.currentLayerIndex = this.flatIndexOf(id);
  }

  setLayerVisibility(index: number, visible: boolean): void {
    const flat = this.flatList();
    if (index < 0 || index >= flat.length) return;
    flat[index]!.visible = visible;
  }

  setLayerOpacity(index: number, opacity: number): void {
    const flat = this.flatList();
    if (index < 0 || index >= flat.length) return;
    flat[index]!.opacity = Math.max(0, Math.min(1, opacity));
  }

  setLayerBlendMode(index: number, mode: BlendMode): void {
    const flat = this.flatList();
    if (index < 0 || index >= flat.length) return;
    flat[index]!.blendMode = mode;
  }

  setLayerLocked(index: number, locked: boolean): void {
    const flat = this.flatList();
    if (index < 0 || index >= flat.length) return;
    flat[index]!.locked = locked;
  }

  createGroup(name?: string): Layer {
    const group = createEmptyGroup(name);
    this.layers.push(group);
    this.currentLayerId = group.id;
    this.currentLayerIndex = this.layers.length - 1;
    return group;
  }

  addLayerToGroup(groupId: string, layerIndex: number): void {
    const group = this.findLayerById(groupId);
    if (!group || group.children === undefined) return;
    const flat = this.flatList();
    if (layerIndex < 0 || layerIndex >= flat.length) return;
    const target = flat[layerIndex]!;
    const parentInfo = this.findParentOf(target.id);
    if (!parentInfo) return;
    parentInfo.parent.splice(parentInfo.index, 1);
    group.children.push(target);
  }

  removeLayerFromGroup(index: number): void {
    const flat = this.flatList();
    if (index < 0 || index >= flat.length) return;
    const target = flat[index]!;
    const parentInfo = this.findParentOf(target.id);
    if (!parentInfo || parentInfo.parent === this.layers) return;
    parentInfo.parent.splice(parentInfo.index, 1);
    const lastIdx = this.flatIndexOf(this.layers[this.layers.length - 1]!.id);
    this.layers.splice(lastIdx + 1, 0, target);
  }

  setLayerExpanded(id: string, expanded: boolean): void {
    const layer = this.findLayerById(id);
    if (layer) layer.expanded = expanded;
  }

  getCompositeData(): Uint8ClampedArray {
    const composite = new Uint32Array(this.pixelCount);
    for (const node of this.layers) {
      if (!node.visible) continue;
      this.compositeNode(composite, node);
    }
    const result = new Uint8ClampedArray(this.pixelCount * 4);
    for (let i = 0; i < composite.length; i++) {
      const p = composite[i]!;
      result[i * 4] = p & 0xff;
      result[i * 4 + 1] = (p >> 8) & 0xff;
      result[i * 4 + 2] = (p >> 16) & 0xff;
      result[i * 4 + 3] = (p >> 24) & 0xff;
    }
    return result;
  }

  getCompositeRegion(x: number, y: number, w: number, h: number): Uint8ClampedArray {
    const clampedX = Math.max(0, x);
    const clampedY = Math.max(0, y);
    const clampedW = Math.min(w, this.width - clampedX);
    const clampedH = Math.min(h, this.height - clampedY);
    const composite = new Uint32Array(clampedW * clampedH);
    for (const node of this.layers) {
      if (!node.visible) continue;
      this.compositeNodeRegion(composite, node, clampedX, clampedY, clampedW, clampedH);
    }
    const result = new Uint8ClampedArray(clampedW * clampedH * 4);
    for (let i = 0; i < composite.length; i++) {
      const p = composite[i]!;
      result[i * 4] = p & 0xff;
      result[i * 4 + 1] = (p >> 8) & 0xff;
      result[i * 4 + 2] = (p >> 16) & 0xff;
      result[i * 4 + 3] = (p >> 24) & 0xff;
    }
    return result;
  }

  private compositeNode(dest: Uint32Array, node: Layer): void {
    if (node.children.length > 0) {
      const groupResult = new Uint32Array(this.pixelCount);
      for (const child of node.children) {
        if (!child.visible) continue;
        this.compositeNode(groupResult, child);
      }
      blendData(dest, groupResult, node.blendMode, node.opacity);
    } else {
      if (node.canvas.length === 0) return;
      blendData(dest, node.canvas.pixels, node.blendMode, node.opacity);
    }
  }

  private compositeNodeRegion(dest: Uint32Array, node: Layer, rx: number, ry: number, rw: number, rh: number): void {
    if (node.children.length > 0) {
      const groupResult = new Uint32Array(this.pixelCount);
      for (const child of node.children) {
        if (!child.visible) continue;
        this.compositeNodeRegion(groupResult, child, rx, ry, rw, rh);
      }
      blendDataRegion(dest, groupResult, node.blendMode, node.opacity, this.width, rx, ry, rw, rh);
    } else {
      if (node.canvas.length === 0) return;
      blendDataRegion(dest, node.canvas.pixels, node.blendMode, node.opacity, this.width, rx, ry, rw, rh);
    }
  }

  serialize(): SerializedCanvas {
    return {
      width: this.width,
      height: this.height,
      layers: this.layers.map((l) => serializeLayer(l)),
      currentLayerIndex: this.currentLayerIndex,
      currentLayerId: this.currentLayerId,
      selectionMask: this.selectionMask ? Array.from(this.selectionMask) : null,
      selectionBounds: this.selectionBounds,
      selectionMode: this.selectionMode,
      selectionMoveOffset: this.selectionMoveOffset,
      clipboardContent: this.clipboardContent ? Array.from(this.clipboardContent) : null,
      clipboardWidth: this.clipboardWidth,
      clipboardHeight: this.clipboardHeight,
      transformAngle: this.transformAngle,
      transformPivot: this.transformPivot,
      isTransforming: this.isTransforming,
    };
  }

  static deserialize(data: SerializedCanvas): PixelCanvas {
    const canvas = new PixelCanvas(data.width, data.height);
    canvas.layers.length = 0;
    for (const sl of data.layers) {
      canvas.layers.push(deserializeLayer(sl));
    }
    canvas.currentLayerId = data.currentLayerId ?? canvas.layers[data.currentLayerIndex]?.id ?? canvas.layers[0]!.id;
    canvas.currentLayerIndex = canvas.flatIndexOf(canvas.currentLayerId);
    if (data.selectionMask) canvas.selectionMask = new Uint8Array(data.selectionMask);
    if (data.selectionBounds) canvas.selectionBounds = data.selectionBounds;
    if (data.selectionMode) canvas.selectionMode = data.selectionMode;
    if (data.selectionMoveOffset) canvas.selectionMoveOffset = data.selectionMoveOffset;
    if (data.clipboardContent) canvas.clipboardContent = new Uint32Array(data.clipboardContent);
    if (data.clipboardWidth !== undefined) canvas.clipboardWidth = data.clipboardWidth;
    if (data.clipboardHeight !== undefined) canvas.clipboardHeight = data.clipboardHeight;
    if (data.transformAngle !== undefined) canvas.transformAngle = data.transformAngle;
    if (data.transformPivot) canvas.transformPivot = data.transformPivot;
    if (data.isTransforming !== undefined) canvas.isTransforming = data.isTransforming;
    return canvas;
  }
}

function flattenNode(node: Layer, result: Layer[], depth: number): void {
  result.push(node);
  if (node.children.length > 0 && node.expanded) {
    for (const child of node.children) {
      flattenNode(child, result, depth + 1);
    }
  }
}

function serializeLayer(l: Layer): SerializedLayer {
  return {
    id: l.id,
    name: l.name,
    canvas: l.canvas.serialize(),
    visible: l.visible,
    opacity: l.opacity,
    blendMode: l.blendMode,
    locked: l.locked,
    children: l.children.map((c) => serializeLayer(c)),
    expanded: l.expanded,
  };
}

function deserializeLayer(sl: SerializedLayer): Layer {
  return {
    id: sl.id,
    name: sl.name,
    canvas: CanvasState.deserialize(sl.canvas),
    visible: sl.visible,
    opacity: sl.opacity,
    blendMode: sl.blendMode,
    locked: sl.locked,
    children: sl.children.map((c) => deserializeLayer(c)),
    expanded: sl.expanded ?? true,
  };
}

function blendData(dest: Uint32Array, src: Uint32Array, mode: BlendMode, opacity: number): void {
  switch (mode) {
    case "normal": blendNormal(dest, src, opacity); break;
    case "multiply": blendMultiply(dest, src, opacity); break;
    case "screen": blendScreen(dest, src, opacity); break;
    case "overlay": blendOverlay(dest, src, opacity); break;
    case "darken": blendDarken(dest, src, opacity); break;
    case "lighten": blendLighten(dest, src, opacity); break;
    case "difference": blendDifference(dest, src, opacity); break;
    case "additive": blendAdditive(dest, src, opacity); break;
  }
}

function blendDataRegion(dest: Uint32Array, src: Uint32Array, mode: BlendMode, opacity: number, stride: number, rx: number, ry: number, rw: number, rh: number): void {
  const regionSize = rw * rh;
  const regionSrc = new Uint32Array(regionSize);
  const regionDest = new Uint32Array(regionSize);
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const srcIdx = (ry + row) * stride + (rx + col);
      const regionIdx = row * rw + col;
      regionSrc[regionIdx] = src[srcIdx]!;
      regionDest[regionIdx] = dest[srcIdx] ?? 0;
    }
  }
  blendData(regionDest, regionSrc, mode, opacity);
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const srcIdx = (ry + row) * stride + (rx + col);
      const regionIdx = row * rw + col;
      dest[srcIdx] = regionDest[regionIdx]!;
    }
  }
}

function blendNormal(dest: Uint32Array, src: Uint32Array, opacity: number): void {
  for (let i = 0; i < dest.length; i++) {
    const sp = src[i]!;
    const saRaw = (sp >> 24) & 0xff;
    if (saRaw === 0) continue;
    const sa = (saRaw / 255) * opacity;
    const dp = dest[i]!;
    const da = ((dp >> 24) & 0xff) / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    const sr = sp & 0xff;
    const sg = (sp >> 8) & 0xff;
    const sb = (sp >> 16) & 0xff;
    const dr = dp & 0xff;
    const dg = (dp >> 8) & 0xff;
    const db = (dp >> 16) & 0xff;
    const outR = Math.round((sr * sa + dr * da * (1 - sa)) / outA);
    const outG = Math.round((sg * sa + dg * da * (1 - sa)) / outA);
    const outB = Math.round((sb * sa + db * da * (1 - sa)) / outA);
    dest[i] = ((Math.round(outA * 255) & 0xff) << 24) | ((outB & 0xff) << 16) | ((outG & 0xff) << 8) | (outR & 0xff);
  }
}

function blendMultiply(dest: Uint32Array, src: Uint32Array, opacity: number): void {
  for (let i = 0; i < dest.length; i++) {
    const sp = src[i]!;
    const saRaw = (sp >> 24) & 0xff;
    if (saRaw === 0) continue;
    const sa = (saRaw / 255) * opacity;
    const dp = dest[i]!;
    const da = ((dp >> 24) & 0xff) / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    const sr = sp & 0xff;
    const sg = (sp >> 8) & 0xff;
    const sb = (sp >> 16) & 0xff;
    const dr = dp & 0xff;
    const dg = (dp >> 8) & 0xff;
    const db = (dp >> 16) & 0xff;
    const outR = Math.round(((sr * dr / 255) * sa + dr * da * (1 - sa)) / outA);
    const outG = Math.round(((sg * dg / 255) * sa + dg * da * (1 - sa)) / outA);
    const outB = Math.round(((sb * db / 255) * sa + db * da * (1 - sa)) / outA);
    dest[i] = ((Math.round(outA * 255) & 0xff) << 24) | ((outB & 0xff) << 16) | ((outG & 0xff) << 8) | (outR & 0xff);
  }
}

function blendScreen(dest: Uint32Array, src: Uint32Array, opacity: number): void {
  for (let i = 0; i < dest.length; i++) {
    const sp = src[i]!;
    const saRaw = (sp >> 24) & 0xff;
    if (saRaw === 0) continue;
    const sa = (saRaw / 255) * opacity;
    const dp = dest[i]!;
    const da = ((dp >> 24) & 0xff) / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    const sr = sp & 0xff;
    const sg = (sp >> 8) & 0xff;
    const sb = (sp >> 16) & 0xff;
    const dr = dp & 0xff;
    const dg = (dp >> 8) & 0xff;
    const db = (dp >> 16) & 0xff;
    const outR = Math.round(((255 - (255 - sr) * (255 - dr) / 255) * sa + dr * da * (1 - sa)) / outA);
    const outG = Math.round(((255 - (255 - sg) * (255 - dg) / 255) * sa + dg * da * (1 - sa)) / outA);
    const outB = Math.round(((255 - (255 - sb) * (255 - db) / 255) * sa + db * da * (1 - sa)) / outA);
    dest[i] = ((Math.round(outA * 255) & 0xff) << 24) | ((outB & 0xff) << 16) | ((outG & 0xff) << 8) | (outR & 0xff);
  }
}

function blendOverlay(dest: Uint32Array, src: Uint32Array, opacity: number): void {
  for (let i = 0; i < dest.length; i++) {
    const sp = src[i]!;
    const saRaw = (sp >> 24) & 0xff;
    if (saRaw === 0) continue;
    const sa = (saRaw / 255) * opacity;
    const dp = dest[i]!;
    const da = ((dp >> 24) & 0xff) / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    const sr = sp & 0xff;
    const sg = (sp >> 8) & 0xff;
    const sb = (sp >> 16) & 0xff;
    const dr = dp & 0xff;
    const dg = (dp >> 8) & 0xff;
    const db = (dp >> 16) & 0xff;
    const blend = (b: number, t: number) => b < 128 ? (2 * t * b) / 255 : 255 - (2 * (255 - t) * (255 - b)) / 255;
    const outR = Math.round((blend(dr, sr) * sa + dr * da * (1 - sa)) / outA);
    const outG = Math.round((blend(dg, sg) * sa + dg * da * (1 - sa)) / outA);
    const outB = Math.round((blend(db, sb) * sa + db * da * (1 - sa)) / outA);
    dest[i] = ((Math.round(outA * 255) & 0xff) << 24) | ((outB & 0xff) << 16) | ((outG & 0xff) << 8) | (outR & 0xff);
  }
}

function blendDarken(dest: Uint32Array, src: Uint32Array, opacity: number): void {
  for (let i = 0; i < dest.length; i++) {
    const sp = src[i]!;
    const saRaw = (sp >> 24) & 0xff;
    if (saRaw === 0) continue;
    const sa = (saRaw / 255) * opacity;
    const dp = dest[i]!;
    const da = ((dp >> 24) & 0xff) / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    const sr = sp & 0xff;
    const sg = (sp >> 8) & 0xff;
    const sb = (sp >> 16) & 0xff;
    const dr = dp & 0xff;
    const dg = (dp >> 8) & 0xff;
    const db = (dp >> 16) & 0xff;
    const outR = Math.round((Math.min(sr, dr) * sa + dr * da * (1 - sa)) / outA);
    const outG = Math.round((Math.min(sg, dg) * sa + dg * da * (1 - sa)) / outA);
    const outB = Math.round((Math.min(sb, db) * sa + db * da * (1 - sa)) / outA);
    dest[i] = ((Math.round(outA * 255) & 0xff) << 24) | ((outB & 0xff) << 16) | ((outG & 0xff) << 8) | (outR & 0xff);
  }
}

function blendLighten(dest: Uint32Array, src: Uint32Array, opacity: number): void {
  for (let i = 0; i < dest.length; i++) {
    const sp = src[i]!;
    const saRaw = (sp >> 24) & 0xff;
    if (saRaw === 0) continue;
    const sa = (saRaw / 255) * opacity;
    const dp = dest[i]!;
    const da = ((dp >> 24) & 0xff) / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    const sr = sp & 0xff;
    const sg = (sp >> 8) & 0xff;
    const sb = (sp >> 16) & 0xff;
    const dr = dp & 0xff;
    const dg = (dp >> 8) & 0xff;
    const db = (dp >> 16) & 0xff;
    const outR = Math.round((Math.max(sr, dr) * sa + dr * da * (1 - sa)) / outA);
    const outG = Math.round((Math.max(sg, dg) * sa + dg * da * (1 - sa)) / outA);
    const outB = Math.round((Math.max(sb, db) * sa + db * da * (1 - sa)) / outA);
    dest[i] = ((Math.round(outA * 255) & 0xff) << 24) | ((outB & 0xff) << 16) | ((outG & 0xff) << 8) | (outR & 0xff);
  }
}

function blendDifference(dest: Uint32Array, src: Uint32Array, opacity: number): void {
  for (let i = 0; i < dest.length; i++) {
    const sp = src[i]!;
    const saRaw = (sp >> 24) & 0xff;
    if (saRaw === 0) continue;
    const sa = (saRaw / 255) * opacity;
    const dp = dest[i]!;
    const da = ((dp >> 24) & 0xff) / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    const sr = sp & 0xff;
    const sg = (sp >> 8) & 0xff;
    const sb = (sp >> 16) & 0xff;
    const dr = dp & 0xff;
    const dg = (dp >> 8) & 0xff;
    const db = (dp >> 16) & 0xff;
    const outR = Math.round((Math.abs(dr - sr) * sa + dr * da * (1 - sa)) / outA);
    const outG = Math.round((Math.abs(dg - sg) * sa + dg * da * (1 - sa)) / outA);
    const outB = Math.round((Math.abs(db - sb) * sa + db * da * (1 - sa)) / outA);
    dest[i] = ((Math.round(outA * 255) & 0xff) << 24) | ((outB & 0xff) << 16) | ((outG & 0xff) << 8) | (outR & 0xff);
  }
}

function blendAdditive(dest: Uint32Array, src: Uint32Array, opacity: number): void {
  for (let i = 0; i < dest.length; i++) {
    const sp = src[i]!;
    const saRaw = (sp >> 24) & 0xff;
    if (saRaw === 0) continue;
    const sa = (saRaw / 255) * opacity;
    const dp = dest[i]!;
    const outA = Math.min(1, sa + ((dp >> 24) & 0xff) / 255);
    const sr = sp & 0xff;
    const sg = (sp >> 8) & 0xff;
    const sb = (sp >> 16) & 0xff;
    dest[i] = ((Math.round(outA * 255) & 0xff) << 24) |
              ((Math.min(255, sb + (dp >> 16) & 0xff) & 0xff) << 16) |
              ((Math.min(255, sg + (dp >> 8) & 0xff) & 0xff) << 8) |
              (Math.min(255, sr + (dp & 0xff)) & 0xff);
  }
}

export class PixelDocument {
  canvas: PixelCanvas;
  filePath: string;
  dirty: boolean;
  private autoSaveTimer: ReturnType<typeof setTimeout> | null;
  private onAutoSave: ((doc: PixelDocument) => void) | null;

  constructor(canvas: PixelCanvas, filePath: string = "") {
    this.canvas = canvas;
    this.filePath = filePath;
    this.dirty = false;
    this.autoSaveTimer = null;
    this.onAutoSave = null;
  }

  markDirty(): void {
    this.dirty = true;
    this.scheduleAutoSave();
  }

  markClean(): void {
    this.dirty = false;
    this.cancelAutoSave();
  }

  setOnAutoSave(handler: (doc: PixelDocument) => void): void {
    this.onAutoSave = handler;
  }

  private scheduleAutoSave(): void {
    this.cancelAutoSave();
    this.autoSaveTimer = setTimeout(() => { this.autoSave(); }, 3000);
  }

  private cancelAutoSave(): void {
    if (this.autoSaveTimer !== null) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  private async autoSave(): Promise<void> {
    if (!this.dirty) return;
    this.dirty = false;
    this.onAutoSave?.(this);
  }

  dispose(): void {
    this.cancelAutoSave();
    this.onAutoSave = null;
  }

  serialize(): SerializedDocument {
    return {
      canvas: this.canvas.serialize(),
      filePath: this.filePath,
    };
  }

  static deserialize(data: SerializedDocument): PixelDocument {
    const canvas = PixelCanvas.deserialize(data.canvas);
    const doc = new PixelDocument(canvas, data.filePath);
    return doc;
  }
}

export interface SerializedDocument {
  canvas: SerializedCanvas;
  filePath: string;
}
