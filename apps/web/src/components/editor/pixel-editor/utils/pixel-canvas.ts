export type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "difference" | "additive";

export interface Layer {
  id: string;
  name: string;
  data: Uint8ClampedArray;
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
  data: number[];
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
}

let nextId = 1;
function generateId(): string {
  return `layer-${nextId++}-${Date.now()}`;
}

export function createLayer(width: number, height: number, name?: string): Layer {
  return {
    id: generateId(),
    name: name ?? `Layer ${nextId - 1}`,
    data: new Uint8ClampedArray(width * height * 4),
    visible: true,
    opacity: 1,
    blendMode: "normal",
    locked: false,
    children: [],
    expanded: true,
  };
}

export function createEmptyGroup(name?: string): Layer {
  const id = generateId();
  return {
    id,
    name: name ?? `Group ${nextId - 1}`,
    data: new Uint8ClampedArray(0),
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
    data: new Uint8ClampedArray(layer.data),
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

  get currentLayer(): Layer {
    return this.findLayerById(this.currentLayerId) ?? this.layers[0]!;
  }

  get layerCount(): number {
    return this.flatList().length;
  }

  get pixelCount(): number {
    return this.width * this.height;
  }

  get dataSize(): number {
    return this.pixelCount * 4;
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
    if (flat.length <= 1) {
      throw new Error("Cannot remove the last layer");
    }
    if (index < 0 || index >= flat.length) {
      throw new Error(`Layer index out of bounds: ${index}`);
    }
    const target = flat[index]!;
    const parentInfo = this.findParentOf(target.id);
    if (!parentInfo) return;

    const parent = parentInfo.parent;
    const idx = parentInfo.index;
    parent.splice(idx, 1);

    if (parent.length === 0 && parent !== this.layers) {
      for (const top of this.layers) {
        if (top.children === parent) {
          top.children = [];
          break;
        }
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
    if (index < 0 || index >= flat.length) {
      throw new Error(`Layer index out of bounds: ${index}`);
    }
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
    this.layers.splice(this.flatIndexOf(this.layers[this.layers.length - 1]!.id) + 1, 0, target);
  }

  setLayerExpanded(id: string, expanded: boolean): void {
    const layer = this.findLayerById(id);
    if (layer) layer.expanded = expanded;
  }

  getCompositeData(): Uint8ClampedArray {
    const result = new Uint8ClampedArray(this.dataSize);
    for (const node of this.layers) {
      if (!node.visible) continue;
      this.compositeNode(result, node);
    }
    return result;
  }

  getCompositeRegion(x: number, y: number, w: number, h: number): Uint8ClampedArray {
    const clampedX = Math.max(0, x);
    const clampedY = Math.max(0, y);
    const clampedW = Math.min(w, this.width - clampedX);
    const clampedH = Math.min(h, this.height - clampedY);
    const region = new Uint8ClampedArray(clampedW * clampedH * 4);
    for (const node of this.layers) {
      if (!node.visible) continue;
      this.compositeNodeRegion(region, node, clampedX, clampedY, clampedW, clampedH);
    }
    return region;
  }

  private compositeNode(dest: Uint8ClampedArray, node: Layer): void {
    if (node.children.length > 0) {
      const groupResult = new Uint8ClampedArray(this.dataSize);
      for (const child of node.children) {
        if (!child.visible) continue;
        this.compositeNode(groupResult, child);
      }
      this.blendData(dest, groupResult, node.blendMode, node.opacity);
    } else {
      this.blendLayer(dest, node);
    }
  }

  private compositeNodeRegion(dest: Uint8ClampedArray, node: Layer, rx: number, ry: number, rw: number, rh: number): void {
    if (node.children.length > 0) {
      const groupResult = new Uint8ClampedArray(this.dataSize);
      for (const child of node.children) {
        if (!child.visible) continue;
        this.compositeNodeRegion(groupResult, child, rx, ry, rw, rh);
      }
      this.blendDataRegion(dest, groupResult, node.blendMode, node.opacity, rx, ry, rw, rh);
    } else {
      this.blendLayerRegion(dest, node, rx, ry, rw, rh);
    }
  }

  private blendData(dest: Uint8ClampedArray, src: Uint8ClampedArray, mode: BlendMode, opacity: number): void {
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

  private blendDataRegion(dest: Uint8ClampedArray, src: Uint8ClampedArray, mode: BlendMode, opacity: number, rx: number, ry: number, rw: number, rh: number): void {
    const blendFn = mode === "normal" ? blendNormal
      : mode === "multiply" ? blendMultiply
      : mode === "screen" ? blendScreen
      : mode === "overlay" ? blendOverlay
      : mode === "darken" ? blendDarken
      : mode === "lighten" ? blendLighten
      : mode === "difference" ? blendDifference
      : blendAdditive;
    const regionData = new Uint8ClampedArray(rw * rh * 4);
    for (let row = 0; row < rh; row++) {
      for (let col = 0; col < rw; col++) {
        const px = rx + col;
        const py = ry + row;
        const idx = (py * this.width + px) * 4;
        const regionIdx = (row * rw + col) * 4;
        regionData[regionIdx] = src[idx]!;
        regionData[regionIdx + 1] = src[idx + 1]!;
        regionData[regionIdx + 2] = src[idx + 2]!;
        regionData[regionIdx + 3] = src[idx + 3]!;
      }
    }
    const regionDest = new Uint8ClampedArray(rw * rh * 4);
    for (let row = 0; row < rh; row++) {
      for (let col = 0; col < rw; col++) {
        const px = rx + col;
        const py = ry + row;
        const idx = (py * this.width + px) * 4;
        const regionIdx = (row * rw + col) * 4;
        regionDest[regionIdx] = dest[idx]!;
        regionDest[regionIdx + 1] = dest[idx + 1]!;
        regionDest[regionIdx + 2] = dest[idx + 2]!;
        regionDest[regionIdx + 3] = dest[idx + 3]!;
      }
    }
    blendFn(regionDest, regionData, opacity);
    for (let row = 0; row < rh; row++) {
      for (let col = 0; col < rw; col++) {
        const px = rx + col;
        const py = ry + row;
        const idx = (py * this.width + px) * 4;
        const regionIdx = (row * rw + col) * 4;
        dest[idx] = regionDest[regionIdx]!;
        dest[idx + 1] = regionDest[regionIdx + 1]!;
        dest[idx + 2] = regionDest[regionIdx + 2]!;
        dest[idx + 3] = regionDest[regionIdx + 3]!;
      }
    }
  }

  private blendLayer(dest: Uint8ClampedArray, src: Layer): void {
    const srcData = src.data;
    const opacity = src.opacity;
    switch (src.blendMode) {
      case "normal":
        blendNormal(dest, srcData, opacity);
        break;
      case "multiply":
        blendMultiply(dest, srcData, opacity);
        break;
      case "screen":
        blendScreen(dest, srcData, opacity);
        break;
      case "overlay":
        blendOverlay(dest, srcData, opacity);
        break;
      case "darken":
        blendDarken(dest, srcData, opacity);
        break;
      case "lighten":
        blendLighten(dest, srcData, opacity);
        break;
      case "difference":
        blendDifference(dest, srcData, opacity);
        break;
      case "additive":
        blendAdditive(dest, srcData, opacity);
        break;
    }
  }

  private blendLayerRegion(dest: Uint8ClampedArray, src: Layer, rx: number, ry: number, rw: number, rh: number): void {
    const srcData = src.data;
    const opacity = src.opacity;
    for (let row = 0; row < rh; row++) {
      for (let col = 0; col < rw; col++) {
        const px = rx + col;
        const py = ry + row;
        const srcIdx = (py * this.width + px) * 4;
        const destIdx = (row * rw + col) * 4;
        const sa = (srcData[srcIdx + 3]! / 255) * opacity;
        if (sa === 0) continue;
        const dr = dest[destIdx]!;
        const dg = dest[destIdx + 1]!;
        const db = dest[destIdx + 2]!;
        const da = dest[destIdx + 3]! / 255;
        const outA = sa + da * (1 - sa);
        if (outA === 0) continue;
        dest[destIdx] = (srcData[srcIdx]! * sa + dr * da * (1 - sa)) / outA;
        dest[destIdx + 1] = (srcData[srcIdx + 1]! * sa + dg * da * (1 - sa)) / outA;
        dest[destIdx + 2] = (srcData[srcIdx + 2]! * sa + db * da * (1 - sa)) / outA;
        dest[destIdx + 3] = outA * 255;
      }
    }
  }

  serialize(): SerializedCanvas {
    return {
      width: this.width,
      height: this.height,
      layers: this.layers.map((l) => serializeLayer(l)),
      currentLayerIndex: this.currentLayerIndex,
      currentLayerId: this.currentLayerId,
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
    data: Array.from(l.data),
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
    data: new Uint8ClampedArray(sl.data),
    visible: sl.visible,
    opacity: sl.opacity,
    blendMode: sl.blendMode,
    locked: sl.locked,
    children: sl.children.map((c) => deserializeLayer(c)),
    expanded: sl.expanded ?? true,
  };
}

export function pixelIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}

export function setPixel(data: Uint8ClampedArray, width: number, x: number, y: number, r: number, g: number, b: number, a: number): void {
  if (x < 0 || x >= width) return;
  const height = data.length / (width * 4);
  if (y < 0 || y >= height) return;
  const i = pixelIndex(x, y, width);
  if (i < 0 || i + 3 >= data.length) return;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = a;
}

export function getPixel(data: Uint8ClampedArray, width: number, x: number, y: number): [number, number, number, number] {
  if (x < 0 || x >= width) return [0, 0, 0, 0];
  const height = data.length / (width * 4);
  if (y < 0 || y >= height) return [0, 0, 0, 0];
  const i = pixelIndex(x, y, width);
  if (i < 0 || i + 3 >= data.length) return [0, 0, 0, 0];
  return [data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!];
}

function readPixel(src: Uint8ClampedArray, i: number): [number, number, number, number] {
  return [src[i]!, src[i + 1]!, src[i + 2]!, src[i + 3]!];
}

function writePixel(dest: Uint8ClampedArray, i: number, r: number, g: number, b: number, a: number): void {
  dest[i] = r;
  dest[i + 1] = g;
  dest[i + 2] = b;
  dest[i + 3] = a;
}

function blendNormal(dest: Uint8ClampedArray, src: Uint8ClampedArray, opacity: number): void {
  for (let i = 0; i < dest.length; i += 4) {
    const [sr, sg, sb, saRaw] = readPixel(src, i);
    const sa = (saRaw / 255) * opacity;
    if (sa === 0) continue;
    const [dr, dg, db, daRaw] = readPixel(dest, i);
    const da = daRaw / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    writePixel(dest, i,
      (sr * sa + dr * da * (1 - sa)) / outA,
      (sg * sa + dg * da * (1 - sa)) / outA,
      (sb * sa + db * da * (1 - sa)) / outA,
      outA * 255,
    );
  }
}

function blendMultiply(dest: Uint8ClampedArray, src: Uint8ClampedArray, opacity: number): void {
  for (let i = 0; i < dest.length; i += 4) {
    const [sr, sg, sb, saRaw] = readPixel(src, i);
    const sa = (saRaw / 255) * opacity;
    if (sa === 0) continue;
    const [dr, dg, db, daRaw] = readPixel(dest, i);
    const da = daRaw / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    writePixel(dest, i,
      ((sr * dr) / 255 * sa + dr * da * (1 - sa)) / outA,
      ((sg * dg) / 255 * sa + dg * da * (1 - sa)) / outA,
      ((sb * db) / 255 * sa + db * da * (1 - sa)) / outA,
      outA * 255,
    );
  }
}

function blendScreen(dest: Uint8ClampedArray, src: Uint8ClampedArray, opacity: number): void {
  for (let i = 0; i < dest.length; i += 4) {
    const [sr, sg, sb, saRaw] = readPixel(src, i);
    const sa = (saRaw / 255) * opacity;
    if (sa === 0) continue;
    const [dr, dg, db, daRaw] = readPixel(dest, i);
    const da = daRaw / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    writePixel(dest, i,
      ((255 - (255 - sr) * (255 - dr) / 255) * sa + dr * da * (1 - sa)) / outA,
      ((255 - (255 - sg) * (255 - dg) / 255) * sa + dg * da * (1 - sa)) / outA,
      ((255 - (255 - sb) * (255 - db) / 255) * sa + db * da * (1 - sa)) / outA,
      outA * 255,
    );
  }
}

function blendOverlay(dest: Uint8ClampedArray, src: Uint8ClampedArray, opacity: number): void {
  for (let i = 0; i < dest.length; i += 4) {
    const [sr, sg, sb, saRaw] = readPixel(src, i);
    const sa = (saRaw / 255) * opacity;
    if (sa === 0) continue;
    const [dr, dg, db, daRaw] = readPixel(dest, i);
    const da = daRaw / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    const blend = (b: number, t: number) => b < 128 ? (2 * t * b) / 255 : 255 - (2 * (255 - t) * (255 - b)) / 255;
    writePixel(dest, i,
      (blend(dr, sr) * sa + dr * da * (1 - sa)) / outA,
      (blend(dg, sg) * sa + dg * da * (1 - sa)) / outA,
      (blend(db, sb) * sa + db * da * (1 - sa)) / outA,
      outA * 255,
    );
  }
}

function blendDarken(dest: Uint8ClampedArray, src: Uint8ClampedArray, opacity: number): void {
  for (let i = 0; i < dest.length; i += 4) {
    const [sr, sg, sb, saRaw] = readPixel(src, i);
    const sa = (saRaw / 255) * opacity;
    if (sa === 0) continue;
    const [dr, dg, db, daRaw] = readPixel(dest, i);
    const da = daRaw / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    writePixel(dest, i,
      (Math.min(sr, dr) * sa + dr * da * (1 - sa)) / outA,
      (Math.min(sg, dg) * sa + dg * da * (1 - sa)) / outA,
      (Math.min(sb, db) * sa + db * da * (1 - sa)) / outA,
      outA * 255,
    );
  }
}

function blendLighten(dest: Uint8ClampedArray, src: Uint8ClampedArray, opacity: number): void {
  for (let i = 0; i < dest.length; i += 4) {
    const [sr, sg, sb, saRaw] = readPixel(src, i);
    const sa = (saRaw / 255) * opacity;
    if (sa === 0) continue;
    const [dr, dg, db, daRaw] = readPixel(dest, i);
    const da = daRaw / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    writePixel(dest, i,
      (Math.max(sr, dr) * sa + dr * da * (1 - sa)) / outA,
      (Math.max(sg, dg) * sa + dg * da * (1 - sa)) / outA,
      (Math.max(sb, db) * sa + db * da * (1 - sa)) / outA,
      outA * 255,
    );
  }
}

function blendDifference(dest: Uint8ClampedArray, src: Uint8ClampedArray, opacity: number): void {
  for (let i = 0; i < dest.length; i += 4) {
    const [sr, sg, sb, saRaw] = readPixel(src, i);
    const sa = (saRaw / 255) * opacity;
    if (sa === 0) continue;
    const [dr, dg, db, daRaw] = readPixel(dest, i);
    const da = daRaw / 255;
    const outA = sa + da * (1 - sa);
    if (outA === 0) continue;
    writePixel(dest, i,
      (Math.abs(dr - sr) * sa + dr * da * (1 - sa)) / outA,
      (Math.abs(dg - sg) * sa + dg * da * (1 - sa)) / outA,
      (Math.abs(db - sb) * sa + db * da * (1 - sa)) / outA,
      outA * 255,
    );
  }
}

function blendAdditive(dest: Uint8ClampedArray, src: Uint8ClampedArray, opacity: number): void {
  for (let i = 0; i < dest.length; i += 4) {
    const [sr, sg, sb, saRaw] = readPixel(src, i);
    const sa = (saRaw / 255) * opacity;
    if (sa === 0) continue;
    const [dr, dg, db, daRaw] = readPixel(dest, i);
    const da = daRaw / 255;
    const outA = Math.min(1, sa + da);
    writePixel(dest, i,
      Math.min(255, dr + sr * sa),
      Math.min(255, dg + sg * sa),
      Math.min(255, db + sb * sa),
      outA * 255,
    );
  }
}

export function clonePixelRegion(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  w: number,
  h: number,
): Uint8ClampedArray {
  const region = new Uint8ClampedArray(w * h * 4);
  for (let row = 0; row < h; row++) {
    const srcRow = y + row;
    if (srcRow < 0 || srcRow >= data.length / (width * 4)) continue;
    const srcStart = (srcRow * width + x) * 4;
    const destStart = row * w * 4;
    const copyLen = Math.min(w, width - x) * 4;
    for (let i = 0; i < copyLen; i++) {
      const val = data[srcStart + i]!;
      region[destStart + i] = val;
    }
  }
  return region;
}

export function pastePixels(
  dest: Uint8ClampedArray,
  destWidth: number,
  src: Uint8ClampedArray,
  srcWidth: number,
  destX: number,
  destY: number,
): void {
  const srcHeight = src.length / (srcWidth * 4);
  for (let row = 0; row < srcHeight; row++) {
    const destRow = destY + row;
    if (destRow < 0 || destRow >= dest.length / (destWidth * 4)) continue;
    const srcStart = row * srcWidth * 4;
    const destStart = (destRow * destWidth + destX) * 4;
    const copyLen = Math.min(srcWidth, destWidth - destX) * 4;
    for (let i = 0; i < copyLen; i++) {
      const val = src[srcStart + i]!;
      dest[destStart + i] = val;
    }
  }
}

export function clearRegion(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const height = data.length / (width * 4);
  for (let row = 0; row < h; row++) {
    const cy = y + row;
    if (cy < 0 || cy >= height) continue;
    const start = (cy * width + x) * 4;
    const end = start + Math.min(w, width - x) * 4;
    for (let i = start; i < end; i++) {
      data[i] = 0;
    }
  }
}

export interface VersionEntry {
  timestamp: number;
  label: string;
  snapshot: SerializedCanvas;
}

export class PixelDocument {
  canvas: PixelCanvas;
  filePath: string;
  dirty: boolean;
  versions: VersionEntry[];
  private autoSaveTimer: ReturnType<typeof setTimeout> | null;
  private onAutoSave: ((doc: PixelDocument) => void) | null;

  constructor(canvas: PixelCanvas, filePath: string = "") {
    this.canvas = canvas;
    this.filePath = filePath;
    this.dirty = false;
    this.versions = [];
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
    this.autoSaveTimer = setTimeout(() => {
      this.autoSave();
    }, 1000);
  }

  private cancelAutoSave(): void {
    if (this.autoSaveTimer !== null) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  private async autoSave(): Promise<void> {
    if (!this.dirty) return;
    const snapshot = this.canvas.serialize();
    this.versions.push({
      timestamp: Date.now(),
      label: `Auto-save at ${new Date().toLocaleTimeString()}`,
      snapshot,
    });
    this.dirty = false;
    this.onAutoSave?.(this);
  }

  createVersionSnapshot(label: string): void {
    const snapshot = this.canvas.serialize();
    this.versions.push({
      timestamp: Date.now(),
      label,
      snapshot,
    });
    if (this.versions.length > 50) {
      this.versions = this.versions.slice(-50);
    }
  }

  revertToVersion(index: number): void {
    if (index < 0 || index >= this.versions.length) return;
    const entry = this.versions[index]!;
    this.canvas = PixelCanvas.deserialize(entry.snapshot);
  }

  getVersionCount(): number {
    return this.versions.length;
  }

  dispose(): void {
    this.cancelAutoSave();
    this.onAutoSave = null;
    this.versions = [];
  }

  serialize(): SerializedDocument {
    return {
      canvas: this.canvas.serialize(),
      filePath: this.filePath,
      versions: this.versions.map((v) => ({
        ...v,
        snapshot: v.snapshot,
      })),
    };
  }

  static deserialize(data: SerializedDocument): PixelDocument {
    const canvas = PixelCanvas.deserialize(data.canvas);
    const doc = new PixelDocument(canvas, data.filePath);
    doc.versions = data.versions.map((v) => ({
      ...v,
      snapshot: v.snapshot,
    }));
    return doc;
  }
}

export interface SerializedDocument {
  canvas: SerializedCanvas;
  filePath: string;
  versions: VersionEntry[];
}
