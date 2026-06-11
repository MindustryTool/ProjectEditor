import { describe, expect, it } from "vitest";
import { drawLine, floodFill, replaceColor, drawCircle, drawRectangle, drawEllipse, sprayPixels, hexToRgba, rgbaToHex } from "../drawing-tools";

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
    const data = new Uint8ClampedArray(16 * 16 * 4);
    drawLine(data, 16, 2, 8, 10, 8, "#FF0000");
    for (let x = 2; x <= 10; x++) {
      const i = (8 * 16 + x) * 4;
      expect(data[i]).toBe(255);
      expect(data[i + 3]).toBe(255);
    }
  });

  it("draws a vertical line", () => {
    const data = new Uint8ClampedArray(16 * 16 * 4);
    drawLine(data, 16, 8, 2, 8, 10, "#FF0000");
    for (let y = 2; y <= 10; y++) {
      const i = (y * 16 + 8) * 4;
      expect(data[i]).toBe(255);
    }
  });

  it("draws a diagonal line", () => {
    const data = new Uint8ClampedArray(10 * 10 * 4);
    drawLine(data, 10, 0, 0, 9, 9, "#FF0000");
    const i = (9 * 10 + 9) * 4;
    expect(data[i]).toBe(255);
  });
});

describe("floodFill", () => {
  it("fills a contiguous area", () => {
    const data = new Uint8ClampedArray(10 * 10 * 4);
    data[0] = 255;
    data[1] = 255;
    data[2] = 255;
    data[3] = 255;
    floodFill(data, 10, 0, 0, "#FF0000", 10);
    expect(data[0]).toBe(255);
    expect(data[1]).toBe(0);
    expect(data[2]).toBe(0);
  });

  it("does not fill across color boundaries with tolerance 0", () => {
    const data = new Uint8ClampedArray(10 * 10 * 4);
    data[0] = 255;
    data[3] = 255;
    data[4] = 128;
    data[7] = 255;
    floodFill(data, 10, 0, 0, "#FF0000", 0);
    expect(data[0]).toBe(255);
    expect(data[4]).toBe(128);
  });
});

describe("replaceColor", () => {
  it("replaces all matching colors on the layer", () => {
    const data = new Uint8ClampedArray(4 * 4 * 4);
    data[0] = 255;
    data[3] = 255;
    data[(1 * 4 + 3) * 4] = 255;
    data[(1 * 4 + 3) * 4 + 3] = 255;
    replaceColor(data, 4, 0, 0, "#00FF00", 10);
    expect(data[0]).toBe(0);
    expect(data[1]).toBe(255);
    expect(data[(1 * 4 + 3) * 4]).toBe(0);
    expect(data[(1 * 4 + 3) * 4 + 1]).toBe(255);
  });
});

describe("drawCircle", () => {
  it("draws a filled circle", () => {
    const data = new Uint8ClampedArray(20 * 20 * 4);
    drawCircle(data, 20, 10, 10, 5, "#FF0000", true);
    const center = (10 * 20 + 10) * 4;
    expect(data[center]).toBe(255);
    const edge = (10 * 20 + 15) * 4;
    expect(data[edge]).toBe(255);
  });

  it("draws an outlined circle", () => {
    const data = new Uint8ClampedArray(20 * 20 * 4);
    drawCircle(data, 20, 10, 10, 5, "#FF0000", false);
    const center = (10 * 20 + 10) * 4;
    expect(data[center]).toBe(0);
    const edge = (5 * 20 + 10) * 4;
    expect(data[edge]).toBe(255);
  });
});

describe("drawRectangle", () => {
  it("draws a filled rectangle", () => {
    const data = new Uint8ClampedArray(10 * 10 * 4);
    drawRectangle(data, 10, 2, 2, 7, 7, "#FF0000", true);
    const center = (4 * 10 + 4) * 4;
    expect(data[center]).toBe(255);
  });

  it("draws an outlined rectangle", () => {
    const data = new Uint8ClampedArray(10 * 10 * 4);
    drawRectangle(data, 10, 2, 2, 7, 7, "#FF0000", false);
    const center = (4 * 10 + 4) * 4;
    expect(data[center]).toBe(0);
    const edge = (2 * 10 + 2) * 4;
    expect(data[edge]).toBe(255);
  });
});

describe("drawEllipse", () => {
  it("draws a filled ellipse", () => {
    const data = new Uint8ClampedArray(20 * 20 * 4);
    drawEllipse(data, 20, 10, 10, 5, 3, "#FF0000", true);
    const center = (10 * 20 + 10) * 4;
    expect(data[center]).toBe(255);
  });
});

describe("sprayPixels", () => {
  it("sprays pixels within radius", () => {
    const data = new Uint8ClampedArray(20 * 20 * 4);
    sprayPixels(data, 20, 10, 10, 5, 1, "#FF0000");
    let hasRed = false;
    for (let y = 5; y <= 15; y++) {
      for (let x = 5; x <= 15; x++) {
        const i = (y * 20 + x) * 4;
        if (data[i] === 255) hasRed = true;
      }
    }
    expect(hasRed).toBe(true);
  });
});
