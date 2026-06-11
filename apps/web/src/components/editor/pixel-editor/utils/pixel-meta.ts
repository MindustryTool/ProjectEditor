import type { SerializedCanvas, BlendMode } from "./pixel-canvas";

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

export interface MetaHistoryEntry {
  name: string;
  snapshot: SerializedCanvas;
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
  currentLayerIndex: number;
  currentLayerId: string;
  palette: string[];
  lockedColors: number[];
}

export interface CompanionFile {
  version: number;
  layers: MetaLayer[];
  history: {
    undoStack: MetaHistoryEntry[];
    redoStack: MetaHistoryEntry[];
  };
  uiConfig: MetaUiConfig;
}

export interface DeserializedCompanionFile {
  version: number;
  layers: DeserializedMetaLayer[];
  history: {
    undoStack: MetaHistoryEntry[];
    redoStack: MetaHistoryEntry[];
  };
  uiConfig: MetaUiConfig;
}

const CURRENT_VERSION = 1;
const MAX_HISTORY = 50;

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

function serializeMetaLayer(l: SerializedCanvas["layers"][number]): MetaLayer {
  return {
    id: l.id,
    name: l.name,
    pixelData: arrayBufferToBase64(new Uint8ClampedArray(l.data)),
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
  history: { undoStack: { name: string; snapshot: SerializedCanvas }[]; redoStack: { name: string; snapshot: SerializedCanvas }[] },
  uiConfig: MetaUiConfig,
): string {
  const file: CompanionFile = {
    version: CURRENT_VERSION,
    layers: canvas.layers.map((l) => serializeMetaLayer(l)),
    history: {
      undoStack: history.undoStack.slice(-MAX_HISTORY).map((e) => ({
        name: e.name,
        snapshot: e.snapshot,
      })),
      redoStack: history.redoStack.slice(-MAX_HISTORY).map((e) => ({
        name: e.name,
        snapshot: e.snapshot,
      })),
    },
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
      history: file.history,
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
