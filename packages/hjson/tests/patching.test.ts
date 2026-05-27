import { describe, it, expect } from "vitest";
import { HJSON } from "../src/hjson.js";
import { StructuredObjectNode } from "../src/structured.js";

function parseStructured(input: string) {
	return HJSON.parseStructured(input) as StructuredObjectNode;
}

describe("Surgical Patching", () => {
	it("patches string values", () => {
		const text = 'name: "old-name"';
		const node = parseStructured(text);
		const newText = node.patchField(text, "name", '"new-name"');
		expect(newText).toBe('name: "new-name"');
	});

	it("patches numeric values", () => {
		const text = "version: 1";
		const node = parseStructured(text);
		const newText = node.patchField(text, "version", "2");
		expect(newText).toBe("version: 2");
	});

	it("patches boolean values", () => {
		const text = "hidden: false";
		const node = parseStructured(text);
		const newText = node.patchField(text, "hidden", "true");
		expect(newText).toBe("hidden: true");
	});

	it("patches null values", () => {
		const text = "description: null";
		const node = parseStructured(text);
		const newText = node.patchField(text, "description", '"some description"');
		expect(newText).toBe('description: "some description"');
	});

	it("inserts missing fields", () => {
		const text = "name: example";
		const node = parseStructured(text);
		const newText = node.patchField(text, "version", '"1.0.0"');
		expect(newText).toBe('name: example\nversion: "1.0.0"\n');
	});

	it("preserves comments and formatting (Exogenesis example)", () => {
		const text = `{ 
   displayName: "[cyan]Exogenesis", 
   name: exogenesis, 
   author: "[blue]AureusStratus", 
   description: "A mod that adds in a butt load of content", 
   minGameVersion: "151", 
   # This is a 
   version: "[blue]1.9.1", 
 }`;
		const node = parseStructured(text);

		// Patch displayName
		let patched = node.patchField(text, "displayName", '"Exo"');
		expect(patched).toContain('displayName: "Exo"');
		expect(patched).toContain("# This is a");
		expect(patched).toContain("name: exogenesis");

		// Patch version
		const node2 = parseStructured(patched);
		patched = node2.patchField(patched, "version", '"2.0.0"');
		expect(patched).toContain('version: "2.0.0"');
		expect(patched).toContain("# This is a");
		expect(patched).toContain('displayName: "Exo"');
	});

	it("handles unquoted strings correctly", () => {
		const text = "name: exogenesis";
		const node = parseStructured(text);
		const patched = node.patchField(text, "name", "exo");
		expect(patched).toBe("name: exo");
	});

	it("preserves whitespace between fields", () => {
		const text = "a: 1\n\n  b: 2";
		const node = parseStructured(text);
		const patched = node.patchField(text, "a", "10");
		expect(patched).toBe("a: 10\n\n  b: 2");
	});
});
