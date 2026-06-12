import { describe, expect, it } from "vitest";
import { compositeLayers } from "../png-codec";
import { rgbaToUint32 } from "../canvas-state";

describe("compositeLayers", () => {
  it("composites a single visible layer", () => {
    const data = new Uint32Array(4 * 4);
    data[0] = rgbaToUint32(255, 0, 0, 255);
    const result = compositeLayers([{ data, visible: true, opacity: 1 }], 4, 4);
    expect(result[0]).not.toBe(0);
    expect(result[0]).toBe(data[0]);
  });

  it("skips invisible layers", () => {
    const visible = new Uint32Array(4 * 4);
    visible[0] = rgbaToUint32(255, 0, 0, 255);
    const hidden = new Uint32Array(4 * 4);
    hidden[0] = rgbaToUint32(0, 0, 0, 255);
    const result = compositeLayers([
      { data: visible, visible: true, opacity: 1 },
      { data: hidden, visible: false, opacity: 1 },
    ], 4, 4);
    expect(result[0]).not.toBe(0);
    expect(result[0]).toBe(visible[0]);
  });

  it("respects layer opacity", () => {
    const bottom = new Uint32Array(4 * 4);
    bottom[0] = rgbaToUint32(255, 0, 0, 255);
    const top = new Uint32Array(4 * 4);
    top[0] = rgbaToUint32(0, 255, 0, 128);
    const result = compositeLayers([
      { data: bottom, visible: true, opacity: 1 },
      { data: top, visible: true, opacity: 0.5 },
    ], 4, 4);
    expect(result[0]).not.toBe(0);
    expect(result[0]).not.toBe(bottom[0]);
  });
});
