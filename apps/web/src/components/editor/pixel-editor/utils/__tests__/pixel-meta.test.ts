import { describe, expect, it } from "vitest";
import { serializeMeta, deserializeMeta, getMetaPath } from "../pixel-meta";
import { PixelCanvas } from "../pixel-canvas";
import { rgbaToUint32 } from "../canvas-state";
import type { SerializedCanvas } from "../pixel-canvas";

function makeTestCanvas(): SerializedCanvas {
  const canvas = new PixelCanvas(4, 4);
  canvas.addLayer("Test Layer");
  canvas.layers[0]!.canvas.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
  return canvas.serialize();
}

describe("pixel-meta", () => {
  it("serialize and deserialize round-trips correctly", () => {
    const canvas = makeTestCanvas();
    const json = serializeMeta(
      canvas,
      {
        foregroundColor: "#ff0000",
        backgroundColor: "#ffffff",
        tool: "pencil",
        brushSize: 3,
        brushOpacity: 1,
        tolerance: 32,
        sprayDensity: 0.5,
        sprayRadius: 10,
        pixelPerfect: false,
        symmetry: "none",
        symmetrySegments: 4,
        gridVisible: true,
        pixelGridVisible: false,
        rulersVisible: false,
        guidesVisible: false,
        layerBoundsVisible: false,
        onionSkinVisible: false,
        checkerboardVisible: true,
      },
    );

    const deserialized = deserializeMeta(json);
    expect(deserialized).not.toBeNull();
    expect(deserialized!.version).toBe(2);
    expect(deserialized!.layers.length).toBe(2);
    expect(deserialized!.layers[1]!.name).toBe("Test Layer");
    expect(deserialized!.layers[0]!.pixelData[0]).toBe(255);
    expect(deserialized!.uiConfig.foregroundColor).toBe("#ff0000");
    expect(deserialized!.uiConfig.tool).toBe("pencil");
    expect(deserialized!.uiConfig.gridVisible).toBe(true);
  });

  it("encodes pixel data as base64 (non-empty string in JSON)", () => {
    const canvas = makeTestCanvas();
    const json = serializeMeta(
      canvas,
      {
        foregroundColor: "#000000",
        backgroundColor: "#ffffff",
        tool: "pencil",
        brushSize: 1,
        brushOpacity: 1,
        tolerance: 0,
        sprayDensity: 0.5,
        sprayRadius: 10,
        pixelPerfect: false,
        symmetry: "none",
        symmetrySegments: 4,
        gridVisible: false,
        pixelGridVisible: false,
        rulersVisible: false,
        guidesVisible: false,
        layerBoundsVisible: false,
        onionSkinVisible: false,
        checkerboardVisible: true,
      },
    );

    const parsed = JSON.parse(json);
    expect(typeof parsed.layers[0]!.pixelData).toBe("string");
    expect(parsed.layers[0]!.pixelData.length).toBeGreaterThan(0);
  });

  it("returns null for invalid JSON", () => {
    const result = deserializeMeta("not-json");
    expect(result).toBeNull();
  });

  it("returns null for missing version field", () => {
    const result = deserializeMeta(JSON.stringify({ layers: [] }));
    expect(result).toBeNull();
  });

  it("returns null for missing layers field", () => {
    const result = deserializeMeta(JSON.stringify({ version: 1 }));
    expect(result).toBeNull();
  });

  it("round-trips pixel data accurately", () => {
    const canvas = makeTestCanvas();
    canvas.layers[0]!.canvas.pixels[0] = rgbaToUint32(100, 150, 200, 255);

    const json = serializeMeta(
      canvas,
      {
        foregroundColor: "#000000",
        backgroundColor: "#ffffff",
        tool: "pencil",
        brushSize: 1,
        brushOpacity: 1,
        tolerance: 0,
        sprayDensity: 0.5,
        sprayRadius: 10,
        pixelPerfect: false,
        symmetry: "none",
        symmetrySegments: 4,
        gridVisible: false,
        pixelGridVisible: false,
        rulersVisible: false,
        guidesVisible: false,
        layerBoundsVisible: false,
        onionSkinVisible: false,
        checkerboardVisible: true,
      },
    );

    const deserialized = deserializeMeta(json);
    expect(deserialized).not.toBeNull();
    expect(deserialized!.layers[0]!.pixelData[0]).toBe(100);
    expect(deserialized!.layers[0]!.pixelData[1]).toBe(150);
    expect(deserialized!.layers[0]!.pixelData[2]).toBe(200);
    expect(deserialized!.layers[0]!.pixelData[3]).toBe(255);
  });

  it("getMetaPath returns correct sidecar path", () => {
    expect(getMetaPath("sprites/units/spear.png")).toBe("sprites/units/spear.png.meta");
    expect(getMetaPath("/path/to/image.png")).toBe("/path/to/image.png.meta");
  });
});
