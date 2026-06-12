import { describe, expect, it } from "vitest";
import { PixelCanvas, createLayer, cloneLayer } from "../pixel-canvas";
import { CanvasState, rgbaToUint32, uint32ToRgba, cloneRegion, pasteRegion, clearRegion, pixelIndex, TRANSPARENT } from "../canvas-state";

describe("PixelCanvas", () => {
  it("creates a canvas with correct dimensions", () => {
    const canvas = new PixelCanvas(16, 16);
    expect(canvas.width).toBe(16);
    expect(canvas.height).toBe(16);
    expect(canvas.layerCount).toBe(1);
    expect(canvas.currentLayer).toBeDefined();
  });

  it("throws on invalid dimensions", () => {
    expect(() => new PixelCanvas(0, 16)).toThrow();
    expect(() => new PixelCanvas(16, 0)).toThrow();
    expect(() => new PixelCanvas(2000, 16)).toThrow();
  });

  it("adds layers", () => {
    const canvas = new PixelCanvas(8, 8);
    canvas.addLayer("Layer 2");
    expect(canvas.layerCount).toBe(2);
    expect(canvas.currentLayerIndex).toBe(1);
    expect(canvas.currentLayer.name).toBe("Layer 2");
  });

  it("prevents removing the last layer", () => {
    const canvas = new PixelCanvas(8, 8);
    expect(() => canvas.removeLayer(0)).toThrow();
  });

  it("removes a layer and updates current layer index", () => {
    const canvas = new PixelCanvas(8, 8);
    canvas.addLayer("Layer 2");
    canvas.addLayer("Layer 3");
    canvas.setCurrentLayer(2);
    canvas.removeLayer(1);
    expect(canvas.layerCount).toBe(2);
  });

  it("duplicates a layer", () => {
    const canvas = new PixelCanvas(8, 8);
    const original = canvas.currentLayer;
    original.canvas.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
    canvas.duplicateLayer(0);
    expect(canvas.layerCount).toBe(2);
    expect(canvas.currentLayerIndex).toBe(1);
    const pixel = canvas.currentLayer.canvas.getPixel(0, 0);
    const { r } = uint32ToRgba(pixel);
    expect(r).toBe(255);
  });

  it("renames a layer", () => {
    const canvas = new PixelCanvas(8, 8);
    canvas.renameLayer(0, "My Layer");
    expect(canvas.currentLayer.name).toBe("My Layer");
  });

  it("moves a layer", () => {
    const canvas = new PixelCanvas(8, 8);
    canvas.addLayer("Layer 2");
    canvas.addLayer("Layer 3");
    canvas.moveLayer(2, 0);
    expect(canvas.layers[0]!.name).toBe("Layer 3");
    expect(canvas.currentLayerIndex).toBe(0);
  });

  it("sets layer visibility", () => {
    const canvas = new PixelCanvas(8, 8);
    canvas.setLayerVisibility(0, false);
    expect(canvas.layers[0]!.visible).toBe(false);
  });

  it("sets layer opacity", () => {
    const canvas = new PixelCanvas(8, 8);
    canvas.setLayerOpacity(0, 0.5);
    expect(canvas.layers[0]!.opacity).toBe(0.5);
  });

  it("clamps opacity", () => {
    const canvas = new PixelCanvas(8, 8);
    canvas.setLayerOpacity(0, 2);
    expect(canvas.layers[0]!.opacity).toBe(1);
    canvas.setLayerOpacity(0, -1);
    expect(canvas.layers[0]!.opacity).toBe(0);
  });

  it("sets blend mode", () => {
    const canvas = new PixelCanvas(8, 8);
    canvas.setLayerBlendMode(0, "multiply");
    expect(canvas.layers[0]!.blendMode).toBe("multiply");
  });

  it("sets layer locked", () => {
    const canvas = new PixelCanvas(8, 8);
    canvas.setLayerLocked(0, true);
    expect(canvas.layers[0]!.locked).toBe(true);
  });

  it("serializes and deserializes", () => {
    const canvas = new PixelCanvas(16, 16);
    canvas.addLayer("Layer 2");
    canvas.currentLayer.canvas.setPixel(5, 5, rgbaToUint32(100, 150, 200, 255));
    const serialized = canvas.serialize();
    const restored = PixelCanvas.deserialize(serialized);
    expect(restored.width).toBe(16);
    expect(restored.height).toBe(16);
    expect(restored.layerCount).toBe(2);
    expect(restored.currentLayerIndex).toBe(1);
    const pixel = restored.currentLayer.canvas.getPixel(5, 5);
    const { r, g, b, a } = uint32ToRgba(pixel);
    expect(r).toBe(100);
    expect(g).toBe(150);
    expect(b).toBe(200);
    expect(a).toBe(255);
  });

  it("composites visible layers correctly", () => {
    const canvas = new PixelCanvas(4, 4);
    canvas.layers[0]!.canvas.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
    canvas.addLayer("Layer 2");
    canvas.layers[1]!.canvas.setPixel(0, 0, rgbaToUint32(0, 255, 0, 128));
    const composite = canvas.getCompositeData();
    expect(composite[0]).toBeGreaterThan(0);
    expect(composite[1]).toBeGreaterThan(0);
  });
});

describe("createLayer", () => {
  it("creates a layer with correct canvas size", () => {
    const layer = createLayer(8, 8, "Test");
    expect(layer.name).toBe("Test");
    expect(layer.canvas.length).toBe(8 * 8);
    expect(layer.visible).toBe(true);
    expect(layer.opacity).toBe(1);
    expect(layer.locked).toBe(false);
  });
});

describe("cloneLayer", () => {
  it("creates an independent copy", () => {
    const layer = createLayer(4, 4);
    layer.canvas.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
    const copy = cloneLayer(layer);
    expect(copy.name).toBe(`${layer.name} copy`);
    expect(copy.canvas.length).toBe(layer.canvas.length);
    expect(copy.canvas.getPixel(0, 0)).toBe(rgbaToUint32(255, 0, 0, 255) >>> 0);
    copy.canvas.setPixelAtIndex(0, 0);
    expect(layer.canvas.getPixelAtIndex(0)).toBe(rgbaToUint32(255, 0, 0, 255) >>> 0);
  });
});

describe("CanvasState setPixel / getPixel", () => {
  it("sets and gets pixel values", () => {
    const canvas = new CanvasState(16, 16);
    canvas.setPixel(5, 5, rgbaToUint32(100, 150, 200, 255));
    const pixel = canvas.getPixel(5, 5);
    const { r, g, b, a } = uint32ToRgba(pixel);
    expect(r).toBe(100);
    expect(g).toBe(150);
    expect(b).toBe(200);
    expect(a).toBe(255);
  });

  it("ignores out-of-bounds coordinates", () => {
    const canvas = new CanvasState(8, 8);
    canvas.setPixel(100, 100, rgbaToUint32(255, 0, 0, 255));
    const pixel = canvas.getPixel(100, 100);
    expect(pixel).toBe(TRANSPARENT);
  });

  it("returns transparent for out-of-bounds reads", () => {
    const canvas = new CanvasState(8, 8);
    const pixel = canvas.getPixel(-1, 0);
    expect(pixel).toBe(TRANSPARENT);
  });
});

describe("pixelIndex", () => {
  it("computes correct index", () => {
    expect(pixelIndex(0, 0, 16)).toBe(0);
    expect(pixelIndex(1, 0, 16)).toBe(1);
    expect(pixelIndex(0, 1, 16)).toBe(16);
    expect(pixelIndex(15, 15, 16)).toBe(255);
  });
});

describe("cloneRegion", () => {
  it("clones a rectangular region", () => {
    const canvas = new CanvasState(8, 8);
    canvas.setPixel(2, 2, rgbaToUint32(255, 0, 0, 255));
    const region = cloneRegion(canvas, 0, 0, 4, 4);
    expect(region.length).toBe(4 * 4);
    expect(region[pixelIndex(2, 2, 4)]).toBe(rgbaToUint32(255, 0, 0, 255) >>> 0);
  });
});

describe("pasteRegion", () => {
  it("pastes pixel data into destination", () => {
    const dest = new CanvasState(8, 8);
    const src = new Uint32Array(4 * 4);
    src[pixelIndex(0, 0, 4)] = rgbaToUint32(255, 0, 0, 255);
    pasteRegion(dest, src, 4, 2, 2);
    expect(dest.getPixel(2, 2)).toBe(rgbaToUint32(255, 0, 0, 255) >>> 0);
  });
});

describe("clearRegion", () => {
  it("clears a rectangular region", () => {
    const canvas = new CanvasState(8, 8);
    canvas.pixels.fill(0xffffffff);
    clearRegion(canvas, 0, 0, 4, 4);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        expect(canvas.getPixel(x, y)).toBe(TRANSPARENT);
      }
    }
  });
});
