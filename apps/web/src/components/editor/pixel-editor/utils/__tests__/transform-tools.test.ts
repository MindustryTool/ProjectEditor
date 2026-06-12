import { describe, expect, it } from "vitest";
import { scaleContent, rotateContent, flipHorizontal, flipVertical, applyScaledContentToLayer } from "../transform-tools";
import { CanvasState, hexToUint32, rgbaToUint32 } from "../canvas-state";
import { createLayer } from "../pixel-canvas";

const u = (n: number) => n >>> 0;

function drawTestImage(canvas: CanvasState): void {
  canvas.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
  canvas.setPixel(1, 0, rgbaToUint32(0, 255, 0, 255));
  canvas.setPixel(0, 1, rgbaToUint32(0, 0, 255, 255));
  canvas.setPixel(1, 1, rgbaToUint32(255, 255, 0, 255));
}

function makeTestCanvas(width = 2, height = 2): CanvasState {
  const canvas = new CanvasState(width, height);
  drawTestImage(canvas);
  return canvas;
}

describe("scaleContent", () => {
  it("scales content to a larger size (nearest-neighbor)", () => {
    const src = makeTestCanvas(2, 2);
    const result = scaleContent(src.pixels, src.width, src.height, 2, 2);
    expect(result.width).toBe(4);
    expect(result.height).toBe(4);
    const dst = new CanvasState(result.width, result.height, result.data);
    expect(dst.getPixel(0, 0)).toBe(u(hexToUint32("#FF0000")));
    expect(dst.getPixel(2, 0)).toBe(u(hexToUint32("#00FF00")));
    expect(dst.getPixel(0, 2)).toBe(u(hexToUint32("#0000FF")));
    expect(dst.getPixel(2, 2)).toBe(u(hexToUint32("#FFFF00")));
  });

  it("scales content to a smaller size", () => {
    const src = makeTestCanvas(4, 4);
    const result = scaleContent(src.pixels, src.width, src.height, 0.5, 0.5);
    expect(result.width).toBe(2);
    expect(result.height).toBe(2);
  });

  it("handles scaling to 1x1", () => {
    const src = makeTestCanvas(4, 4);
    const result = scaleContent(src.pixels, src.width, src.height, 0.25, 0.25);
    expect(result.width).toBe(1);
    expect(result.height).toBe(1);
  });
});

describe("rotateContent", () => {
  it("rotates 90 degrees clockwise", () => {
    const src = makeTestCanvas(2, 2);
    const result = rotateContent(src.pixels, src.width, src.height, 90);
    expect(result.width).toBe(2);
    expect(result.height).toBe(2);
    const dst = new CanvasState(result.width, result.height, result.data);
    expect(dst.getPixel(0, 0)).toBe(u(hexToUint32("#0000FF")));
    expect(dst.getPixel(1, 0)).toBe(u(hexToUint32("#FF0000")));
    expect(dst.getPixel(0, 1)).toBe(u(hexToUint32("#FFFF00")));
    expect(dst.getPixel(1, 1)).toBe(u(hexToUint32("#00FF00")));
  });

  it("rotates 180 degrees", () => {
    const src = makeTestCanvas(2, 2);
    const result = rotateContent(src.pixels, src.width, src.height, 180);
    const dst = new CanvasState(result.width, result.height, result.data);
    expect(dst.getPixel(0, 0)).toBe(u(hexToUint32("#FFFF00")));
    expect(dst.getPixel(1, 0)).toBe(u(hexToUint32("#0000FF")));
    expect(dst.getPixel(0, 1)).toBe(u(hexToUint32("#00FF00")));
    expect(dst.getPixel(1, 1)).toBe(u(hexToUint32("#FF0000")));
  });

  it("rotates 270 degrees clockwise", () => {
    const src = makeTestCanvas(2, 2);
    const result = rotateContent(src.pixels, src.width, src.height, 270);
    const dst = new CanvasState(result.width, result.height, result.data);
    expect(dst.getPixel(0, 0)).toBe(u(hexToUint32("#00FF00")));
    expect(dst.getPixel(1, 0)).toBe(u(hexToUint32("#FFFF00")));
    expect(dst.getPixel(0, 1)).toBe(u(hexToUint32("#FF0000")));
    expect(dst.getPixel(1, 1)).toBe(u(hexToUint32("#0000FF")));
  });
});

describe("flipHorizontal", () => {
  it("flips horizontally", () => {
    const src = makeTestCanvas(2, 2);
    const buffer = flipHorizontal(src.pixels, src.width);
    const dst = new CanvasState(src.width, src.height, buffer);
    expect(dst.getPixel(0, 0)).toBe(u(hexToUint32("#00FF00")));
    expect(dst.getPixel(1, 0)).toBe(u(hexToUint32("#FF0000")));
    expect(dst.getPixel(0, 1)).toBe(u(hexToUint32("#FFFF00")));
    expect(dst.getPixel(1, 1)).toBe(u(hexToUint32("#0000FF")));
  });
});

describe("flipVertical", () => {
  it("flips vertically", () => {
    const src = makeTestCanvas(2, 2);
    const buffer = flipVertical(src.pixels, src.width);
    const dst = new CanvasState(src.width, src.height, buffer);
    expect(dst.getPixel(0, 0)).toBe(u(hexToUint32("#0000FF")));
    expect(dst.getPixel(1, 0)).toBe(u(hexToUint32("#FFFF00")));
    expect(dst.getPixel(0, 1)).toBe(u(hexToUint32("#FF0000")));
    expect(dst.getPixel(1, 1)).toBe(u(hexToUint32("#00FF00")));
  });
});

describe("applyScaledContentToLayer", () => {
  it("replaces layer content with scaled content", () => {
    const layer = createLayer(4, 4, "base");
    for (let y = 0; y < layer.canvas.height; y++) {
      for (let x = 0; x < layer.canvas.width; x++) {
        layer.canvas.setPixel(x, y, rgbaToUint32(0, 0, 0, 255));
      }
    }
    const src = new CanvasState(2, 2);
    src.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
    const scaled = scaleContent(src.pixels, src.width, src.height, 1, 1);
    applyScaledContentToLayer(
      layer.canvas.pixels,
      layer.canvas.width,
      scaled.data,
      scaled.width,
      scaled.height,
      0, 0,
    );
    expect(layer.canvas.getPixel(0, 0)).toBe(u(hexToUint32("#FF0000")));
  });

  it("works when source is smaller than layer", () => {
    const layer = createLayer(4, 4, "base");
    for (let y = 0; y < layer.canvas.height; y++) {
      for (let x = 0; x < layer.canvas.width; x++) {
        layer.canvas.setPixel(x, y, rgbaToUint32(0, 0, 0, 255));
      }
    }
    const src = new CanvasState(2, 2);
    src.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
    const scaled = scaleContent(src.pixels, src.width, src.height, 1, 1);
    applyScaledContentToLayer(
      layer.canvas.pixels,
      layer.canvas.width,
      scaled.data,
      scaled.width,
      scaled.height,
      0, 0,
    );
    expect(layer.canvas.getPixel(0, 0)).toBe(u(hexToUint32("#FF0000")));
    expect(layer.canvas.getPixel(3, 0)).toBe(u(rgbaToUint32(0, 0, 0, 255)));
  });
});
