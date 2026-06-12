export interface PixelChange {
  index: number;
  before: number;
  after: number;
}

export interface PendingTransaction {
  name: string;
  changes: Map<number, PixelChange>;
}

export interface PixelHistoryEntry {
  type: "pixel";
  id: string;
  name: string;
  timestamp: number;
  changes: PixelChange[];
  layerId: string;
}

export interface LayerHistoryEntry {
  type: "layer";
  id: string;
  name: string;
  timestamp: number;
  before: SerializedLayerSnapshot | null;
  after: SerializedLayerSnapshot | null;
  layerId: string;
}

export interface GroupHistoryEntry {
  type: "group";
  id: string;
  name: string;
  timestamp: number;
  before: SerializedGroupSnapshot | null;
  after: SerializedGroupSnapshot | null;
  groupId: string;
}

export interface CanvasHistoryEntry {
  type: "canvas";
  id: string;
  name: string;
  timestamp: number;
  before: { width: number; height: number; serializedLayers: SerializedLayerSnapshot[] };
  after: { width: number; height: number; serializedLayers: SerializedLayerSnapshot[] };
}

export type HistoryEntry = PixelHistoryEntry | LayerHistoryEntry | GroupHistoryEntry | CanvasHistoryEntry;

export interface SerializedLayerSnapshot {
  id: string;
  name: string;
  pixels: number[];
  width: number;
  height: number;
  visible: boolean;
  opacity: number;
  blendMode: string;
  locked: boolean;
  children: SerializedLayerSnapshot[];
  expanded: boolean;
}

export interface SerializedGroupSnapshot {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
  locked: boolean;
  children: SerializedLayerSnapshot[];
  expanded: boolean;
}

export interface SerializedCanvasState {
  width: number;
  height: number;
  pixels: number[];
}

export const TRANSPARENT = 0x00000000;

export function pixelIndex(x: number, y: number, width: number): number {
  return y * width + x;
}

export function hexToUint32(hex: string): number {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0]! + clean[0]!, 16);
    const g = parseInt(clean[1]! + clean[1]!, 16);
    const b = parseInt(clean[2]! + clean[2]!, 16);
    return (0xff000000 | (b << 16) | (g << 8) | r) >>> 0;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return (0xff000000 | (b << 16) | (g << 8) | r) >>> 0;
  }
  if (clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    const a = parseInt(clean.slice(6, 8), 16);
    return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
  }
  return 0xff000000;
}

export function uint32ToRgba(pixel: number): { r: number; g: number; b: number; a: number } {
  return {
    a: (pixel >> 24) & 0xff,
    r: pixel & 0xff,
    g: (pixel >> 8) & 0xff,
    b: (pixel >> 16) & 0xff,
  };
}

export function rgbaToUint32(r: number, g: number, b: number, a: number): number {
  return (((a & 0xff) << 24) | ((b & 0xff) << 16) | ((g & 0xff) << 8) | (r & 0xff)) >>> 0;
}

export function uint32ToHex(pixel: number): string {
  const a = (pixel >> 24) & 0xff;
  const r = pixel & 0xff;
  const g = (pixel >> 8) & 0xff;
  const b = (pixel >> 16) & 0xff;
  if (a < 255) {
    return `#${[r, g, b, a].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  }
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  return uint32ToRgba(hexToUint32(hex));
}

export function rgbaToHex(r: number, g: number, b: number, a?: number): string {
  if (a !== undefined && a < 255) {
    return `#${[r, g, b, a].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  }
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export class CanvasState {
  width: number;
  height: number;
  pixels: Uint32Array;
  private _changes: Map<number, number> | null = null;

  constructor(width: number, height: number, pixels?: Uint32Array) {
    this.width = width;
    this.height = height;
    this.pixels = pixels ?? new Uint32Array(width * height);
  }

  get length(): number {
    return this.pixels.length;
  }

  getPixelIndex(x: number, y: number): number {
    return y * this.width + x;
  }

  getPixel(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return TRANSPARENT;
    return this.pixels[y * this.width + x]!;
  }

  getPixelAtIndex(index: number): number {
    if (index < 0 || index >= this.pixels.length) return TRANSPARENT;
    return this.pixels[index]!;
  }

  setPixel(x: number, y: number, color: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = y * this.width + x;
    this.setPixelAtIndex(idx, color);
  }

  setPixelAtIndex(index: number, color: number): void {
    if (index < 0 || index >= this.pixels.length) return;
    if (this._changes && !this._changes.has(index)) {
      this._changes.set(index, this.pixels[index]!);
    }
    this.pixels[index] = color;
  }

  beginRecord(): void {
    this._changes = new Map();
  }

  endRecord(name: string, layerId?: string): HistoryEntry {
    const changes: PixelChange[] = [];
    if (this._changes) {
      for (const [index, before] of this._changes) {
        changes.push({ index, before, after: this.pixels[index]! });
      }
    }
    this._changes = null;
    return {
      type: "pixel",
      id: crypto.randomUUID(),
      name,
      timestamp: Date.now(),
      changes,
      layerId: layerId ?? "",
    };
  }

  rollbackRecord(): void {
    if (!this._changes) return;
    for (const [index, before] of this._changes) {
      this.pixels[index] = before!;
    }
    this._changes = null;
  }

  isRecording(): boolean {
    return this._changes !== null;
  }

  clear(color: number = TRANSPARENT): void {
    this.pixels.fill(color);
    if (this._changes) {
      this._changes.clear();
    }
  }

  clone(): CanvasState {
    const clone = new CanvasState(this.width, this.height);
    clone.pixels.set(this.pixels);
    return clone;
  }

  toImageData(): ImageData {
    const data = new Uint8ClampedArray(this.width * this.height * 4);
    for (let i = 0; i < this.pixels.length; i++) {
      const p = this.pixels[i]!;
      data[i * 4] = p & 0xff;
      data[i * 4 + 1] = (p >> 8) & 0xff;
      data[i * 4 + 2] = (p >> 16) & 0xff;
      data[i * 4 + 3] = (p >> 24) & 0xff;
    }
    return new ImageData(data, this.width, this.height);
  }

  static fromImageData(imageData: ImageData): CanvasState {
    const canvas = new CanvasState(imageData.width, imageData.height);
    const data = imageData.data;
    for (let i = 0; i < canvas.pixels.length; i++) {
      const di = i * 4;
      canvas.pixels[i] = ((data[di + 3]! & 0xff) << 24) | ((data[di + 2]! & 0xff) << 16) | ((data[di + 1]! & 0xff) << 8) | (data[di]! & 0xff);
    }
    return canvas;
  }

  serialize(): SerializedCanvasState {
    return {
      width: this.width,
      height: this.height,
      pixels: Array.from(this.pixels),
    };
  }

  static deserialize(data: SerializedCanvasState): CanvasState {
    return new CanvasState(data.width, data.height, new Uint32Array(data.pixels));
  }
}

export function colorMatchUint32(a: number, b: number, tolerance: number): boolean {
  if (tolerance === 0) return a === b;
  const ar = a & 0xff;
  const ag = (a >> 8) & 0xff;
  const ab = (a >> 16) & 0xff;
  const aa = (a >> 24) & 0xff;
  const br = b & 0xff;
  const bg = (b >> 8) & 0xff;
  const bb = (b >> 16) & 0xff;
  const ba = (b >> 24) & 0xff;
  const dr = ar - br;
  const dg = ag - bg;
  const db = ab - bb;
  const da = aa - ba;
  return Math.sqrt(dr * dr + dg * dg + db * db + da * da) <= tolerance;
}

export function cloneRegion(
  src: CanvasState,
  x: number,
  y: number,
  w: number,
  h: number,
): Uint32Array {
  const region = new Uint32Array(w * h);
  for (let row = 0; row < h; row++) {
    const srcRow = y + row;
    if (srcRow < 0 || srcRow >= src.height) continue;
    const srcStart = srcRow * src.width + x;
    const destStart = row * w;
    const copyLen = Math.min(w, src.width - x);
    for (let i = 0; i < copyLen; i++) {
      region[destStart + i] = src.pixels[srcStart + i]!;
    }
  }
  return region;
}

export function pasteRegion(
  dest: CanvasState,
  src: Uint32Array,
  srcWidth: number,
  destX: number,
  destY: number,
): void {
  const srcHeight = src.length / srcWidth;
  for (let row = 0; row < srcHeight; row++) {
    const destRow = destY + row;
    if (destRow < 0 || destRow >= dest.height) continue;
    const srcStart = row * srcWidth;
    const destStart = destRow * dest.width + destX;
    const copyLen = Math.min(srcWidth, dest.width - destX);
    for (let i = 0; i < copyLen; i++) {
      dest.pixels[destStart + i] = src[srcStart + i]!;
    }
  }
}

export function clearRegion(
  canvas: CanvasState,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  for (let row = 0; row < h; row++) {
    const cy = y + row;
    if (cy < 0 || cy >= canvas.height) continue;
    const start = cy * canvas.width + x;
    const end = start + Math.min(w, canvas.width - x);
    for (let i = start; i < end; i++) {
      canvas.pixels[i] = TRANSPARENT;
    }
  }
}
