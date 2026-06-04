import { describe, expect, it } from "vitest";
import { canFormatFilePath, formatFileContent } from "./format-file-content";

describe("format-file-content", () => {
	it("detects supported file extensions", () => {
		expect(canFormatFilePath("content/blocks/test.json")).toBe(true);
		expect(canFormatFilePath("mod.hjson")).toBe(true);
		expect(canFormatFilePath("sprites/icon.png")).toBe(false);
		expect(canFormatFilePath(null)).toBe(false);
	});

	it("formats hjson through hjson formatter", () => {
		const input = "{b:2,a:[1,{c:true}]}";

		expect(formatFileContent("mod.hjson", input)).toBe("{\n  b: 2,\n  a: [\n    1,\n    {\n      c: true,\n    },\n  ],\n}");
	});
});
