import { describe, it, expect } from "vitest";
import { HJSON, HjsonMissingNode, HjsonObjectNode, HjsonArrayNode, HjsonValueNode } from "@project/hjson";
import type { HjsonNode } from "@project/hjson";

function parseStructured(input: string) {
	return HJSON.parseStructured(input) as HjsonObjectNode;
}

function wrapArray(text: string): { node: HjsonArrayNode; original: string } {
	const original = `arr: ${text}`;
	const obj = HJSON.parseStructured(original) as HjsonObjectNode;
	return { node: obj.get("arr") as HjsonArrayNode, original };
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

describe("ElementInfo.replaceValue", () => {
	it("replaces string element", () => {
		const { node: arr, original } = wrapArray('[a, b, c]');
		const el = arr.at(0)!;
		const result = el.replaceValue(original, '"x"');
		expect(result).toBe('arr: ["x", b, c]');
		const arrayPart = result.slice(5);
		expect(arrayPart).toBe('["x", b, c]');
	});

	it("replaces numeric element", () => {
		const { node: arr, original } = wrapArray('[1, 2, 3]');
		const el = arr.at(1)!;
		const result = el.replaceValue(original, '42');
		expect(result).toBe('arr: [1, 42, 3]');
	});

	it("replaces boolean element", () => {
		const { node: arr, original } = wrapArray('[true, false]');
		const el = arr.at(0)!;
		const result = el.replaceValue(original, 'false');
		expect(result).toBe('arr: [false, false]');
	});

	it("replaces object element", () => {
		const { node: arr, original } = wrapArray('[{a: 1}, {b: 2}]');
		const el = arr.at(0)!;
		const result = el.replaceValue(original, '{c: 3}');
		expect(result).toBe('arr: [{c: 3}, {b: 2}]');
	});

	it("replaces array element", () => {
		const { node: arr, original } = wrapArray('[[1, 2], [3, 4]]');
		const el = arr.at(1)!;
		const result = el.replaceValue(original, '[5]');
		expect(result).toBe('arr: [[1, 2], [5]]');
	});
});

describe("HjsonArrayNode.patchElement", () => {
	it("replaces first element", () => {
		const { node: arr, original } = wrapArray('[a, b, c]');
		const result = arr.patchElement(original, 0, '"x"');
		expect(result).toBe('arr: ["x", b, c]');
	});

	it("replaces middle element", () => {
		const { node: arr, original } = wrapArray('[a, b, c]');
		const result = arr.patchElement(original, 1, '"y"');
		expect(result).toBe('arr: [a, "y", c]');
	});

	it("replaces last element", () => {
		const { node: arr, original } = wrapArray('[a, b, c]');
		const result = arr.patchElement(original, 2, '"z"');
		expect(result).toBe('arr: [a, b, "z"]');
	});

	it("returns original for out-of-bounds index", () => {
		const { node: arr, original } = wrapArray('[a, b]');
		const result = arr.patchElement(original, 99, '"x"');
		expect(result).toBe(original);
	});

	it("preserves surrounding content", () => {
		const { node: arr, original } = wrapArray('[a, b, c]');
		const result = arr.patchElement(original, 1, '"y"');
		expect(result).toBe('arr: [a, "y", c]');
	});
});

describe("HjsonArrayNode.insertElement", () => {
	it("inserts at beginning of inline array", () => {
		const { node: arr, original } = wrapArray('[b, c]');
		const result = arr.insertElement(original, 0, '"a"');
		expect(result).toBe('arr: ["a", b, c]');
	});

	it("inserts in middle of inline array", () => {
		const { node: arr, original } = wrapArray('[a, c]');
		const result = arr.insertElement(original, 1, '"b"');
		expect(result).toBe('arr: [a, "b", c]');
	});

	it("appends at end of inline array", () => {
		const { node: arr, original } = wrapArray('[a, b]');
		const result = arr.insertElement(original, 2, '"c"');
		expect(result).toBe('arr: [a, b, "c"]');
	});

	it("preserves trailing comma on append", () => {
		const { node: arr, original } = wrapArray('[a, b,]');
		const result = arr.insertElement(original, 2, '"c"');
		expect(result).toBe('arr: [a, b, "c",]');
	});

	it("inserts into empty array", () => {
		const { node: arr, original } = wrapArray('[]');
		const result = arr.insertElement(original, 0, '"a"');
		expect(result).toBe('arr: ["a"]');
	});
});

describe("HjsonArrayNode.removeElement", () => {
	it("removes first element", () => {
		const { node: arr, original } = wrapArray('[a, b, c]');
		const result = arr.removeElement(original, 0);
		expect(result).toBe('arr: [b, c]');
	});

	it("removes middle element", () => {
		const { node: arr, original } = wrapArray('[a, b, c]');
		const result = arr.removeElement(original, 1);
		expect(result).toBe('arr: [a, c]');
	});

	it("removes last element", () => {
		const { node: arr, original } = wrapArray('[a, b, c]');
		const result = arr.removeElement(original, 2);
		expect(result).toBe('arr: [a, b]');
	});

	it("removes single element leaving empty array", () => {
		const { node: arr, original } = wrapArray('[a]');
		const result = arr.removeElement(original, 0);
		expect(result).toBe('arr: []');
	});

	it("removes middle element with trailing comma", () => {
		const { node: arr, original } = wrapArray('[a, b, c,]');
		const result = arr.removeElement(original, 1);
		expect(result).toBe('arr: [a, c,]');
	});

	it("returns original for out-of-bounds index", () => {
		const { node: arr, original } = wrapArray('[a]');
		const result = arr.removeElement(original, 99);
		expect(result).toBe(original);
	});
});

describe("Comment patching on object fields", () => {
	it("replaces preceding comment", () => {
		const text = `# old comment
name: exogenesis`;
		const node = parseStructured(text);
		const result = node.patchComment(text, "name", "# new comment");
		expect(result).toBe(`# new comment
name: exogenesis`);
	});

	it("inserts comment when none exists", () => {
		const text = "name: exogenesis";
		const node = parseStructured(text);
		const result = node.patchComment(text, "name", "# added comment");
		expect(result).toBe("# added comment\nname: exogenesis");
	});
});

describe("Comment patching on array elements", () => {
	it("replaces preceding comment on element", () => {
		const text = `items: [
  # element comment
  a,
  b,
]`;
		const node = parseStructured(text);
		const arr = node.get("items") as HjsonArrayNode;
		const result = arr.patchComment(text, 0, "# new");
		expect(result).toContain("# new");
		expect(result).not.toContain("# element comment");
	});

	it("inserts comment before element when none exists", () => {
		const text = `items: [
  a,
  b,
]`;
		const node = parseStructured(text);
		const arr = node.get("items") as HjsonArrayNode;
		const result = arr.patchComment(text, 0, "# added");
		expect(result).toContain("# added");
		expect(result).toContain("a");
	});
});

describe("HjsonObjectNode.removeField", () => {
	it("removes only field from braced object leaving empty braces", () => {
		const text = "{name: exogenesis}";
		const node = parseStructured(text);
		const result = node.removeField(text, "name");
		expect(result).toBe("{}");
	});

	it("removes first field from flat multi-field object", () => {
		const text = "name: exo\n  version: 1\n  hidden: true";
		const node = parseStructured(text);
		const result = node.removeField(text, "name");
		expect(result).toBe("version: 1\n  hidden: true");
	});

	it("removes middle field from flat multi-field object", () => {
		const text = "name: exo\n  version: 1\n  hidden: true";
		const node = parseStructured(text);
		const result = node.removeField(text, "version");
		expect(result).toBe("name: exo\n  hidden: true");
	});

	it("removes last field from flat multi-field object", () => {
		const text = "name: exo\n  version: 1\n  hidden: true";
		const node = parseStructured(text);
		const result = node.removeField(text, "hidden");
		expect(result).toBe("name: exo\n  version: 1");
	});

	it("removes first field from braced multi-field object", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const node = parseStructured(text);
		const result = node.removeField(text, "a");
		expect(result).toBe("{b: 2, c: 3}");
	});

	it("removes middle field from braced multi-field object", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const node = parseStructured(text);
		const result = node.removeField(text, "b");
		expect(result).toBe("{a: 1, c: 3}");
	});

	it("removes last field from braced multi-field object", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const node = parseStructured(text);
		const result = node.removeField(text, "c");
		expect(result).toBe("{a: 1, b: 2}");
	});

	it("removes field with trailing comma preceding it", () => {
		const text = "{a: 1, b: 2,}";
		const node = parseStructured(text);
		const result = node.removeField(text, "b");
		expect(result).toBe("{a: 1,}");
	});

	it("returns original for non-existent key", () => {
		const text = "name: exo";
		const node = parseStructured(text);
		const result = node.removeField(text, "nonexistent");
		expect(result).toBe(text);
	});

	it("round-trips correctly after removing field", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const node = parseStructured(text);
		const patched = node.removeField(text, "b");
		const reparsed = HJSON.parse(patched);
		expect(reparsed).toEqual({ a: 1, c: 3 });
	});

	it("removes multiline field from braced object", () => {
		const text = `{
  name: exo,
  nested: {
    a: 1,
    b: 2
  },
  version: 1
}`;
		const node = parseStructured(text);
		const result = node.removeField(text, "nested");
		expect(result).toBe(`{
  name: exo,
  version: 1
}`);
		const reparsed = HJSON.parse(result);
		expect(reparsed).toEqual({ name: "exo", version: 1 });
	});

	it("removes last multiline field from braced object", () => {
		const text = `{
  name: exo,
  version: 1,
  nested: {
    a: 1,
    b: 2
  }
}`;
		const node = parseStructured(text);
		const result = node.removeField(text, "nested");
		expect(result).toBe(`{
  name: exo,
  version: 1
}`);
		const reparsed = HJSON.parse(result);
		expect(reparsed).toEqual({ name: "exo", version: 1 });
	});
});

describe("Sequential patching (stale node positions)", () => {
	it("sequential patchField preserves nested object structure", () => {
		const text = `{
  "cost": 1,
  "radioactivity": 0.3,
  "color": "#7AC27C",
  "research": {parent:team-quantra,requirements:["lead/200555555",],}
}`;
		let content = text;
		const serialized1 = HJSON.stringify({ parent: "team-quantra", requirements: ["lead/20055555"] });
		let node = HJSON.parseStructured(content) as HjsonObjectNode;
		content = node.patchField(content, "research", serialized1);

		const serialized2 = HJSON.stringify({ parent: "team-quantra", requirements: ["lead/200555"] });
		node = HJSON.parseStructured(content) as HjsonObjectNode;
		content = node.patchField(content, "research", serialized2);

		const serialized3 = HJSON.stringify({ parent: "team-quantra", requirements: ["lead/2005"] });
		node = HJSON.parseStructured(content) as HjsonObjectNode;
		content = node.patchField(content, "research", serialized3);

		expect(content).toContain('"research"');
		expect(content).toContain("team-quantra");
		expect(content).toContain("lead/2005");
		expect(content).toContain("}");
		const result = HJSON.parse(content);
		expect(result).toEqual({
			cost: 1,
			radioactivity: 0.3,
			color: "#7AC27C",
			research: { parent: "team-quantra", requirements: ["lead/2005"] },
		});
	});

	it("sequential patchField requires re-parse to avoid stale position drift", () => {
		// Simulates the real UI pattern: edit a nested object value character by character,
		// re-parsing the node after each edit to keep positions in sync
		const text = `{
  "cost": 1,
  "radioactivity": 0.3,
  "research": {parent:team-quantra,requirements:["lead/200555555",],}
}`;
		let content = text;
		const numbers = ["20055555", "2005555", "200555"];
		for (const num of numbers) {
			const serialized = HJSON.stringify({ parent: "team-quantra", requirements: ["lead/" + num] });
			const node = HJSON.parseStructured(content) as HjsonObjectNode; // re-parse each time
			content = node.patchField(content, "research", serialized);
		}
		const result = HJSON.parse(content);
		expect(result).toEqual({
			cost: 1,
			radioactivity: 0.3,
			research: { parent: "team-quantra", requirements: ["lead/200555"] },
		});
	});
});

describe("Nested object field patching (research)", () => {
	it("patchElement on nested array preserves multiline structure", () => {
		const text = `{
  "cost": 7,
  "hardness": 18,
  "color": "A9D8FFFF",
  "research": {
    "parent": "siradamite",
    "requirements": [
      "siradamite/200"
    ]
  }
}`;
		const root = HJSON.parseStructured(text) as HjsonObjectNode;
		const researchNode = root.get("research") as HjsonObjectNode;
		const reqField = researchNode.field("requirements")!;
		const arrNode = reqField.value as HjsonArrayNode;
		const content = arrNode.patchElement(text, 0, HJSON.stringify("siradamite/2000"));

		// Multiline array structure preserved: newlines and indentation unchanged
		expect(content).toBe(`{
  "cost": 7,
  "hardness": 18,
  "color": "A9D8FFFF",
  "research": {
    "parent": "siradamite",
    "requirements": [
      "siradamite/2000"
    ]
  }
}`);

		const result = HJSON.parse(content);
		expect(result).toEqual({
			cost: 7,
			hardness: 18,
			color: "A9D8FFFF",
			research: { parent: "siradamite", requirements: ["siradamite/2000"] },
		});
	});

	it("sequential patchElement on nested array with re-parse preserves multiline structure", () => {
		const text = `{
  "cost": 7,
  "hardness": 18,
  "color": "A9D8FFFF",
  "research": {
    "parent": "siradamite",
    "requirements": [
      "siradamite/200"
    ]
  }
}`;
		let content = text;
		for (const val of ["2000", "20000"]) {
			const root = HJSON.parseStructured(content) as HjsonObjectNode;
			const researchNode = root.get("research") as HjsonObjectNode;
			const reqField = researchNode.field("requirements")!;
			const arrNode = reqField.value as HjsonArrayNode;
			content = arrNode.patchElement(content, 0, HJSON.stringify("siradamite/" + val));
		}

		expect(content).toBe(`{
  "cost": 7,
  "hardness": 18,
  "color": "A9D8FFFF",
  "research": {
    "parent": "siradamite",
    "requirements": [
      "siradamite/20000"
    ]
  }
}`);

		const result = HJSON.parse(content);
		expect(result).toEqual({
			cost: 7,
			hardness: 18,
			color: "A9D8FFFF",
			research: { parent: "siradamite", requirements: ["siradamite/20000"] },
		});
	});
});

describe("Round-trip array patching", () => {
	it("patchElement round-trips correctly", () => {
		const { node: arr, original } = wrapArray('[1, 2, 3]');
		const patched = arr.patchElement(original, 1, '42');
		const reparsed = wrapArray(patched.slice(5)).node;
		expect(reparsed.valueOf()).toEqual([1, 42, 3]);
	});

	it("insertElement at end round-trips correctly", () => {
		const { node: arr, original } = wrapArray('[1, 2]');
		const patched = arr.insertElement(original, 2, '3');
		const reparsed = wrapArray(patched.slice(5)).node;
		expect(reparsed.valueOf()).toEqual([1, 2, 3]);
	});

	it("removeElement round-trips correctly", () => {
		const { node: arr, original } = wrapArray('[1, 2, 3]');
		const patched = arr.removeElement(original, 1);
		const reparsed = wrapArray(patched.slice(5)).node;
		expect(reparsed.valueOf()).toEqual([1, 3]);
	});

	it("comment patch round-trips correctly", () => {
		const text = `# old
name: exo`;
		const node = parseStructured(text);
		const patched = node.patchComment(text, "name", "# new");
		const reparsed = parseStructured(patched);
		expect((reparsed.field("name")?.value as HjsonNode).valueOf()).toBe("exo");
	});
});

describe("HjsonValueNode.patchValue", () => {
	it("replaces string value", () => {
		const text = 'name: "hello"';
		const root = parseStructured(text);
		const valueNode = root.get("name") as HjsonValueNode;
		const result = valueNode.patchValue(text, '"world"');
		expect(result).toBe('name: "world"');
	});

	it("replaces numeric value", () => {
		const text = "count: 42";
		const root = parseStructured(text);
		const valueNode = root.get("count") as HjsonValueNode;
		const result = valueNode.patchValue(text, "100");
		expect(result).toBe("count: 100");
	});

	it("replaces boolean value", () => {
		const text = "active: true";
		const root = parseStructured(text);
		const valueNode = root.get("active") as HjsonValueNode;
		const result = valueNode.patchValue(text, "false");
		expect(result).toBe("active: false");
	});

	it("replaces string value within nested object", () => {
		const text = 'obj: {name: "hello",}';
		const root = parseStructured(text);
		const obj = root.get("obj") as HjsonObjectNode;
		const nameField = obj.field("name")!;
		const valueNode = nameField.value as HjsonValueNode;
		const result = valueNode.patchValue(text, '"world"');
		expect(result).toBe('obj: {name: "world",}');
	});

	it("replaces numeric element value", () => {
		const text = "items: [1, 2, 3]";
		const root = parseStructured(text);
		const arr = root.get("items") as HjsonArrayNode;
		const el = arr.at(0)!;
		const valueNode = el.value as HjsonValueNode;
		const result = valueNode.patchValue(text, "42");
		expect(result).toBe("items: [42, 2, 3]");
	});

	it("preserves surrounding fields", () => {
		const text = "name: alpha\n  count: 42\n  active: true";
		const root = parseStructured(text);
		const valueNode = root.get("count") as HjsonValueNode;
		const result = valueNode.patchValue(text, "100");
		expect(result).toBe("name: alpha\n  count: 100\n  active: true");
	});
});

describe("Parent node access", () => {
	it("value node parent is set from object field", () => {
		const text = 'name: "hello"';
		const root = parseStructured(text);
		const valueNode = root.get("name") as HjsonValueNode;
		expect(valueNode.parent).toBe(root);
	});

	it("value node parent is set from array element", () => {
		const text = 'items: ["a", "b"]';
		const root = parseStructured(text);
		const arr = root.get("items") as HjsonArrayNode;
		const el0 = arr.at(0)!;
		const valueNode = el0.value as HjsonValueNode;
		expect(valueNode.parent).toBe(arr);
	});

	it("nested object parent is set correctly", () => {
		const text = "outer: {inner: {key: 1}}";
		const root = parseStructured(text);
		const outer = root.get("outer") as HjsonObjectNode;
		const inner = outer.get("inner") as HjsonObjectNode;
		expect(inner.parent).toBe(outer);
	});

	it("array parent is set correctly", () => {
		const text = "items: [1, 2, 3]";
		const root = parseStructured(text);
		const arr = root.get("items") as HjsonArrayNode;
		expect(arr.parent).toBe(root);
	});

	it("root node has undefined parent", () => {
		const text = "name: hello";
		const root = parseStructured(text);
		expect(root.parent).toBeUndefined();
	});

	it("HjsonMissingNode.parent is undefined", () => {
		expect(HjsonMissingNode.instance.parent).toBeUndefined();
	});

	it("upward traversal from leaf to root via repeated .parent", () => {
		const text = "a: {b: {c: 1}}";
		const root = parseStructured(text);
		const a = root.get("a") as HjsonObjectNode;
		const b = a.get("b") as HjsonObjectNode;
		const c = b.get("c") as HjsonValueNode;

		expect(c.parent).toBe(b);
		expect(c.parent!.parent).toBe(a);
		expect(c.parent!.parent!.parent).toBe(root);
		expect(c.parent!.parent!.parent!.parent).toBeUndefined();
	});

	it("chained parent access (node.parent.parent)", () => {
		const text = "a: {b: 1}";
		const root = parseStructured(text);
		const a = root.get("a") as HjsonObjectNode;
		const b = a.get("b") as HjsonValueNode;
		expect(b.parent!.parent).toBe(root);
	});

	it("node constructed without explicit parent has undefined parent", () => {
		const valueNode = new HjsonValueNode("test", { row: 1, col: 1, index: 0 }, { row: 1, col: 5, index: 4 });
		expect(valueNode.parent).toBeUndefined();
	});

	it("Object patchRemove removes own child (no parent delegation)", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const root = parseStructured(text);
		const result = root.patchRemove(text, "a");
		expect(result).toBe("{b: 2, c: 3}");
	});

	it("Array patchRemove removes own child (no parent delegation)", () => {
		const text = "arr: [1, 2, 3]";
		const root = parseStructured(text);
		const arr = root.get("arr") as HjsonArrayNode;
		const original = "arr: [1, 2, 3]";
		const result = arr.patchRemove(original, 0);
		expect(result).toBe("arr: [2, 3]");
	});

	it("ValueNode patchRemove delegates to parent when parent exists", () => {
		// ValueNode.patchRemove delegates to parent when parent is set
		const text = "{a: 1, b: 2}";
		const root = parseStructured(text);
		const bNode = root.get("b") as HjsonValueNode;
		const result = bNode.patchRemove(text, "b");
		expect(result).toBe("{a: 1}");
	});

	it("ValueNode patchRemove removes inline when no parent", () => {
		// A standalone value node (no parent) removes itself inline
		const standalone = new HjsonValueNode("hello", { row: 1, col: 1, index: 0 }, { row: 1, col: 6, index: 5 });
		const original = "hello";
		const result = standalone.patchRemove(original, "");
		expect(result).toBe("");
	});
});
