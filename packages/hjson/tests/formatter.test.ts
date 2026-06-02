import { describe, expect, it } from "vitest";
import { HJSON } from "@project/hjson";

describe("Formatter", () => {
	it("formats valid braced documents with stable layout", () => {
		const input = "{b:2,a:[1,{c:true}]}";

		const formatted = HJSON.format(input);

		expect(formatted).toBe("{\n  b: 2,\n  a: [\n    1,\n    {\n      c: true,\n    },\n  ],\n}");
		expect(HJSON.format(formatted)).toBe(formatted);
	});

	it("keeps formatted valid documents parse-equivalent", () => {
		const input = "{name:test,enabled:true,count:2}";

		const formatted = HJSON.format(input);

		expect(HJSON.parse(formatted)).toEqual(HJSON.parse(input));
	});

	it("preserves comments and blank lines", () => {
		const input = "{\n  # keep comment\n  name: test\n\n  version: 1\n}";

		expect(HJSON.format(input)).toBe(input);
	});

	it("preserves multiline string payload", () => {
		const input = "{\n  text: '''\n    hello\n    world\n    '''\n}";

		expect(HJSON.format(input)).toBe(input);
		expect(HJSON.parse(HJSON.format(input))).toEqual(HJSON.parse(input));
	});

	it("preserves invalid input without data loss", () => {
		const input = "{name: test,, version: 1}";

		expect(HJSON.format(input)).toBe(input);
	});

	it("preserves trailing invalid source", () => {
		const input = "{name: test}\n@oops";

		expect(HJSON.format(input)).toBe(input);
	});
});
