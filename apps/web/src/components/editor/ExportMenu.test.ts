import { describe, it, expect } from "vitest";
import { sanitizeFilename } from "./ExportMenu";

describe("sanitizeFilename", () => {
	it("replaces spaces with hyphens", () => {
		expect(sanitizeFilename("My Mod")).toBe("My-Mod");
	});

	it("replaces special characters with hyphens", () => {
		expect(sanitizeFilename("My!Mod@v2#")).toBe("My-Mod-v2");
	});

	it("collapses consecutive hyphens", () => {
		expect(sanitizeFilename("My!!Mod")).toBe("My-Mod");
	});

	it("trims leading hyphens and periods", () => {
		expect(sanitizeFilename("!MyMod")).toBe("MyMod");
	});

	it("trims trailing hyphens and periods", () => {
		expect(sanitizeFilename("MyMod!")).toBe("MyMod");
	});

	it("allows hyphens, underscores, and periods in the name", () => {
		expect(sanitizeFilename("my-mod_v2.patch")).toBe("my-mod_v2.patch");
	});

	it("caps length at 200 characters", () => {
		const longName = "a".repeat(250);
		const result = sanitizeFilename(longName);
		expect(result.length).toBe(200);
	});

	it("falls back to 'export' for all-invalid names", () => {
		expect(sanitizeFilename("!!!???")).toBe("export");
	});

	it("preserves valid alphanumeric names unchanged", () => {
		expect(sanitizeFilename("Project42")).toBe("Project42");
	});

	it("handles empty string fallback", () => {
		expect(sanitizeFilename("")).toBe("export");
	});
});
