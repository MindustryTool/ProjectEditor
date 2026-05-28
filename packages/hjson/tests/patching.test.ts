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

	it("patches inline array values", () => {
		const text = "dependencies: [core,graphics,]";
		const node = parseStructured(text);
		const newValue = HJSON.stringify(["logic", "ui"]);
		const patched = node.patchField(text, "dependencies", newValue);
		expect(patched).toBe(`dependencies: ${newValue}`);
	});

	it("patches empty arrays", () => {
		const text = "dependencies: []";
		const node = parseStructured(text);
		const newValue = HJSON.stringify(["core"]);
		const patched = node.patchField(text, "dependencies", newValue);
		expect(patched).toBe(`dependencies: ${newValue}`);
	});

	it("patches arrays back to empty arrays", () => {
		const text = "dependencies: [core,graphics,]";
		const node = parseStructured(text);
		const patched = node.patchField(text, "dependencies", "[]");
		expect(patched).toBe("dependencies: []");
	});

	it("inserts missing array fields", () => {
		const text = "name: example";
		const node = parseStructured(text);
		const newValue = HJSON.stringify(["core", "graphics"]);
		const patched = node.patchField(text, "dependencies", newValue);
		expect(patched).toBe(`name: example\ndependencies: ${newValue}\n`);
	});

	it("preserves surrounding comments and fields when patching multiline arrays", () => {
		const text = `name: example
# keep comment
dependencies: [
  core,
  graphics,
]
hidden: false`;
		const node = parseStructured(text);
		const newValue = HJSON.stringify(["logic", "ui"], null, 2);
		const patched = node.patchField(text, "dependencies", newValue);
		expect(patched).toBe(`name: example
# keep comment
dependencies: [
  logic,
  ui,
]
hidden: false`);
	});

	it("patches arrays with nested objects and arrays", () => {
		const text = "dependencies: [core,]";
		const node = parseStructured(text);
		const newValue = HJSON.stringify([{ name: "core", optional: true }, ["dep-a", "dep-b"]], null, 2);
		const patched = node.patchField(text, "dependencies", newValue);
		const reparsed = parseStructured(patched);
		expect(reparsed.valueOf()).toEqual({
			dependencies: [{ name: "core", optional: true }, ["dep-a", "dep-b"]],
		});
	});

	it("preserves whitespace between fields", () => {
		const text = "a: 1\n\n  b: 2";
		const node = parseStructured(text);
		const patched = node.patchField(text, "a", "10");
		expect(patched).toBe("a: 10\n\n  b: 2");
	});

	it("inserts missing fields into braced object", () => {
		const text = "{\n  hardness: 82\n}";
		const node = parseStructured(text);
		const patched = node.patchField(text, "buildable", "true");
		expect(patched).toBe("{\n  hardness: 82,\n  buildable: true\n}");
	});

	it("inserts multiple missing fields into braced object", () => {
		const text = `{hardness: 82, cost: 7, charge: 2, color: "#8D012B", research: oltuxium}`;
		const node = parseStructured(text);
		let patched = node.patchField(text, "buildable", "true");
		const node2 = parseStructured(patched);
		patched = node2.patchField(patched, "hidden", "true");
		expect(patched).not.toContain("buildable: true\nbuildable: true");
		expect(patched).not.toContain("hidden: true\nhidden: true");
		const reparsed = parseStructured(patched);
		expect(reparsed.valueOf()).toEqual({
			hardness: 82, cost: 7, charge: 2, color: "#8D012B", research: "oltuxium",
			buildable: true, hidden: true,
		});
	});

	it("inserts field after existing trailing comma", () => {
		const text = "{\n  hardness: 82,\n}";
		const node = parseStructured(text);
		const patched = node.patchField(text, "cost", "7");
		expect(patched).toBe("{\n  hardness: 82,\n  cost: 7\n}");
	});

	it("inserted field survives round-trip parse", () => {
		const text = "{\n  hardness: 82\n}";
		const node = parseStructured(text);
		const patched = node.patchField(text, "cost", "7");
		const reparsed = parseStructured(patched);
		expect(reparsed.valueOf()).toEqual({ hardness: 82, cost: 7 });
	});

	it("inserts field into object with no fields", () => {
		const text = "{}";
		const node = parseStructured(text);
		const patched = node.patchField(text, "active", "true");
		const reparsed = parseStructured(patched);
		expect(reparsed.valueOf()).toEqual({ active: true });
	});
});
