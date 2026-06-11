import { describe, expect, it } from "vitest";
import { compositeLayers } from "../png-codec";

describe("compositeLayers", () => {
  it("composites a single visible layer", () => {
    const data = new Uint8ClampedArray(4 * 4 * 4);
    data[0] = 255;
    data[1] = 0;
    data[2] = 0;
    data[3] = 255;
    const result = compositeLayers([{ data, visible: true, opacity: 1 }], 4, 4);
    expect(result[0]).toBe(255);
    expect(result[1]).toBe(0);
    expect(result[3]).toBe(255);
  });

  it("skips invisible layers", () => {
    const visible = new Uint8ClampedArray(4 * 4 * 4);
    visible[0] = 255;
    visible[3] = 255;
    const hidden = new Uint8ClampedArray(4 * 4 * 4);
    hidden[0] = 0;
    hidden[3] = 255;
    const result = compositeLayers([
      { data: visible, visible: true, opacity: 1 },
      { data: hidden, visible: false, opacity: 1 },
    ], 4, 4);
    expect(result[0]).toBe(255);
  });

  it("respects layer opacity", () => {
    const bottom = new Uint8ClampedArray(4 * 4 * 4);
    bottom[0] = 255;
    bottom[1] = 0;
    bottom[2] = 0;
    bottom[3] = 255;
    const top = new Uint8ClampedArray(4 * 4 * 4);
    top[0] = 0;
    top[1] = 255;
    top[2] = 0;
    top[3] = 128;
    const result = compositeLayers([
      { data: bottom, visible: true, opacity: 1 },
      { data: top, visible: true, opacity: 0.5 },
    ], 4, 4);
    expect(result[0]).toBeGreaterThan(0);
    expect(result[1]).toBeGreaterThan(0);
  });
});
