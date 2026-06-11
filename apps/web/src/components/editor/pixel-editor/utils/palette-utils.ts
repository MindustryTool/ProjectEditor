export function parseGpl(data: string): string[] {
  const lines = data.split(/\r?\n/);
  const colors: string[] = [];
  let inColors = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;
    if (trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("GIMP") || trimmed.startsWith("Name:") || trimmed.startsWith("Columns:")) {
      inColors = true;
      continue;
    }
    if (inColors) {
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 3) {
        const r = parseInt(parts[0]!, 10);
        const g = parseInt(parts[1]!, 10);
        const b = parseInt(parts[2]!, 10);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b) && r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
          const name = parts.slice(3).join(" ");
          colors.push(rgbToHex(r, g, b));
        }
      }
    }
  }
  return colors;
}

export function serializeGpl(colors: string[], name: string = "Untitled"): string {
  const lines = ["GIMP Palette", `Name: ${name}`, `Columns: ${Math.min(colors.length, 16)}`, "#"];
  for (const color of colors) {
    const { r, g, b } = hexToRgb(color);
    lines.push(`${r} ${g} ${b}  ${color}`);
  }
  return lines.join("\n");
}

export function parseHexList(data: string): string[] {
  const lines = data.split(/\r?\n/);
  const colors: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;
    const match = trimmed.match(/#?([0-9a-fA-F]{3,8})/);
    if (match) {
      const hex = "#" + match[1]!;
      colors.push(hex);
    }
  }
  return colors;
}

export function serializeHexList(colors: string[]): string {
  return colors.join("\n");
}

export function generatePaletteFromImage(data: Uint8ClampedArray, maxColors: number = 32): string[] {
  const colorMap = new Map<string, number>();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const a = data[i + 3]!;
    if (a < 128) continue;
    const hex = rgbToHex(r, g, b);
    colorMap.set(hex, (colorMap.get(hex) ?? 0) + 1);
  }
  const sorted = [...colorMap.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, maxColors).map(([color]) => color);
}

export function sortByHue(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const ca = hexToRgb(a);
    const cb = hexToRgb(b);
    const ha = rgbToHsv(ca.r, ca.g, ca.b);
    const hb = rgbToHsv(cb.r, cb.g, cb.b);
    return ha.h - hb.h;
  });
}

export function sortBySaturation(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const ca = hexToRgb(a);
    const cb = hexToRgb(b);
    const sa = rgbToHsv(ca.r, ca.g, ca.b);
    const sb = rgbToHsv(cb.r, cb.g, cb.b);
    return sb.s - sa.s;
  });
}

export function sortByBrightness(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const ca = hexToRgb(a);
    const cb = hexToRgb(b);
    const va = rgbToHsv(ca.r, ca.g, ca.b);
    const vb = rgbToHsv(cb.r, cb.g, cb.b);
    return vb.v - va.v;
  });
}

export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) * 60;
    else if (max === gg) h = ((bb - rr) / d + 2) * 60;
    else h = ((rr - gg) / d + 4) * 60;
  }
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;
  return { h, s, v };
}

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const ss = s / 100;
  const vv = v / 100;
  const c = vv * ss;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp < 1) { r = c; g = x; }
  else if (hp < 2) { r = x; g = c; }
  else if (hp < 3) { g = c; b = x; }
  else if (hp < 4) { g = x; b = c; }
  else if (hp < 5) { r = x; b = c; }
  else { r = c; b = x; }
  const m = vv - c;
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0]! + clean[0], 16),
      g: parseInt(clean[1]! + clean[1], 16),
      b: parseInt(clean[2]! + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  if (clean.length === 8) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return { r: 0, g: 0, b: 0 };
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex);
}
