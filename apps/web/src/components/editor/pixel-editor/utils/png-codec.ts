export async function decodePngToPixelData(buffer: ArrayBuffer): Promise<{
  width: number;
  height: number;
  data: Uint8ClampedArray;
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
    return {
      width: img.width,
      height: img.height,
      data: new Uint8ClampedArray(imageData.data),
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function encodePixelDataToPng(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): Promise<ArrayBuffer> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas 2d context");
  const clamped = new Uint8ClampedArray(data);
  const imageData = new ImageData(clamped, width, height);
  ctx.putImageData(imageData, 0, 0);
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
  layers: { data: Uint8ClampedArray; visible: boolean; opacity: number }[],
  width: number,
  height: number,
): Uint8ClampedArray {
  const result = new Uint8ClampedArray(width * height * 4);
  for (const layer of layers) {
    if (!layer.visible || layer.opacity === 0) continue;
    const src = layer.data;
    const opacity = layer.opacity;
    for (let i = 0; i < result.length; i += 4) {
      const sa = (src[i + 3]! / 255) * opacity;
      if (sa === 0) continue;
      const da = result[i + 3]! / 255;
      const outA = sa + da * (1 - sa);
      if (outA === 0) continue;
      result[i] = (src[i]! * sa + result[i]! * da * (1 - sa)) / outA;
      result[i + 1] = (src[i + 1]! * sa + result[i + 1]! * da * (1 - sa)) / outA;
      result[i + 2] = (src[i + 2]! * sa + result[i + 2]! * da * (1 - sa)) / outA;
      result[i + 3] = outA * 255;
    }
  }
  return result;
}
