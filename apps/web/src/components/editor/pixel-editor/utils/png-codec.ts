import { CanvasState } from "./canvas-state";

export async function decodePngToPixelData(buffer: ArrayBuffer): Promise<{
  width: number;
  height: number;
  data: Uint32Array;
}> {
  const blob = new Blob([buffer], { type: "image/png" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas 2d context");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const state = CanvasState.fromImageData(imageData);
    return {
      width: state.width,
      height: state.height,
      data: state.pixels,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function encodePixelDataToPng(
  data: Uint32Array,
  width: number,
  height: number,
): Promise<ArrayBuffer> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas 2d context");
  const state = new CanvasState(width, height, data);
  ctx.putImageData(state.toImageData(), 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode PNG"));
          return;
        }
        blob.arrayBuffer().then(resolve).catch(reject);
      },
      "image/png",
    );
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

export function compositeLayers(
  layers: { data: Uint32Array; visible: boolean; opacity: number }[],
  width: number,
  height: number,
): Uint32Array {
  const result = new Uint32Array(width * height);
  for (const layer of layers) {
    if (!layer.visible || layer.opacity === 0) continue;
    const src = layer.data;
    const opacity = layer.opacity;
    for (let i = 0; i < result.length; i++) {
      const sp = src[i]!;
      const sa = ((sp >> 24) & 0xff) / 255 * opacity;
      if (sa === 0) continue;
      const dp = result[i]!;
      const da = ((dp >> 24) & 0xff) / 255;
      const outA = sa + da * (1 - sa);
      if (outA === 0) continue;
      const sr = sp & 0xff;
      const sg = (sp >> 8) & 0xff;
      const sb = (sp >> 16) & 0xff;
      const dr = dp & 0xff;
      const dg = (dp >> 8) & 0xff;
      const db = (dp >> 16) & 0xff;
      const outR = (sr * sa + dr * da * (1 - sa)) / outA;
      const outG = (sg * sa + dg * da * (1 - sa)) / outA;
      const outB = (sb * sa + db * da * (1 - sa)) / outA;
      result[i] =
        ((Math.round(outA * 255) & 0xff) << 24) |
        ((Math.round(outB) & 0xff) << 16) |
        ((Math.round(outG) & 0xff) << 8) |
        (Math.round(outR) & 0xff);
    }
  }
  return result;
}
