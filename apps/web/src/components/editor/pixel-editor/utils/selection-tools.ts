import type { CanvasState } from "./canvas-state";
import { colorMatchUint32, TRANSPARENT, hexToUint32 } from "./canvas-state";

export function createSelectionMask(width: number, height: number, rects: { x: number; y: number; w: number; h: number }[]): Uint8Array {
  const mask = new Uint8Array(width * height);
  for (const r of rects) {
    for (let y = r.y; y < r.y + r.h; y++) {
      if (y < 0 || y >= height) continue;
      for (let x = r.x; x < r.x + r.w; x++) {
        if (x < 0 || x >= width) continue;
        mask[y * width + x] = 1;
      }
    }
  }
  return mask;
}

export function createRectMask(width: number, height: number, x0: number, y0: number, x1: number, y1: number): Uint8Array {
  const minX = Math.max(0, Math.min(x0, x1));
  const maxX = Math.min(width - 1, Math.max(x0, x1));
  const minY = Math.max(0, Math.min(y0, y1));
  const maxY = Math.min(height - 1, Math.max(y0, y1));
  const mask = new Uint8Array(width * height);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      mask[y * width + x] = 1;
    }
  }
  return mask;
}

export function createEllipseMask(width: number, height: number, cx: number, cy: number, rx: number, ry: number): Uint8Array {
  const mask = new Uint8Array(width * height);
  const absRx = Math.abs(rx);
  const absRy = Math.abs(ry);
  if (absRx === 0 && absRy === 0) {
    if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
      mask[cy * width + cx] = 1;
    }
    return mask;
  }
  const rxs = absRx * absRx;
  const rys = absRy * absRy;
  for (let y = Math.max(0, cy - absRy); y <= Math.min(height - 1, cy + absRy); y++) {
    for (let x = Math.max(0, cx - absRx); x <= Math.min(width - 1, cx + absRx); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if ((dx * dx) / rxs + (dy * dy) / rys <= 1) {
        mask[y * width + x] = 1;
      }
    }
  }
  return mask;
}

export function createLassoMask(width: number, height: number, points: [number, number][]): Uint8Array {
  if (points.length < 3) return new Uint8Array(width * height);
  const mask = new Uint8Array(width * height);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.max(0, Math.floor(Math.min(...xs)));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(...xs)));
  const minY = Math.max(0, Math.floor(Math.min(...ys)));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(...ys)));

  for (let y = minY; y <= maxY; y++) {
    const intersections: number[] = [];
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const xi = points[i]![0];
      const yi = points[i]![1];
      const xj = points[j]![0];
      const yj = points[j]![1];
      if ((yi <= y && yj > y) || (yj <= y && yi > y)) {
        const x = xi + ((y - yi) / (yj - yi)) * (xj - xi);
        intersections.push(x);
      }
    }
    intersections.sort((a, b) => a - b);
    for (let i = 0; i + 1 < intersections.length; i += 2) {
      const xStart = Math.max(minX, Math.floor(intersections[i]!));
      const xEnd = Math.min(maxX, Math.ceil(intersections[i + 1]!));
      for (let x = xStart; x <= xEnd; x++) {
        mask[y * width + x] = 1;
      }
    }
  }
  return mask;
}

export function createPolygonMask(width: number, height: number, points: [number, number][]): Uint8Array {
  return createLassoMask(width, height, points);
}

export function magicWandMask(canvas: CanvasState, sx: number, sy: number, tolerance: number): Uint8Array {
  const { width, height } = canvas;
  const mask = new Uint8Array(width * height);
  if (sx < 0 || sx >= width || sy < 0 || sy >= height) return mask;
  const targetColor = canvas.getPixel(sx, sy);
  const visited = new Uint8Array(width * height);
  const stack: [number, number][] = [[sx, sy]];
  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;
    if (!colorMatchUint32(canvas.getPixel(x, y), targetColor, tolerance)) continue;
    mask[idx] = 1;
    if (x > 0) stack.push([x - 1, y]);
    if (x < width - 1) stack.push([x + 1, y]);
    if (y > 0) stack.push([x, y - 1]);
    if (y < height - 1) stack.push([x, y + 1]);
  }
  return mask;
}

export function colorSelectMask(canvas: CanvasState, sx: number, sy: number, tolerance: number): Uint8Array {
  const { width, height } = canvas;
  const mask = new Uint8Array(width * height);
  if (sx < 0 || sx >= width || sy < 0 || sy >= height) return mask;
  const targetColor = canvas.getPixel(sx, sy);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (colorMatchUint32(canvas.getPixel(x, y), targetColor, tolerance)) {
        mask[y * width + x] = 1;
      }
    }
  }
  return mask;
}

export function combineMasks(existing: Uint8Array | null, newMask: Uint8Array, mode: "new" | "add" | "subtract" | "intersect"): Uint8Array {
  if (!existing || mode === "new") return new Uint8Array(newMask);
  const result = new Uint8Array(existing.length);
  for (let i = 0; i < result.length; i++) {
    switch (mode) {
      case "add":
        result[i] = existing[i]! || newMask[i]! ? 1 : 0;
        break;
      case "subtract":
        result[i] = existing[i]! && !newMask[i]! ? 1 : 0;
        break;
      case "intersect":
        result[i] = existing[i]! && newMask[i]! ? 1 : 0;
        break;
    }
  }
  return result;
}

export function getMaskBounds(mask: Uint8Array, width: number, height: number): { x: number; y: number; w: number; h: number } | null {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let hasSelection = false;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (mask[y * width + x]) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        hasSelection = true;
      }
    }
  }
  if (!hasSelection) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

export function getMaskBoundaryPoints(mask: Uint8Array, width: number, height: number): [number, number][] {
  const points: [number, number][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) continue;
      if (x === 0 || !mask[y * width + (x - 1)]) points.push([x, y]);
      if (x === width - 1 || !mask[y * width + (x + 1)]) points.push([x + 1, y]);
      if (y === 0 || !mask[(y - 1) * width + x]) points.push([x, y]);
      if (y === height - 1 || !mask[(y + 1) * width + x]) points.push([x, y + 1]);
    }
  }
  return points;
}

export function expandMask(mask: Uint8Array, width: number, height: number, pixels: number): Uint8Array {
  const result = new Uint8Array(mask);
  for (let iter = 0; iter < pixels; iter++) {
    const current = new Uint8Array(result);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (current[y * width + x]) continue;
        if (x > 0 && current[y * width + (x - 1)]) { result[y * width + x] = 1; continue; }
        if (x < width - 1 && current[y * width + (x + 1)]) { result[y * width + x] = 1; continue; }
        if (y > 0 && current[(y - 1) * width + x]) { result[y * width + x] = 1; continue; }
        if (y < height - 1 && current[(y + 1) * width + x]) { result[y * width + x] = 1; continue; }
      }
    }
  }
  return result;
}

export function shrinkMask(mask: Uint8Array, width: number, height: number, pixels: number): Uint8Array {
  const result = new Uint8Array(mask);
  for (let iter = 0; iter < pixels; iter++) {
    const current = new Uint8Array(result);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!current[y * width + x]) continue;
        if (x === 0 || !current[y * width + (x - 1)]) { result[y * width + x] = 0; continue; }
        if (x === width - 1 || !current[y * width + (x + 1)]) { result[y * width + x] = 0; continue; }
        if (y === 0 || !current[(y - 1) * width + x]) { result[y * width + x] = 0; continue; }
        if (y === height - 1 || !current[(y + 1) * width + x]) { result[y * width + x] = 0; continue; }
      }
    }
  }
  return result;
}

export function featherMask(mask: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  const result = new Uint8Array(mask);
  if (radius <= 0) return result;
  const kernelSize = radius * 2 + 1;
  const kernel = new Float32Array(kernelSize * kernelSize);
  let kernelSum = 0;
  for (let ky = -radius; ky <= radius; ky++) {
    for (let kx = -radius; kx <= radius; kx++) {
      const val = Math.exp(-(kx * kx + ky * ky) / (2 * radius));
      kernel[(ky + radius) * kernelSize + (kx + radius)] = val;
      kernelSum += val;
    }
  }
  for (let i = 0; i < kernel.length; i++) kernel[i]! /= kernelSum;
  const temp = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const px = x + kx;
          const py = y + ky;
          if (px >= 0 && px < width && py >= 0 && py < height) {
            sum += mask[py * width + px]! * kernel[(ky + radius) * kernelSize + (kx + radius)]!;
          }
        }
      }
      temp[y * width + x] = sum;
    }
  }
  for (let i = 0; i < result.length; i++) {
    result[i] = temp[i]! >= 0.5 ? 1 : 0;
  }
  return result;
}

export function invertMask(mask: Uint8Array): Uint8Array {
  const result = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) {
    result[i] = mask[i] ? 0 : 1;
  }
  return result;
}

export function isSelectionActive(mask: Uint8Array | null): boolean {
  if (!mask) return false;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) return true;
  }
  return false;
}

export function deleteSelectedPixels(canvas: CanvasState, mask: Uint8Array): void {
  const { width, height } = canvas;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (mask[y * width + x]) {
        canvas.setPixelAtIndex(y * width + x, TRANSPARENT);
      }
    }
  }
}

export function fillSelectedPixels(canvas: CanvasState, mask: Uint8Array, color: string): void {
  const uint32Color = hexToUint32(color);
  const { width, height } = canvas;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (mask[y * width + x]) {
        canvas.setPixelAtIndex(y * width + x, uint32Color);
      }
    }
  }
}

export function extractSelectionContent(canvas: CanvasState, mask: Uint8Array): { data: Uint32Array; width: number; height: number } {
  const { width, height } = canvas;
  const bounds = getMaskBounds(mask, width, height);
  if (!bounds) return { data: new Uint32Array(0), width: 0, height: 0 };
  const { x, y, w, h } = bounds;
  const result = new Uint32Array(w * h);
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const srcX = x + col;
      const srcY = y + row;
      const srcIdx = srcY * width + srcX;
      const destIdx = row * w + col;
      result[destIdx] = mask[srcY * width + srcX] ? canvas.getPixelAtIndex(srcIdx) : TRANSPARENT;
    }
  }
  return { data: result, width: w, height: h };
}

export function pasteSelectionContent(dest: CanvasState, src: Uint32Array, srcWidth: number, destX: number, destY: number): void {
  const srcHeight = src.length / srcWidth;
  const destWidth = dest.width;
  const destHeight = dest.height;
  for (let row = 0; row < srcHeight; row++) {
    for (let col = 0; col < srcWidth; col++) {
      const srcIdx = row * srcWidth + col;
      const color = src[srcIdx]!;
      if (color === TRANSPARENT) continue;
      const dx = destX + col;
      const dy = destY + row;
      if (dx < 0 || dx >= destWidth || dy < 0 || dy >= destHeight) continue;
      dest.setPixelAtIndex(dy * destWidth + dx, color);
    }
  }
}
