import { describe, expect, it } from "vitest";
import {
	findEditableColorTagAtColumn,
	formatMindustryColorTag,
	parseMindustryStringTags,
	resolveMindustryColor,
	toPickerColorValue,
} from "./colorTags";

describe("colorTags helpers", () => {
	it("parses valid color and reset tags inside quoted strings only", () => {
		const matches = parseMindustryStringTags('name: "[accent]Hello []Done" plain [red]');

		expect(matches).toHaveLength(2);
		expect(matches[0]).toMatchObject({
			type: "color",
			text: "[accent]",
			tagValue: "accent",
			kind: "named",
			resolvedColor: "#ffd37f",
		});
		expect(matches[1]).toMatchObject({
			type: "reset",
			text: "[]",
		});
	});

	it("parses hex tags and ignores invalid color-like text", () => {
		const matches = parseMindustryStringTags('"[#f]ok [#12345678]alpha [#1234567]bad [bogus]bad"');

		expect(matches).toHaveLength(2);
		expect(matches[0]).toMatchObject({
			type: "color",
			text: "[#f]",
			tagValue: "#f",
			kind: "hex",
			resolvedColor: "#f00000ff",
		});
		expect(matches[1]).toMatchObject({
			type: "color",
			text: "[#12345678]",
			tagValue: "#12345678",
			kind: "hex",
			resolvedColor: "#12345678",
		});
	});

	it("finds editable tag at current column only when cursor stays inside tag range", () => {
		const line = '"[accent]Hello"';

		expect(findEditableColorTagAtColumn(line, 3)?.text).toBe("[accent]");
		expect(findEditableColorTagAtColumn(line, 10)).toBeNull();
	});

	it("normalizes mindustry colors for rendering and picker output", () => {
		expect(resolveMindustryColor("accent")).toBe("#ffd37f");
		expect(resolveMindustryColor("#abc")).toBe("#abc000ff");
		expect(resolveMindustryColor("#12345678")).toBe("#12345678");
		expect(toPickerColorValue("#12345678")).toBe("#123456");
	});

	it("formats replacement tags for named and custom colors", () => {
		expect(formatMindustryColorTag("scarlet")).toBe("[scarlet]");
		expect(formatMindustryColorTag("#FFAA11")).toBe("[#ffaa11]");
		expect(formatMindustryColorTag("#11223344")).toBe("[#112233]");
		expect(formatMindustryColorTag("bogus")).toBeNull();
	});
});
