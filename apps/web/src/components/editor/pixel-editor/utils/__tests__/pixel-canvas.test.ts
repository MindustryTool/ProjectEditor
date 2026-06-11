import { describe, expect, it } from "vitest";
import { PixelCanvas, createLayer, cloneLayer, setPixel, getPixel, pixelIndex, clonePixelRegion, pastePixels, clearRegion } from "../pixel-canvas";

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
    setPixel(original.data, 8, 0, 0, 255, 0, 0, 255);
    canvas.duplicateLayer(0);
    expect(canvas.layerCount).toBe(2);
    expect(canvas.currentLayerIndex).toBe(1);
    const [r] = getPixel(canvas.currentLayer.data, 8, 0, 0);
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
    setPixel(canvas.currentLayer.data, 16, 5, 5, 100, 150, 200, 255);
    const serialized = canvas.serialize();
    const restored = PixelCanvas.deserialize(serialized);
    expect(restored.width).toBe(16);
    expect(restored.height).toBe(16);
    expect(restored.layerCount).toBe(2);
    expect(restored.currentLayerIndex).toBe(1);
    const [r, g, b, a] = getPixel(restored.currentLayer.data, 16, 5, 5);
    expect(r).toBe(100);
    expect(g).toBe(150);
    expect(b).toBe(200);
    expect(a).toBe(255);
  });

  it("composites visible layers correctly", () => {
    const canvas = new PixelCanvas(4, 4);
    setPixel(canvas.layers[0]!.data, 4, 0, 0, 255, 0, 0, 255);
    canvas.addLayer("Layer 2");
    setPixel(canvas.layers[1]!.data, 4, 0, 0, 0, 255, 0, 128);
    const composite = canvas.getCompositeData();
    const [cr, cg] = getPixel(composite, 4, 0, 0);
    expect(cr).toBeGreaterThan(0);
    expect(cg).toBeGreaterThan(0);
  });
});

describe("createLayer", () => {
  it("creates a layer with correct data size", () => {
    const layer = createLayer(8, 8, "Test");
    expect(layer.name).toBe("Test");
    expect(layer.data.length).toBe(8 * 8 * 4);
    expect(layer.visible).toBe(true);
    expect(layer.opacity).toBe(1);
    expect(layer.locked).toBe(false);
  });
});

describe("cloneLayer", () => {
  it("creates an independent copy", () => {
    const layer = createLayer(4, 4);
    setPixel(layer.data, 4, 0, 0, 255, 0, 0, 255);
    const copy = cloneLayer(layer);
    expect(copy.name).toBe(`${layer.name} copy`);
    expect(copy.data.length).toBe(layer.data.length);
    const [r] = getPixel(copy.data, 4, 0, 0);
    expect(r).toBe(255);
    copy.data[0] = 0;
    expect(layer.data[0]).toBe(255);
  });
});

describe("setPixel / getPixel", () => {
  it("sets and gets pixel values", () => {
    const data = new Uint8ClampedArray(16 * 16 * 4);
    setPixel(data, 16, 5, 5, 100, 150, 200, 255);
    const [r, g, b, a] = getPixel(data, 16, 5, 5);
    expect(r).toBe(100);
    expect(g).toBe(150);
    expect(b).toBe(200);
    expect(a).toBe(255);
  });

  it("ignores out-of-bounds coordinates", () => {
    const data = new Uint8ClampedArray(8 * 8 * 4);
    setPixel(data, 8, 100, 100, 255, 0, 0, 255);
    const [r] = getPixel(data, 8, 100, 100);
    expect(r).toBe(0);
  });

  it("returns zero for out-of-bounds reads", () => {
    const data = new Uint8ClampedArray(8 * 8 * 4);
    const [r, g, b, a] = getPixel(data, 8, -1, 0);
    expect(r).toBe(0);
    expect(g).toBe(0);
    expect(b).toBe(0);
    expect(a).toBe(0);
  });
});

describe("pixelIndex", () => {
  it("computes correct index", () => {
    expect(pixelIndex(0, 0, 16)).toBe(0);
    expect(pixelIndex(1, 0, 16)).toBe(4);
    expect(pixelIndex(0, 1, 16)).toBe(64);
    expect(pixelIndex(15, 15, 16)).toBe(1020);
  });
});

describe("clonePixelRegion", () => {
  it("clones a rectangular region", () => {
    const data = new Uint8ClampedArray(8 * 8 * 4);
    setPixel(data, 8, 2, 2, 255, 0, 0, 255);
    const region = clonePixelRegion(data, 8, 0, 0, 4, 4);
    expect(region.length).toBe(4 * 4 * 4);
    const [r] = getPixel(region, 4, 2, 2);
    expect(r).toBe(255);
  });
});

describe("pastePixels", () => {
  it("pastes pixel data into destination", () => {
    const dest = new Uint8ClampedArray(8 * 8 * 4);
    const src = new Uint8ClampedArray(4 * 4 * 4);
    setPixel(src, 4, 0, 0, 255, 0, 0, 255);
    pastePixels(dest, 8, src, 4, 2, 2);
    const [r] = getPixel(dest, 8, 2, 2);
    expect(r).toBe(255);
  });
});

describe("clearRegion", () => {
  it("clears a rectangular region", () => {
    const data = new Uint8ClampedArray(8 * 8 * 4);
    for (let i = 0; i < data.length; i++) {
      data[i] = 255;
    }
    clearRegion(data, 8, 0, 0, 4, 4);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const [r, , , a] = getPixel(data, 8, x, y);
        expect(r).toBe(0);
        expect(a).toBe(0);
      }
    }
  });
});
