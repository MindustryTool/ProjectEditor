import { describe, expect, it } from "vitest";
import {
  createRectMask,
  createEllipseMask,
  createLassoMask,
  createPolygonMask,
  magicWandMask,
  colorSelectMask,
  combineMasks,
  getMaskBounds,
  deleteSelectedPixels,
  fillSelectedPixels,
  extractSelectionContent,
  pasteSelectionContent,
  expandMask,
  shrinkMask,
  featherMask,
  invertMask,
  isSelectionActive,
} from "../selection-tools";
import { CanvasState, hexToUint32, rgbaToUint32, TRANSPARENT } from "../canvas-state";

const u = (n: number) => n >>> 0;

function createTestCanvas(width: number, height: number, fillColor: number = TRANSPARENT): CanvasState {
  const canvas = new CanvasState(width, height);
  canvas.pixels.fill(fillColor);
  return canvas;
}

describe("createRectMask", () => {
  it("creates a rectangular mask", () => {
    const mask = createRectMask(10, 10, 2, 3, 5, 6);
    expect(mask.length).toBe(100);
    expect(mask[3 * 10 + 2]).toBe(1);
    expect(mask[3 * 10 + 5]).toBe(1);
    expect(mask[6 * 10 + 2]).toBe(1);
    expect(mask[6 * 10 + 5]).toBe(1);
    expect(mask[0]).toBe(0);
    expect(mask[9 * 10 + 9]).toBe(0);
  });

  it("clamps to canvas bounds", () => {
    const mask = createRectMask(8, 8, -2, -2, 12, 12);
    expect(mask[0]).toBe(1);
    expect(mask[7 * 8 + 7]).toBe(1);
  });

  it("handles single pixel", () => {
    const mask = createRectMask(5, 5, 2, 2, 2, 2);
    expect(mask[2 * 5 + 2]).toBe(1);
    let count = 0;
    for (let i = 0; i < mask.length; i++) if (mask[i]) count++;
    expect(count).toBe(1);
  });
});

describe("createEllipseMask", () => {
  it("creates an elliptical mask", () => {
    const mask = createEllipseMask(10, 10, 4, 4, 3, 2);
    expect(mask[4 * 10 + 4]).toBe(1);
    expect(mask.length).toBe(100);
    expect(mask[0]).toBe(0);
  });

  it("handles zero radius", () => {
    const mask = createEllipseMask(5, 5, 2, 2, 0, 0);
    expect(mask[2 * 5 + 2]).toBe(1);
  });
});

describe("createLassoMask and createPolygonMask", () => {
  it("creates a triangular mask", () => {
    const points: [number, number][] = [[1, 1], [8, 1], [4, 8]];
    const mask = createLassoMask(10, 10, points);
    expect(mask.length).toBe(100);
    expect(mask[4 * 10 + 4]).toBe(1);
    expect(mask[3 * 10 + 4]).toBe(1);
    expect(mask[5 * 10 + 4]).toBe(1);
  });

  it("returns empty mask for fewer than 3 points", () => {
    const mask = createLassoMask(10, 10, [[1, 1], [2, 2]]);
    let count = 0;
    for (let i = 0; i < mask.length; i++) if (mask[i]) count++;
    expect(count).toBe(0);
  });

  it("polygon mask equals lasso mask", () => {
    const points: [number, number][] = [[1, 1], [8, 1], [4, 8]];
    const lasso = createLassoMask(10, 10, points);
    const poly = createPolygonMask(10, 10, points);
    expect(poly).toEqual(lasso);
  });
});

describe("magicWandMask", () => {
  it("selects contiguous similar-colored pixels", () => {
    const canvas = createTestCanvas(8, 8, rgbaToUint32(100, 100, 100, 255));
    canvas.setPixel(3, 3, rgbaToUint32(50, 100, 100, 255));
    const mask = magicWandMask(canvas, 0, 0, 10);
    expect(mask[0]).toBe(1);
    expect(mask[3 * 8 + 3]).toBe(0);
  });

  it("returns empty mask for out-of-bounds", () => {
    const canvas = createTestCanvas(8, 8);
    const mask = magicWandMask(canvas, -1, -1, 10);
    expect(mask.every((v) => v === 0)).toBe(true);
  });
});

describe("colorSelectMask", () => {
  it("selects all matching color pixels on the layer", () => {
    const canvas = createTestCanvas(8, 8, rgbaToUint32(100, 100, 100, 255));
    canvas.setPixel(3, 3, rgbaToUint32(50, 100, 100, 255));
    const mask = colorSelectMask(canvas, 0, 0, 10);
    let count = 0;
    for (let i = 0; i < mask.length; i++) if (mask[i]) count++;
    expect(count).toBe(63);
    expect(mask[3 * 8 + 3]).toBe(0);
  });
});

describe("combineMasks", () => {
  it("returns new mask for 'new' mode", () => {
    const a = new Uint8Array(10);
    const b = new Uint8Array(10);
    b[3] = 1;
    const result = combineMasks(a, b, "new");
    expect(result[3]).toBe(1);
    expect(result[0]).toBe(0);
  });

  it("returns new mask when existing is null", () => {
    const b = new Uint8Array(10);
    b[3] = 1;
    const result = combineMasks(null, b, "new");
    expect(result[3]).toBe(1);
  });

  it("adds masks together", () => {
    const a = new Uint8Array(10);
    a[2] = 1;
    const b = new Uint8Array(10);
    b[5] = 1;
    const result = combineMasks(a, b, "add");
    expect(result[2]).toBe(1);
    expect(result[5]).toBe(1);
    expect(result[0]).toBe(0);
  });

  it("subtracts mask", () => {
    const a = new Uint8Array(10);
    a[2] = 1; a[3] = 1; a[4] = 1;
    const b = new Uint8Array(10);
    b[3] = 1;
    const result = combineMasks(a, b, "subtract");
    expect(result[2]).toBe(1);
    expect(result[3]).toBe(0);
    expect(result[4]).toBe(1);
  });

  it("intersects masks", () => {
    const a = new Uint8Array(10);
    a[2] = 1; a[3] = 1;
    const b = new Uint8Array(10);
    b[3] = 1; b[4] = 1;
    const result = combineMasks(a, b, "intersect");
    expect(result[3]).toBe(1);
    expect(result[2]).toBe(0);
    expect(result[4]).toBe(0);
  });
});

describe("getMaskBounds", () => {
  it("returns correct bounds", () => {
    const mask = new Uint8Array(100);
    mask[3 * 10 + 2] = 1;
    mask[6 * 10 + 7] = 1;
    const bounds = getMaskBounds(mask, 10, 10);
    expect(bounds).toEqual({ x: 2, y: 3, w: 6, h: 4 });
  });

  it("returns null for empty mask", () => {
    const mask = new Uint8Array(100);
    expect(getMaskBounds(mask, 10, 10)).toBeNull();
  });
});

describe("deleteSelectedPixels", () => {
  it("clears selected pixels to transparent", () => {
    const canvas = createTestCanvas(4, 4, hexToUint32("#FF0000"));
    const mask = new Uint8Array(16);
    mask[1 * 4 + 1] = 1;
    mask[2 * 4 + 2] = 1;
    deleteSelectedPixels(canvas, mask);
    expect(canvas.getPixel(1, 1)).toBe(TRANSPARENT);
    expect(canvas.getPixel(0, 0)).toBe(u(hexToUint32("#FF0000")));
  });
});

describe("fillSelectedPixels", () => {
  it("fills selected pixels with a color", () => {
    const canvas = createTestCanvas(4, 4);
    const mask = new Uint8Array(16);
    mask[0] = 1;
    mask[1] = 1;
    fillSelectedPixels(canvas, mask, "#ff8800");
    expect(canvas.getPixel(0, 0)).toBe(u(hexToUint32("#ff8800")));
  });
});

describe("extractSelectionContent", () => {
  it("extracts selected pixel region", () => {
    const canvas = createTestCanvas(8, 8, hexToUint32("#FF0000"));
    const mask = createRectMask(8, 8, 2, 2, 4, 4);
    const result = extractSelectionContent(canvas, mask);
    expect(result.width).toBe(3);
    expect(result.height).toBe(3);
    expect(result.data.length).toBe(3 * 3);
  });
});

describe("pasteSelectionContent", () => {
  it("pastes pixel data at target location", () => {
    const dest = createTestCanvas(8, 8);
    const src = new Uint32Array(2 * 2);
    src[0 * 2 + 0] = hexToUint32("#FF0000");
    src[0 * 2 + 1] = hexToUint32("#00FF00");
    pasteSelectionContent(dest, src, 2, 3, 3);
    expect(dest.getPixel(3, 3)).toBe(u(hexToUint32("#FF0000")));
    expect(dest.getPixel(0, 0)).toBe(TRANSPARENT);
  });
});

describe("expandMask", () => {
  it("expands mask by 1 pixel", () => {
    const mask = new Uint8Array(25);
    mask[2 * 5 + 2] = 1;
    const expanded = expandMask(mask, 5, 5, 1);
    expect(expanded[2 * 5 + 2]).toBe(1);
    expect(expanded[2 * 5 + 1]).toBe(1);
    expect(expanded[2 * 5 + 3]).toBe(1);
    expect(expanded[1 * 5 + 2]).toBe(1);
    expect(expanded[3 * 5 + 2]).toBe(1);
  });
});

describe("shrinkMask", () => {
  it("shrinks mask by 1 pixel", () => {
    const mask = new Uint8Array(25);
    for (let y = 1; y <= 3; y++) {
      for (let x = 1; x <= 3; x++) {
        mask[y * 5 + x] = 1;
      }
    }
    const shrunk = shrinkMask(mask, 5, 5, 1);
    expect(shrunk[2 * 5 + 2]).toBe(1);
    expect(shrunk[1 * 5 + 1]).toBe(0);
    expect(shrunk[1 * 5 + 2]).toBe(0);
  });
});

describe("featherMask", () => {
  it("feathers mask edges (preserves core)", () => {
    const mask = new Uint8Array(49);
    for (let y = 2; y <= 4; y++) {
      for (let x = 2; x <= 4; x++) {
        mask[y * 7 + x] = 1;
      }
    }
    const feathered = featherMask(mask, 7, 7, 1);
    expect(feathered[3 * 7 + 3]).toBe(1);
    expect(feathered[1 * 7 + 1]).toBe(0);
  });
});

describe("invertMask", () => {
  it("inverts all bits", () => {
    const mask = new Uint8Array(10);
    mask[3] = 1; mask[7] = 1;
    const inverted = invertMask(mask);
    expect(inverted[3]).toBe(0);
    expect(inverted[7]).toBe(0);
    expect(inverted[0]).toBe(1);
    expect(inverted[9]).toBe(1);
  });
});

describe("isSelectionActive", () => {
  it("returns true when mask has selected pixels", () => {
    const mask = new Uint8Array(10);
    mask[5] = 1;
    expect(isSelectionActive(mask)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isSelectionActive(null)).toBe(false);
  });

  it("returns false for all-zero mask", () => {
    const mask = new Uint8Array(10);
    expect(isSelectionActive(mask)).toBe(false);
  });
});
