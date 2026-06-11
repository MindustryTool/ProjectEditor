import { setPixel, getPixel, type Layer } from "./pixel-canvas";

export function drawPixel(
  layer: Layer,
  x: number,
  y: number,
  color: string,
  width: number,
): void {
  if (layer.locked) return;
  const { r, g, b, a } = hexToRgba(color);
  setPixel(layer.data, width, x, y, r, g, b, a);
}

export function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const c0 = clean[0]!;
    const c1 = clean[1]!;
    const c2 = clean[2]!;
    return { r: parseInt(c0 + c0, 16), g: parseInt(c1 + c1, 16), b: parseInt(c2 + c2, 16), a: 255 };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
      a: 255,
    };
  }
  if (clean.length === 8) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
      a: parseInt(clean.slice(6, 8), 16),
    };
  }
  return { r: 0, g: 0, b: 0, a: 255 };
}

export function rgbaToHex(r: number, g: number, b: number, a?: number): string {
  if (a !== undefined && a < 255) {
    return `#${[r, g, b, a].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  }
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function drawLine(
  data: Uint8ClampedArray,
  width: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
): void {
  const { r, g, b, a } = hexToRgba(color);
  const height = data.length / (width * 4);
  // Bresenham's line algorithm
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let cx = x0;
  let cy = y0;
  while (true) {
    if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
      setPixel(data, width, cx, cy, r, g, b, a);
    }
    if (cx === x1 && cy === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      cx += sx;
    }
    if (e2 <= dx) {
      err += dx;
      cy += sy;
    }
  }
}

export function drawCircle(
  data: Uint8ClampedArray,
  width: number,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  filled: boolean,
): void {
  const { r, g, b, a } = hexToRgba(color);
  const height = data.length / (width * 4);
  if (filled) {
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y <= radius * radius) {
          const px = cx + x;
          const py = cy + y;
          if (px >= 0 && px < width && py >= 0 && py < height) {
            setPixel(data, width, px, py, r, g, b, a);
          }
        }
      }
    }
  } else {
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;
    while (y >= x) {
      const points = [
        [cx + x, cy + y], [cx - x, cy + y], [cx + x, cy - y], [cx - x, cy - y],
        [cx + y, cy + x], [cx - y, cy + x], [cx + y, cy - x], [cx - y, cy - x],
      ] as const;
      for (const pt of points) {
        const px = pt[0];
        const py = pt[1];
        if (px >= 0 && px < width && py >= 0 && py < height) {
          setPixel(data, width, px, py, r, g, b, a);
        }
      }
      x++;
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
    }
  }
}

export function drawEllipse(
  data: Uint8ClampedArray,
  width: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color: string,
  filled: boolean,
): void {
  const { r, g, b, a } = hexToRgba(color);
  const height = data.length / (width * 4);
  if (filled) {
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) {
          const px = cx + x;
          const py = cy + y;
          if (px >= 0 && px < width && py >= 0 && py < height) {
            setPixel(data, width, px, py, r, g, b, a);
          }
        }
      }
    }
  } else {
    let x = 0;
    let y = ry;
    let rx2 = rx * rx;
    let ry2 = ry * ry;
    let d = ry2 - rx2 * ry + rx2 / 4;
    while (ry2 * x < rx2 * y) {
      const pts = [[cx + x, cy + y], [cx - x, cy + y], [cx + x, cy - y], [cx - x, cy - y]] as const;
      for (const pt of pts) {
        const px = pt[0]!, py = pt[1]!;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          setPixel(data, width, px, py, r, g, b, a);
        }
      }
      x++;
      if (d < 0) {
        d += 2 * ry2 * x + ry2;
      } else {
        y--;
        d += 2 * ry2 * x - 2 * rx2 * y + ry2;
      }
    }
    d = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;
    while (y >= 0) {
      const pts = [[cx + x, cy + y], [cx - x, cy + y], [cx + x, cy - y], [cx - x, cy - y]] as const;
      for (const pt of pts) {
        const px = pt[0]!, py = pt[1]!;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          setPixel(data, width, px, py, r, g, b, a);
        }
      }
      y--;
      if (d > 0) {
        d += rx2 - 2 * rx2 * y;
      } else {
        x++;
        d += 2 * ry2 * x - 2 * rx2 * y + rx2;
      }
    }
  }
}

export function drawRectangle(
  data: Uint8ClampedArray,
  width: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  filled: boolean,
): void {
  const { r, g, b, a } = hexToRgba(color);
  const height = data.length / (width * 4);
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);
  if (filled) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          setPixel(data, width, x, y, r, g, b, a);
        }
      }
    }
  } else {
    for (let x = minX; x <= maxX; x++) {
      if (x >= 0 && x < width && minY >= 0 && minY < height) setPixel(data, width, x, minY, r, g, b, a);
      if (x >= 0 && x < width && maxY >= 0 && maxY < height) setPixel(data, width, x, maxY, r, g, b, a);
    }
    for (let y = minY + 1; y < maxY; y++) {
      if (minX >= 0 && minX < width && y >= 0 && y < height) setPixel(data, width, minX, y, r, g, b, a);
      if (maxX >= 0 && maxX < width && y >= 0 && y < height) setPixel(data, width, maxX, y, r, g, b, a);
    }
  }
}

export function floodFill(
  data: Uint8ClampedArray,
  width: number,
  startX: number,
  startY: number,
  fillColor: string,
  tolerance: number,
): void {
  const { r: fillR, g: fillG, b: fillB, a: fillA } = hexToRgba(fillColor);
  const height = data.length / (width * 4);
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;
  const [targetR, targetG, targetB, targetA] = getPixel(data, width, startX, startY);
  if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === fillA) return;
  const visited = new Uint8Array(width * height);
  const stack: [number, number][] = [[startX, startY]];
  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;
    const [cr, cg, cb, ca] = getPixel(data, width, x, y);
    if (!colorMatch(cr, cg, cb, ca, targetR, targetG, targetB, targetA, tolerance)) continue;
    setPixel(data, width, x, y, fillR, fillG, fillB, fillA);
    if (x > 0) stack.push([x - 1, y]);
    if (x < width - 1) stack.push([x + 1, y]);
    if (y > 0) stack.push([x, y - 1]);
    if (y < height - 1) stack.push([x, y + 1]);
  }
}

export function replaceColor(
  data: Uint8ClampedArray,
  width: number,
  startX: number,
  startY: number,
  fillColor: string,
  tolerance: number,
): void {
  const { r: fillR, g: fillG, b: fillB, a: fillA } = hexToRgba(fillColor);
  const height = data.length / (width * 4);
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;
  const [targetR, targetG, targetB, targetA] = getPixel(data, width, startX, startY);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [cr, cg, cb, ca] = getPixel(data, width, x, y);
      if (colorMatch(cr, cg, cb, ca, targetR, targetG, targetB, targetA, tolerance)) {
        setPixel(data, width, x, y, fillR, fillG, fillB, fillA);
      }
    }
  }
}

function colorMatch(
  r1: number, g1: number, b1: number, a1: number,
  r2: number, g2: number, b2: number, a2: number,
  tolerance: number,
): boolean {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  const da = a1 - a2;
  return Math.sqrt(dr * dr + dg * dg + db * db + da * da) <= tolerance;
}

export function drawBezier(
  data: Uint8ClampedArray,
  width: number,
  points: [number, number][],
  color: string,
): void {
  if (points.length < 2) return;
  if (points.length === 2) {
    const p0 = points[0]!;
    const p1 = points[1]!;
    drawLine(data, width, p0[0], p0[1], p1[0], p1[1], color);
    return;
  }
  const { r, g, b, a } = hexToRgba(color);
  const height = data.length / (width * 4);
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
      setPixel(data, width, xi, yi, r, g, b, a);
    }
    drawLine(data, width, prevX, prevY, xi, yi, color);
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

export function sprayPixels(
  data: Uint8ClampedArray,
  width: number,
  cx: number,
  cy: number,
  radius: number,
  density: number,
  color: string,
): void {
  const { r, g, b, a } = hexToRgba(color);
  const height = data.length / (width * 4);
  const count = Math.round(radius * radius * Math.PI * density * 0.5);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    const x = Math.round(cx + Math.cos(angle) * dist);
    const y = Math.round(cy + Math.sin(angle) * dist);
    if (x >= 0 && x < width && y >= 0 && y < height) {
      setPixel(data, width, x, y, r, g, b, a);
    }
  }
}
