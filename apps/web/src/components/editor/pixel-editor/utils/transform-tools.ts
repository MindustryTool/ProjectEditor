import { pixelIndex } from "../utils/canvas-state";

export type ScaleFilter = "nearest-neighbor";

export interface TransformRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function scaleContent(
  data: Uint32Array,
  srcWidth: number,
  srcHeight: number,
  scaleX: number,
  scaleY: number,
  filter: ScaleFilter = "nearest-neighbor",
): { data: Uint32Array; width: number; height: number } {
  const dstWidth = Math.max(1, Math.round(srcWidth * scaleX));
  const dstHeight = Math.max(1, Math.round(srcHeight * scaleY));
  const result = new Uint32Array(dstWidth * dstHeight);

  if (filter === "nearest-neighbor") {
    for (let dy = 0; dy < dstHeight; dy++) {
      for (let dx = 0; dx < dstWidth; dx++) {
        const sx = Math.floor((dx / dstWidth) * srcWidth);
        const sy = Math.floor((dy / dstHeight) * srcHeight);
        const si = pixelIndex(sx, sy, srcWidth);
        const di = pixelIndex(dx, dy, dstWidth);
        result[di] = data[si]!;
      }
    }
  }

  return { data: result, width: dstWidth, height: dstHeight };
}

export function rotateContent(
  data: Uint32Array,
  srcWidth: number,
  srcHeight: number,
  angleDeg: number,
): { data: Uint32Array; width: number; height: number } {
  const angle = ((angleDeg % 360) + 360) % 360;
  const quad = Math.round(angle / 90) % 4;

  switch (quad) {
    case 0:
      return { data: new Uint32Array(data), width: srcWidth, height: srcHeight };
    case 1:
      return rotate90CW(data, srcWidth, srcHeight);
    case 2:
      return rotate180(data, srcWidth, srcHeight);
    case 3:
      return rotate90CCW(data, srcWidth, srcHeight);
    default:
      return { data: new Uint32Array(data), width: srcWidth, height: srcHeight };
  }
}

export function rotate90CW(
  data: Uint32Array,
  srcWidth: number,
  srcHeight: number,
): { data: Uint32Array; width: number; height: number } {
  const dstWidth = srcHeight;
  const dstHeight = srcWidth;
  const result = new Uint32Array(dstWidth * dstHeight);
  for (let sy = 0; sy < srcHeight; sy++) {
    for (let sx = 0; sx < srcWidth; sx++) {
      const dx = dstWidth - 1 - sy;
      const dy = sx;
      const si = pixelIndex(sx, sy, srcWidth);
      const di = pixelIndex(dx, dy, dstWidth);
      result[di] = data[si]!;
    }
  }
  return { data: result, width: dstWidth, height: dstHeight };
}

export function rotate90CCW(
  data: Uint32Array,
  srcWidth: number,
  srcHeight: number,
): { data: Uint32Array; width: number; height: number } {
  const dstWidth = srcHeight;
  const dstHeight = srcWidth;
  const result = new Uint32Array(dstWidth * dstHeight);
  for (let sy = 0; sy < srcHeight; sy++) {
    for (let sx = 0; sx < srcWidth; sx++) {
      const dx = sy;
      const dy = dstHeight - 1 - sx;
      const si = pixelIndex(sx, sy, srcWidth);
      const di = pixelIndex(dx, dy, dstWidth);
      result[di] = data[si]!;
    }
  }
  return { data: result, width: dstWidth, height: dstHeight };
}

export function rotate180(
  data: Uint32Array,
  srcWidth: number,
  srcHeight: number,
): { data: Uint32Array; width: number; height: number } {
  const result = new Uint32Array(data.length);
  for (let sy = 0; sy < srcHeight; sy++) {
    for (let sx = 0; sx < srcWidth; sx++) {
      const dx = srcWidth - 1 - sx;
      const dy = srcHeight - 1 - sy;
      const si = pixelIndex(sx, sy, srcWidth);
      const di = pixelIndex(dx, dy, srcWidth);
      result[di] = data[si]!;
    }
  }
  return { data: result, width: srcWidth, height: srcHeight };
}

export function flipHorizontal(
  data: Uint32Array,
  srcWidth: number,
): Uint32Array {
  const srcHeight = data.length / srcWidth;
  const result = new Uint32Array(data.length);
  for (let sy = 0; sy < srcHeight; sy++) {
    for (let sx = 0; sx < srcWidth; sx++) {
      const dx = srcWidth - 1 - sx;
      const dy = sy;
      const si = pixelIndex(sx, sy, srcWidth);
      const di = pixelIndex(dx, dy, srcWidth);
      result[di] = data[si]!;
    }
  }
  return result;
}

export function flipVertical(
  data: Uint32Array,
  srcWidth: number,
): Uint32Array {
  const srcHeight = data.length / srcWidth;
  const result = new Uint32Array(data.length);
  for (let sy = 0; sy < srcHeight; sy++) {
    for (let sx = 0; sx < srcWidth; sx++) {
      const dx = sx;
      const dy = srcHeight - 1 - sy;
      const si = pixelIndex(sx, sy, srcWidth);
      const di = pixelIndex(dx, dy, srcWidth);
      result[di] = data[si]!;
    }
  }
  return result;
}

export function applyScaledContentToLayer(
  layerData: Uint32Array,
  layerWidth: number,
  scaledData: Uint32Array,
  scaledWidth: number,
  scaledHeight: number,
  destX: number,
  destY: number,
): void {
  const layerHeight = layerData.length / layerWidth;
  for (let row = 0; row < scaledHeight; row++) {
    for (let col = 0; col < scaledWidth; col++) {
      const dx = destX + col;
      const dy = destY + row;
      if (dx < 0 || dx >= layerWidth || dy < 0 || dy >= layerHeight) continue;
      const si = pixelIndex(col, row, scaledWidth);
      const di = pixelIndex(dx, dy, layerWidth);
      layerData[di] = scaledData[si]!;
    }
  }
}

export function getTransformHandles(bounds: { x: number; y: number; w: number; h: number }): { corners: [number, number][]; edges: [number, number][] } {
  const { x, y, w, h } = bounds;
  const corners: [number, number][] = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
  const edges: [number, number][] = [
    [x + w / 2, y],
    [x + w, y + h / 2],
    [x + w / 2, y + h],
    [x, y + h / 2],
  ];
  return { corners, edges };
}

export function snapToIntegerFactor(scale: number): number {
  const factor = Math.round(scale);
  return factor >= 1 ? factor : 1 / Math.round(1 / scale);
}

export function constrainScaleToInteger(src: number, dest: number): number {
  const ratio = dest / src;
  if (ratio >= 1) {
    return Math.max(1, Math.round(ratio));
  }
  const inv = src / dest;
  return 1 / Math.max(1, Math.round(inv));
}
