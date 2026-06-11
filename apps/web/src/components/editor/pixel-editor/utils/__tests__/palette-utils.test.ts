import { describe, it, expect } from "vitest";
import {
  parseGpl,
  serializeGpl,
  parseHexList,
  serializeHexList,
  rgbToHsv,
  hsvToRgb,
  rgbToHex,
  hexToRgb,
  isValidHex,
  sortByHue,
  sortBySaturation,
  sortByBrightness,
  generatePaletteFromImage,
} from "../palette-utils";

describe("parseGpl", () => {
  it("parses a standard GIMP palette file", () => {
    const gpl = `GIMP Palette
Name: Test
Columns: 4
#
255 0 0   Red
0 255 0   Green
0 0 255   Blue
`;
    const colors = parseGpl(gpl);
    expect(colors).toEqual(["#ff0000", "#00ff00", "#0000ff"]);
  });

  it("returns empty array for empty GPL", () => {
    expect(parseGpl("")).toEqual([]);
  });

  it("skips comment lines", () => {
    const gpl = `GIMP Palette
# this is a comment
255 0 0   Red
# another comment
0 255 0   Green
`;
    expect(parseGpl(gpl)).toEqual(["#ff0000", "#00ff00"]);
  });

  it("rejects invalid RGB values", () => {
    const gpl = `GIMP Palette
#
999 0 0   Invalid
0 0 0   Valid
`;
    expect(parseGpl(gpl)).toEqual(["#000000"]);
  });

  it("handles CRLF line endings", () => {
    const gpl = "GIMP Palette\r\n#\r\n128 128 128  Gray\r\n";
    expect(parseGpl(gpl)).toEqual(["#808080"]);
  });
});

describe("serializeGpl", () => {
  it("serializes colors to GPL format", () => {
    const colors = ["#ff0000", "#00ff00"];
    const result = serializeGpl(colors, "My Palette");
    expect(result).toContain("GIMP Palette");
    expect(result).toContain("Name: My Palette");
    expect(result).toContain("255 0 0");
    expect(result).toContain("0 255 0");
  });
});

describe("parseHexList", () => {
  it("parses hex colors from text", () => {
    const text = "#ff0000\n#00ff00\n#0000ff";
    expect(parseHexList(text)).toEqual(["#ff0000", "#00ff00", "#0000ff"]);
  });

  it("handles hex without hash", () => {
    const text = "ff0000\n00ff00";
    expect(parseHexList(text)).toEqual(["#ff0000", "#00ff00"]);
  });

  it("skips empty lines", () => {
    const text = "#ff0000\n\n#00ff00";
    expect(parseHexList(text)).toEqual(["#ff0000", "#00ff00"]);
  });
});

describe("serializeHexList", () => {
  it("joins colors with newlines", () => {
    expect(serializeHexList(["#ff0000", "#00ff00"])).toBe("#ff0000\n#00ff00");
  });
});

describe("rgbToHsv / hsvToRgb round-trip", () => {
  const testCases = [
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 128, g: 128, b: 128 },
    { r: 255, g: 255, b: 255 },
    { r: 0, g: 0, b: 0 },
    { r: 128, g: 64, b: 192 },
  ];

  for (const tc of testCases) {
    it(`round-trips rgb(${tc.r},${tc.g},${tc.b})`, () => {
      const hsv = rgbToHsv(tc.r, tc.g, tc.b);
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      expect(rgb.r).toBe(tc.r);
      expect(rgb.g).toBe(tc.g);
      expect(rgb.b).toBe(tc.b);
    });
  }
});

describe("rgbToHsv", () => {
  it("returns 0 hue for red", () => {
    const hsv = rgbToHsv(255, 0, 0);
    expect(hsv.h).toBeCloseTo(0, 1);
    expect(hsv.s).toBeCloseTo(100, 1);
    expect(hsv.v).toBeCloseTo(100, 1);
  });

  it("returns correct values for green", () => {
    const hsv = rgbToHsv(0, 255, 0);
    expect(hsv.h).toBeCloseTo(120, 1);
    expect(hsv.s).toBeCloseTo(100, 1);
    expect(hsv.v).toBeCloseTo(100, 1);
  });

  it("returns zero saturation for gray", () => {
    const hsv = rgbToHsv(128, 128, 128);
    expect(hsv.s).toBe(0);
  });
});

describe("hsvToRgb", () => {
  it("converts HSV to red", () => {
    const rgb = hsvToRgb(0, 100, 100);
    expect(rgb.r).toBe(255);
    expect(rgb.g).toBe(0);
    expect(rgb.b).toBe(0);
  });

  it("converts black", () => {
    const rgb = hsvToRgb(0, 0, 0);
    expect(rgb.r).toBe(0);
    expect(rgb.g).toBe(0);
    expect(rgb.b).toBe(0);
  });

  it("converts white", () => {
    const rgb = hsvToRgb(0, 0, 100);
    expect(rgb.r).toBe(255);
    expect(rgb.g).toBe(255);
    expect(rgb.b).toBe(255);
  });
});

describe("hexToRgb", () => {
  it("parses 6-digit hex", () => {
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("parses 3-digit hex", () => {
    expect(hexToRgb("#f00")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("parses hex without hash", () => {
    expect(hexToRgb("00ff00")).toEqual({ r: 0, g: 255, b: 0 });
  });

  it("returns black for empty string", () => {
    expect(hexToRgb("")).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe("rgbToHex", () => {
  it("converts RGB to 6-digit hex", () => {
    expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
    expect(rgbToHex(0, 255, 0)).toBe("#00ff00");
    expect(rgbToHex(0, 0, 255)).toBe("#0000ff");
  });

  it("pads single-digit hex values", () => {
    expect(rgbToHex(15, 15, 15)).toBe("#0f0f0f");
  });
});

describe("isValidHex", () => {
  it("validates 6-digit hex with hash", () => {
    expect(isValidHex("#ff0000")).toBe(true);
  });

  it("validates 3-digit hex with hash", () => {
    expect(isValidHex("#f00")).toBe(true);
  });

  it("validates 8-digit hex with hash", () => {
    expect(isValidHex("#ff000000")).toBe(true);
  });

  it("validates hex without hash", () => {
    expect(isValidHex("ff0000")).toBe(true);
  });

  it("rejects invalid hex", () => {
    expect(isValidHex("#xyz123")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidHex("")).toBe(false);
  });
});

describe("sortByHue", () => {
  it("sorts colors by hue", () => {
    const colors = ["#00ff00", "#ff0000", "#0000ff"];
    const sorted = sortByHue(colors);
    expect(sorted[0]).toBe("#ff0000");
    expect(sorted[1]).toBe("#00ff00");
    expect(sorted[2]).toBe("#0000ff");
  });
});

describe("sortBySaturation", () => {
  it("sorts colors by saturation descending", () => {
    const colors = ["#808080", "#ff0000"];
    const sorted = sortBySaturation(colors);
    expect(sorted[0]).toBe("#ff0000");
    expect(sorted[1]).toBe("#808080");
  });
});

describe("sortByBrightness", () => {
  it("sorts colors by brightness descending", () => {
    const colors = ["#000000", "#ffffff"];
    const sorted = sortByBrightness(colors);
    expect(sorted[0]).toBe("#ffffff");
    expect(sorted[1]).toBe("#000000");
  });
});

describe("generatePaletteFromImage", () => {
  it("extracts unique colors from image data", () => {
    const data = new Uint8ClampedArray(16);
    data[0] = 255; data[1] = 0; data[2] = 0; data[3] = 255;
    data[4] = 0; data[5] = 255; data[6] = 0; data[7] = 255;
    data[8] = 0; data[9] = 0; data[10] = 255; data[11] = 255;
    data[12] = 255; data[13] = 0; data[14] = 0; data[15] = 255;
    const palette = generatePaletteFromImage(data, 10);
    expect(palette).toContain("#ff0000");
    expect(palette).toContain("#00ff00");
    expect(palette).toContain("#0000ff");
    expect(palette.length).toBe(3);
  });

  it("respects maxColors limit", () => {
    const data = new Uint8ClampedArray(32);
    for (let i = 0; i < 8; i++) {
      data[i * 4] = i * 32; data[i * 4 + 1] = 0; data[i * 4 + 2] = 0; data[i * 4 + 3] = 255;
    }
    const palette = generatePaletteFromImage(data, 2);
    expect(palette.length).toBeLessThanOrEqual(2);
  });

  it("skips transparent pixels", () => {
    const data = new Uint8ClampedArray(8);
    data[0] = 255; data[1] = 0; data[2] = 0; data[3] = 0;
    data[4] = 0; data[5] = 255; data[6] = 0; data[7] = 127;
    const palette = generatePaletteFromImage(data, 10);
    expect(palette).not.toContain("#ff0000");
  });

  it("returns empty array for empty data", () => {
    expect(generatePaletteFromImage(new Uint8ClampedArray(0), 10)).toEqual([]);
  });
});
