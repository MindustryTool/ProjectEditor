import type { CanvasState } from "./canvas-state";
import { hexToUint32, rgbaToUint32, uint32ToRgba, colorMatchUint32 } from "./canvas-state";

export function drawPixel(
  canvas: CanvasState,
  x: number,
  y: number,
  color: string,
): void {
  canvas.setPixel(x, y, hexToUint32(color));
}

export function drawLine(
  canvas: CanvasState,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
): void {
  const uint32Color = hexToUint32(color);
  const width = canvas.width;
  const height = canvas.height;
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let cx = x0;
  let cy = y0;
  while (true) {
    if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
      canvas.setPixel(cx, cy, uint32Color);
    }
    if (cx === x1 && cy === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; cx += sx; }
    if (e2 <= dx) { err += dx; cy += sy; }
  }
}

export function drawCircle(
  canvas: CanvasState,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  filled: boolean,
): void {
  const uint32Color = hexToUint32(color);
  const width = canvas.width;
  const height = canvas.height;
  if (filled) {
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y <= radius * radius) {
          const px = cx + x;
          const py = cy + y;
          if (px >= 0 && px < width && py >= 0 && py < height) {
            canvas.setPixel(px, py, uint32Color);
          }
        }
      }
    }
  } else {
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;
    while (y >= x) {
      const pts = [
        [cx + x, cy + y], [cx - x, cy + y], [cx + x, cy - y], [cx - x, cy - y],
        [cx + y, cy + x], [cx - y, cy + x], [cx + y, cy - x], [cx - y, cy - x],
      ] as const;
      for (const pt of pts) {
        const px = pt[0]; const py = pt[1];
        if (px >= 0 && px < width && py >= 0 && py < height) canvas.setPixel(px, py, uint32Color);
      }
      x++;
      if (d > 0) { y--; d = d + 4 * (x - y) + 10; }
      else { d = d + 4 * x + 6; }
    }
  }
}

export function drawEllipse(
  canvas: CanvasState,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color: string,
  filled: boolean,
): void {
  const uint32Color = hexToUint32(color);
  const width = canvas.width;
  const height = canvas.height;
  if (filled) {
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) {
          const px = cx + x;
          const py = cy + y;
          if (px >= 0 && px < width && py >= 0 && py < height) canvas.setPixel(px, py, uint32Color);
        }
      }
    }
  } else {
    let x = 0;
    let y = ry;
    const rx2 = rx * rx;
    const ry2 = ry * ry;
    let d = ry2 - rx2 * ry + rx2 / 4;
    while (ry2 * x < rx2 * y) {
      const pts = [[cx + x, cy + y], [cx - x, cy + y], [cx + x, cy - y], [cx - x, cy - y]] as const;
      for (const pt of pts) {
        const px = pt[0]!, py = pt[1]!;
        if (px >= 0 && px < width && py >= 0 && py < height) canvas.setPixel(px, py, uint32Color);
      }
      x++;
      if (d < 0) d += 2 * ry2 * x + ry2;
      else { y--; d += 2 * ry2 * x - 2 * rx2 * y + ry2; }
    }
    d = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;
    while (y >= 0) {
      const pts = [[cx + x, cy + y], [cx - x, cy + y], [cx + x, cy - y], [cx - x, cy - y]] as const;
      for (const pt of pts) {
        const px = pt[0]!, py = pt[1]!;
        if (px >= 0 && px < width && py >= 0 && py < height) canvas.setPixel(px, py, uint32Color);
      }
      y--;
      if (d > 0) d += rx2 - 2 * rx2 * y;
      else { x++; d += 2 * ry2 * x - 2 * rx2 * y + rx2; }
    }
  }
}

export function drawRectangle(
  canvas: CanvasState,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  filled: boolean,
): void {
  const uint32Color = hexToUint32(color);
  const width = canvas.width;
  const height = canvas.height;
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);
  if (filled) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) canvas.setPixel(x, y, uint32Color);
      }
    }
  } else {
    for (let x = minX; x <= maxX; x++) {
      if (x >= 0 && x < width && minY >= 0 && minY < height) canvas.setPixel(x, minY, uint32Color);
      if (x >= 0 && x < width && maxY >= 0 && maxY < height) canvas.setPixel(x, maxY, uint32Color);
    }
    for (let y = minY + 1; y < maxY; y++) {
      if (minX >= 0 && minX < width && y >= 0 && y < height) canvas.setPixel(minX, y, uint32Color);
      if (maxX >= 0 && maxX < width && y >= 0 && y < height) canvas.setPixel(maxX, y, uint32Color);
    }
  }
}

export function floodFill(
  canvas: CanvasState,
  startX: number,
  startY: number,
  fillColor: string,
  tolerance: number,
): void {
  const fill = hexToUint32(fillColor);
  const width = canvas.width;
  const height = canvas.height;
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;
  const targetColor = canvas.getPixel(startX, startY);
  if (targetColor === fill) return;
  const visited = new Uint8Array(width * height);
  const stack: [number, number][] = [[startX, startY]];
  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;
    const currentColor = canvas.getPixel(x, y);
    if (!colorMatchUint32(currentColor, targetColor, tolerance)) continue;
    canvas.setPixel(x, y, fill);
    if (x > 0) stack.push([x - 1, y]);
    if (x < width - 1) stack.push([x + 1, y]);
    if (y > 0) stack.push([x, y - 1]);
    if (y < height - 1) stack.push([x, y + 1]);
  }
}

export function replaceColor(
  canvas: CanvasState,
  startX: number,
  startY: number,
  fillColor: string,
  tolerance: number,
): void {
  const fill = hexToUint32(fillColor);
  const width = canvas.width;
  const height = canvas.height;
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;
  const targetColor = canvas.getPixel(startX, startY);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (colorMatchUint32(canvas.getPixel(x, y), targetColor, tolerance)) {
        canvas.setPixel(x, y, fill);
      }
    }
  }
}

export function drawBezier(
  canvas: CanvasState,
  points: [number, number][],
  color: string,
): void {
  if (points.length < 2) return;
  if (points.length === 2) {
    const p0 = points[0]!;
    const p1 = points[1]!;
    drawLine(canvas, p0[0], p0[1], p1[0], p1[1], color);
    return;
  }
  const uint32Color = hexToUint32(color);
  const width = canvas.width;
  const height = canvas.height;
  const steps = 100;
  const p0 = points[0]!;
  let prevX = p0[0];
  let prevY = p0[1];
  for (let t = 1; t <= steps; t++) {
    const frac = t / steps;
    let x = 0;
    let y = 0;
    const n = points.length - 1;
    for (let i = 0; i <= n; i++) {
      const coeff = binomial(n, i) * Math.pow(frac, i) * Math.pow(1 - frac, n - i);
      const pt = points[i]!;
      x += coeff * pt[0];
      y += coeff * pt[1];
    }
    const xi = Math.round(x);
    const yi = Math.round(y);
    if (xi >= 0 && xi < width && yi >= 0 && yi < height) {
      canvas.setPixel(xi, yi, uint32Color);
    }
    drawLine(canvas, prevX, prevY, xi, yi, color);
    prevX = xi;
    prevY = yi;
  }
}

function binomial(n: number, k: number): number {
  let coeff = 1;
  for (let x = n - k + 1; x <= n; x++) coeff *= x;
  for (let x = 1; x <= k; x++) coeff /= x;
  return coeff;
}

export type BrushShape = "square" | "circle" | "dither";
export type SymmetryMode = "none" | "horizontal" | "vertical" | "radial";

export function getSymmetryPoints(
  x: number, y: number, width: number, height: number,
  mode: SymmetryMode, segments: number,
): [number, number][] {
  const points: [number, number][] = [];
  const cx = Math.floor((width - 1) / 2);
  const cy = Math.floor((height - 1) / 2);
  switch (mode) {
    case "horizontal": {
      const mx = width - 1 - x;
      if (mx !== x) points.push([mx, y]);
      break;
    }
    case "vertical": {
      const my = height - 1 - y;
      if (my !== y) points.push([x, my]);
      break;
    }
    case "radial": {
      const dx = x - cx;
      const dy = y - cy;
      const angleStep = (2 * Math.PI) / segments;
      for (let i = 1; i < segments; i++) {
        const angle = angleStep * i;
        const rx = Math.round(cx + dx * Math.cos(angle) - dy * Math.sin(angle));
        const ry = Math.round(cy + dx * Math.sin(angle) + dy * Math.cos(angle));
        if (rx >= 0 && rx < width && ry >= 0 && ry < height) points.push([rx, ry]);
      }
      break;
    }
  }
  return points;
}

export function drawBrushStamp(
  canvas: CanvasState,
  cx: number,
  cy: number,
  size: number,
  color: string,
  shape: BrushShape = "circle",
  opacity: number = 1,
): void {
  const uint32Color = hexToUint32(color);
  const width = canvas.width;
  const height = canvas.height;
  const radius = Math.floor(size / 2);
  if (opacity < 1) {
    const { r, g, b, a } = uint32ToRgba(uint32Color);
    const alpha = Math.round(a * opacity);
    const adjustedColor = rgbaToUint32(r, g, b, alpha);
    if (shape === "square") {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const px = cx + dx;
          const py = cy + dy;
          if (px >= 0 && px < width && py >= 0 && py < height) canvas.setPixel(px, py, adjustedColor);
        }
      }
    } else if (shape === "circle") {
      const r2 = radius * radius;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > r2) continue;
          const px = cx + dx;
          const py = cy + dy;
          if (px >= 0 && px < width && py >= 0 && py < height) canvas.setPixel(px, py, adjustedColor);
        }
      }
    } else if (shape === "dither") {
      const pattern = [
        [0, 0], [2, 2], [1, 0], [3, 2],
        [0, 2], [2, 0], [1, 2], [3, 0],
        [0, 1], [2, 3], [1, 1], [3, 3],
        [0, 3], [2, 1], [1, 3], [3, 1],
      ] as const;
      const patternSize = 4;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > radius) continue;
          const px = cx + dx;
          const py = cy + dy;
          if (px < 0 || px >= width || py < 0 || py >= height) continue;
          const dist = d / radius;
          const threshold = (pattern[((py % patternSize + patternSize) % patternSize) * patternSize + ((px % patternSize + patternSize) % patternSize)]![1] / 4 + 1) / 5;
          if (dist > threshold) continue;
          canvas.setPixel(px, py, adjustedColor);
        }
      }
    }
  } else {
    if (shape === "square") {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const px = cx + dx;
          const py = cy + dy;
          if (px >= 0 && px < width && py >= 0 && py < height) canvas.setPixel(px, py, uint32Color);
        }
      }
    } else if (shape === "circle") {
      const r2 = radius * radius;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > r2) continue;
          const px = cx + dx;
          const py = cy + dy;
          if (px >= 0 && px < width && py >= 0 && py < height) canvas.setPixel(px, py, uint32Color);
        }
      }
    } else if (shape === "dither") {
      const pattern = [
        [0, 0], [2, 2], [1, 0], [3, 2],
        [0, 2], [2, 0], [1, 2], [3, 0],
        [0, 1], [2, 3], [1, 1], [3, 3],
        [0, 3], [2, 1], [1, 3], [3, 1],
      ] as const;
      const patternSize = 4;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > radius) continue;
          const px = cx + dx;
          const py = cy + dy;
          if (px < 0 || px >= width || py < 0 || py >= height) continue;
          const dist = d / radius;
          const threshold = (pattern[((py % patternSize + patternSize) % patternSize) * patternSize + ((px % patternSize + patternSize) % patternSize)]![1] / 4 + 1) / 5;
          if (dist > threshold) continue;
          canvas.setPixel(px, py, uint32Color);
        }
      }
    }
  }
}

export function sprayPixels(
  canvas: CanvasState,
  cx: number,
  cy: number,
  radius: number,
  density: number,
  color: string,
): void {
  const uint32Color = hexToUint32(color);
  const width = canvas.width;
  const height = canvas.height;
  const count = Math.round(radius * radius * Math.PI * density * 0.5);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    const x = Math.round(cx + Math.cos(angle) * dist);
    const y = Math.round(cy + Math.sin(angle) * dist);
    if (x >= 0 && x < width && y >= 0 && y < height) canvas.setPixel(x, y, uint32Color);
  }
}
