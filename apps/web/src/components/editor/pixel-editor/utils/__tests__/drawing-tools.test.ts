import { describe, expect, it } from "vitest";
import { drawLine, floodFill, replaceColor, drawCircle, drawRectangle, drawEllipse, sprayPixels, drawBrushStamp, getSymmetryPoints, drawBezier } from "../drawing-tools";
import { CanvasState, hexToUint32, rgbaToUint32, uint32ToRgba, hexToRgba, rgbaToHex, TRANSPARENT } from "../canvas-state";

const u = (n: number) => n >>> 0;

describe("hexToRgba", () => {
  it("parses 6-digit hex", () => {
    const result = hexToRgba("#FF00AA");
    expect(result.r).toBe(255);
    expect(result.g).toBe(0);
    expect(result.b).toBe(170);
    expect(result.a).toBe(255);
  });

  it("parses 3-digit hex", () => {
    const result = hexToRgba("#F0A");
    expect(result.r).toBe(255);
    expect(result.g).toBe(0);
    expect(result.b).toBe(170);
  });

  it("parses 8-digit hex with alpha", () => {
    const result = hexToRgba("#FF00AA80");
    expect(result.r).toBe(255);
    expect(result.a).toBe(128);
  });

  it("handles hex without hash", () => {
    const result = hexToRgba("000000");
    expect(result.r).toBe(0);
  });
});

describe("rgbaToHex", () => {
  it("converts to 6-digit hex without alpha", () => {
    expect(rgbaToHex(255, 0, 170)).toBe("#ff00aa");
  });

  it("converts to 8-digit hex with alpha", () => {
    expect(rgbaToHex(255, 0, 170, 128)).toBe("#ff00aa80");
  });
});

describe("drawLine", () => {
  it("draws a horizontal line", () => {
    const canvas = new CanvasState(16, 16);
    drawLine(canvas, 2, 8, 10, 8, "#FF0000");
    for (let x = 2; x <= 10; x++) {
      expect(canvas.getPixel(x, 8)).toBe(u(hexToUint32("#FF0000")));
    }
  });

  it("draws a vertical line", () => {
    const canvas = new CanvasState(16, 16);
    drawLine(canvas, 8, 2, 8, 10, "#FF0000");
    for (let y = 2; y <= 10; y++) {
      expect(canvas.getPixel(8, y)).toBe(u(hexToUint32("#FF0000")));
    }
  });

  it("draws a diagonal line", () => {
    const canvas = new CanvasState(10, 10);
    drawLine(canvas, 0, 0, 9, 9, "#FF0000");
    expect(canvas.getPixel(9, 9)).toBe(u(hexToUint32("#FF0000")));
  });
});

describe("floodFill", () => {
  it("fills a contiguous area", () => {
    const canvas = new CanvasState(10, 10);
    canvas.setPixel(0, 0, rgbaToUint32(255, 255, 255, 255));
    floodFill(canvas, 0, 0, "#FF0000", 10);
    expect(canvas.getPixel(0, 0)).toBe(u(hexToUint32("#FF0000")));
  });

  it("does not fill across color boundaries with tolerance 0", () => {
    const canvas = new CanvasState(10, 10);
    canvas.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
    canvas.setPixel(1, 0, rgbaToUint32(128, 0, 0, 255));
    floodFill(canvas, 0, 0, "#FF0000", 0);
    expect(canvas.getPixel(0, 0)).toBe(u(hexToUint32("#FF0000")));
    expect(canvas.getPixel(1, 0)).toBe(u(rgbaToUint32(128, 0, 0, 255)));
  });
});

describe("replaceColor", () => {
  it("replaces all matching colors on the layer", () => {
    const canvas = new CanvasState(4, 4);
    canvas.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
    canvas.setPixel(3, 1, rgbaToUint32(255, 0, 0, 255));
    replaceColor(canvas, 0, 0, "#00FF00", 10);
    expect(canvas.getPixel(0, 0)).toBe(u(hexToUint32("#00FF00")));
    expect(canvas.getPixel(3, 1)).toBe(u(hexToUint32("#00FF00")));
  });
});

describe("drawCircle", () => {
  it("draws a filled circle", () => {
    const canvas = new CanvasState(20, 20);
    drawCircle(canvas, 10, 10, 5, "#FF0000", true);
    expect(canvas.getPixel(10, 10)).toBe(u(hexToUint32("#FF0000")));
    expect(canvas.getPixel(15, 10)).toBe(u(hexToUint32("#FF0000")));
  });

  it("draws an outlined circle", () => {
    const canvas = new CanvasState(20, 20);
    drawCircle(canvas, 10, 10, 5, "#FF0000", false);
    expect(canvas.getPixel(10, 10)).toBe(TRANSPARENT);
    expect(canvas.getPixel(10, 5)).toBe(u(hexToUint32("#FF0000")));
  });
});

describe("drawRectangle", () => {
  it("draws a filled rectangle", () => {
    const canvas = new CanvasState(10, 10);
    drawRectangle(canvas, 2, 2, 7, 7, "#FF0000", true);
    expect(canvas.getPixel(4, 4)).toBe(u(hexToUint32("#FF0000")));
  });

  it("draws an outlined rectangle", () => {
    const canvas = new CanvasState(10, 10);
    drawRectangle(canvas, 2, 2, 7, 7, "#FF0000", false);
    expect(canvas.getPixel(4, 4)).toBe(TRANSPARENT);
    expect(canvas.getPixel(2, 2)).toBe(u(hexToUint32("#FF0000")));
  });
});

describe("drawEllipse", () => {
  it("draws a filled ellipse", () => {
    const canvas = new CanvasState(20, 20);
    drawEllipse(canvas, 10, 10, 5, 3, "#FF0000", true);
    expect(canvas.getPixel(10, 10)).toBe(u(hexToUint32("#FF0000")));
  });
});

describe("sprayPixels", () => {
  it("sprays pixels within radius", () => {
    const canvas = new CanvasState(20, 20);
    sprayPixels(canvas, 10, 10, 5, 1, "#FF0000");
    let hasRed = false;
    for (let y = 5; y <= 15; y++) {
      for (let x = 5; x <= 15; x++) {
        if (canvas.getPixel(x, y) === u(hexToUint32("#FF0000"))) hasRed = true;
      }
    }
    expect(hasRed).toBe(true);
  });
});

describe("drawBrushStamp", () => {
  it("draws square stamp of correct size", () => {
    const canvas = new CanvasState(10, 10);
    drawBrushStamp(canvas, 5, 5, 3, "#FF0000", "square");
    expect(canvas.getPixel(5, 5)).toBe(u(hexToUint32("#FF0000")));
    expect(canvas.getPixel(4, 5)).toBe(u(hexToUint32("#FF0000")));
    expect(canvas.getPixel(6, 5)).toBe(u(hexToUint32("#FF0000")));
    expect(canvas.getPixel(5, 4)).toBe(u(hexToUint32("#FF0000")));
    expect(canvas.getPixel(5, 6)).toBe(u(hexToUint32("#FF0000")));
    expect(canvas.getPixel(1, 1)).toBe(TRANSPARENT);
  });

  it("draws circle stamp within radius", () => {
    const canvas = new CanvasState(10, 10);
    drawBrushStamp(canvas, 5, 5, 5, "#00FF00", "circle");
    expect(canvas.getPixel(5, 5)).toBe(u(hexToUint32("#00FF00")));
    expect(canvas.getPixel(5, 3)).toBe(u(hexToUint32("#00FF00")));
  });

  it("respects opacity", () => {
    const canvas = new CanvasState(4, 4);
    drawBrushStamp(canvas, 2, 2, 1, "#FF0000", "square", 0.5);
    const pixel = canvas.getPixel(2, 2);
    const { a } = uint32ToRgba(pixel);
    expect(a).toBe(128);
  });
});

describe("getSymmetryPoints", () => {
  it("returns horizontal mirror", () => {
    const pts = getSymmetryPoints(2, 3, 10, 10, "horizontal", 0);
    expect(pts.length).toBe(1);
    expect(pts[0]).toEqual([7, 3]);
  });

  it("does not duplicate pixels on center axis", () => {
    const pts = getSymmetryPoints(4, 3, 9, 9, "horizontal", 0);
    expect(pts.length).toBe(0);
  });

  it("returns vertical mirror", () => {
    const pts = getSymmetryPoints(2, 3, 10, 10, "vertical", 0);
    expect(pts[0]).toEqual([2, 6]);
  });

  it("returns radial symmetry points within bounds", () => {
    const pts = getSymmetryPoints(6, 3, 8, 8, "radial", 4);
    expect(pts.length).toBeGreaterThanOrEqual(1);
  });

  it("returns empty for no symmetry", () => {
    const pts = getSymmetryPoints(2, 3, 10, 10, "none", 0);
    expect(pts.length).toBe(0);
  });
});

describe("drawBezier", () => {
  it("draws line for 2 points", () => {
    const canvas = new CanvasState(10, 10);
    drawBezier(canvas, [[1, 1], [5, 1]], "#FF0000");
    expect(canvas.getPixel(1, 1)).toBe(u(hexToUint32("#FF0000")));
    expect(canvas.getPixel(5, 1)).toBe(u(hexToUint32("#FF0000")));
  });

  it("draws curve through 3 control points", () => {
    const canvas = new CanvasState(20, 20);
    drawBezier(canvas, [[2, 10], [10, 2], [18, 10]], "#0000FF");
    let hasBlue = false;
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        if (canvas.getPixel(x, y) === u(hexToUint32("#0000FF"))) {
          hasBlue = true;
        }
      }
    }
    expect(hasBlue).toBe(true);
  });
});
