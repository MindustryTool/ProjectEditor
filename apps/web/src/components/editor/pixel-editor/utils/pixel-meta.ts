import type { SerializedLayer, BlendMode, SerializedCanvas } from "./pixel-canvas";

export interface MetaLayer {
  id: string;
  name: string;
  pixelData: string;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  locked: boolean;
  children: MetaLayer[];
  expanded: boolean;
}

export interface DeserializedMetaLayer {
  id: string;
  name: string;
  pixelData: Uint8ClampedArray;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  locked: boolean;
  children: DeserializedMetaLayer[];
  expanded: boolean;
}

export interface MetaUiConfig {
  foregroundColor: string;
  backgroundColor: string;
  tool: string;
  brushSize: number;
  brushOpacity: number;
  tolerance: number;
  sprayDensity: number;
  sprayRadius: number;
  pixelPerfect: boolean;
  symmetry: string;
  symmetrySegments: number;
  gridVisible: boolean;
  pixelGridVisible: boolean;
  rulersVisible: boolean;
  guidesVisible: boolean;
  layerBoundsVisible: boolean;
  onionSkinVisible: boolean;
  checkerboardVisible: boolean;
  brushFlow?: number;
  brushHardness?: number;
  brushShape?: string;
}

export interface CompanionFile {
  version: number;
  layers: MetaLayer[];
  uiConfig: MetaUiConfig;
}

export interface DeserializedCompanionFile {
  version: number;
  layers: DeserializedMetaLayer[];
  uiConfig: MetaUiConfig;
}

const CURRENT_VERSION = 2;

function uint32ToUint8ClampedArray(pixels: number[], width: number, height: number): Uint8ClampedArray {
  const result = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < pixels.length; i++) {
    const p = pixels[i]!;
    const off = i * 4;
    result[off] = p & 0xff;
    result[off + 1] = (p >> 8) & 0xff;
    result[off + 2] = (p >> 16) & 0xff;
    result[off + 3] = (p >> 24) & 0xff;
  }
  return result;
}

function arrayBufferToBase64(data: Uint8ClampedArray): string {
  let binary = "";
  const bytes = new Uint8Array(data);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): Uint8ClampedArray {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Uint8ClampedArray(bytes);
}

function serializeMetaLayer(l: SerializedLayer): MetaLayer {
  return {
    id: l.id,
    name: l.name,
    pixelData: arrayBufferToBase64(uint32ToUint8ClampedArray(l.canvas.pixels, l.canvas.width, l.canvas.height)),
    visible: l.visible,
    opacity: l.opacity,
    blendMode: l.blendMode,
    locked: l.locked,
    children: (l.children ?? []).map((c) => serializeMetaLayer(c)),
    expanded: l.expanded ?? true,
  };
}

function deserializeMetaLayer(l: MetaLayer): DeserializedMetaLayer {
  return {
    ...l,
    pixelData: base64ToArrayBuffer(l.pixelData),
    children: (l.children ?? []).map((c) => deserializeMetaLayer(c)),
  };
}

export function serializeMeta(
  canvas: SerializedCanvas,
  uiConfig: MetaUiConfig,
): string {
  const file: CompanionFile = {
    version: CURRENT_VERSION,
    layers: canvas.layers.map((l) => serializeMetaLayer(l)),
    uiConfig,
  };
  return JSON.stringify(file);
}

export function deserializeMeta(json: string): DeserializedCompanionFile | null {
  try {
    const file = JSON.parse(json) as CompanionFile;
    if (!file.version || !file.layers) return null;
    if (file.version < CURRENT_VERSION) {
      return null;
    }
    const deserialized: DeserializedCompanionFile = {
      version: file.version,
      layers: file.layers.map((l) => deserializeMetaLayer(l)),
      uiConfig: file.uiConfig,
    };
    return deserialized;
  } catch {
    return null;
  }
}

export function getMetaPath(pngPath: string): string {
  return `${pngPath}.meta`;
}
