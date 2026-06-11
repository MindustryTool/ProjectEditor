import { describe, expect, it } from "vitest";
import { serializeMeta, deserializeMeta, getMetaPath } from "../pixel-meta";
import { PixelCanvas } from "../pixel-canvas";
import type { SerializedCanvas } from "../pixel-canvas";

function makeTestCanvas(): SerializedCanvas {
  const canvas = new PixelCanvas(4, 4);
  canvas.addLayer("Test Layer");
  const data = canvas.layers[0]!.data;
  data[0] = 255;
  data[1] = 0;
  data[2] = 0;
  data[3] = 255;
  return canvas.serialize();
}

describe("pixel-meta", () => {
  it("serialize and deserialize round-trips correctly", () => {
    const canvas = makeTestCanvas();
    const json = serializeMeta(
      canvas,
      { undoStack: [], redoStack: [] },
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
        currentLayerIndex: 0,
        currentLayerId: canvas.layers[0]?.id ?? "",
      },
    );

    const deserialized = deserializeMeta(json);
    expect(deserialized).not.toBeNull();
    expect(deserialized!.version).toBe(1);
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
      { undoStack: [], redoStack: [] },
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
        currentLayerIndex: 0,
        currentLayerId: canvas.layers[0]?.id ?? "",
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
    canvas.layers[0]!.data[0] = 100;
    canvas.layers[0]!.data[1] = 150;
    canvas.layers[0]!.data[2] = 200;
    canvas.layers[0]!.data[3] = 255;

    const json = serializeMeta(
      canvas,
      { undoStack: [], redoStack: [] },
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
        currentLayerIndex: 0,
        currentLayerId: canvas.layers[0]?.id ?? "",
      },
    );

    const deserialized = deserializeMeta(json);
    expect(deserialized).not.toBeNull();
    expect(deserialized!.layers[0]!.pixelData[0]).toBe(100);
    expect(deserialized!.layers[0]!.pixelData[1]).toBe(150);
    expect(deserialized!.layers[0]!.pixelData[2]).toBe(200);
    expect(deserialized!.layers[0]!.pixelData[3]).toBe(255);
  });

  it("truncates history to 50 entries on serialize", () => {
    const canvas = makeTestCanvas();
    const undoStack = [];
    for (let i = 0; i < 60; i++) {
      undoStack.push({ name: `Entry ${i}`, snapshot: canvas });
    }
    const json = serializeMeta(
      canvas,
      { undoStack, redoStack: [] },
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
        currentLayerIndex: 0,
        currentLayerId: canvas.layers[0]?.id ?? "",
      },
    );

    const parsed = JSON.parse(json);
    expect(parsed.history.undoStack.length).toBeLessThanOrEqual(50);
  });

  it("getMetaPath returns correct sidecar path", () => {
    expect(getMetaPath("sprites/units/spear.png")).toBe("sprites/units/spear.png.meta");
    expect(getMetaPath("/path/to/image.png")).toBe("/path/to/image.png.meta");
  });
});
