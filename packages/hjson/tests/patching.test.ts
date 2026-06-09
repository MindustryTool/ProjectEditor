import { describe, it, expect } from "vitest";
import { HJSON, HjsonMissingNode, HjsonObjectNode, HjsonArrayNode, HjsonValueNode } from "@project/hjson";
import type { FieldInfo, ElementInfo, HjsonNode } from "@project/hjson";

function parseStructured(input: string) {
	return HJSON.parseStructured(input) as HjsonObjectNode;
}

function wrapArray(text: string): { node: HjsonArrayNode; original: string } {
	const original = `arr: ${text}`;
	const obj = HJSON.parseStructured(original) as HjsonObjectNode;
	return { node: obj.get("arr") as HjsonArrayNode, original };
}

// ---------------------------------------------------------------------------
// FieldInfo / ElementInfo replaceValue
// ---------------------------------------------------------------------------

describe("FieldInfo.replaceValue", () => {
	it("replaces existing field value in source", () => {
		const text = 'name: "old"';
		const root = parseStructured(text);
		const field = root.field("name")!;
		const result = field.replaceValue(text, '"new"');
		expect(result).toBe('name: "new"');
	});

	it("replaces numeric field value in source", () => {
		const text = "version: 1";
		const root = parseStructured(text);
		const field = root.field("version")!;
		const result = field.replaceValue(text, "42");
		expect(result).toBe("version: 42");
	});
});

describe("ElementInfo.replaceValue", () => {
	it("replaces string element in source", () => {
		const { node: arr, original } = wrapArray("[a, b, c]");
		const el = arr.at(0)!;
		const result = el.replaceValue(original, '"x"');
		expect(result).toBe('arr: ["x", b, c]');
	});

	it("replaces last element in source", () => {
		const { node: arr, original } = wrapArray("[1, 2, 3]");
		const el = arr.at(2)!;
		const result = el.replaceValue(original, "99");
		expect(result).toBe("arr: [1, 2, 99]");
	});
});

// ---------------------------------------------------------------------------
// HjsonObjectNode.patchValue
// ---------------------------------------------------------------------------

describe("HjsonObjectNode.patchValue", () => {
	it("replaces existing field value", () => {
		const text = 'name: "old"';
		const root = parseStructured(text);
		const result = root.patchValue(text, "name", '"new"');
		expect(result).toBe('name: "new"');
	});

	it("inserts new field when key does not exist", () => {
		const text = 'name: "test"';
		const root = parseStructured(text);
		const result = root.patchValue(text, "version", '"1.0"');
		expect(result).toBe('name: "test"\nversion: "1.0"\n');
	});

	it("throws when key is not a string", () => {
		const text = "a: 1";
		const root = parseStructured(text);
		expect(() => root.patchValue(text, 42 as unknown as string, "2")).toThrow("key must be a string");
	});
});

// ---------------------------------------------------------------------------
// HjsonObjectNode.removeField
// ---------------------------------------------------------------------------

describe("HjsonObjectNode.removeField", () => {
	it("removes only field from a flat object (non-braced root)", () => {
		const text = "{name: exo}";
		const root = HJSON.parseStructured(text) as HjsonObjectNode;
		const result = root.removeField(text, "name");
		expect(result).toBe("{}");
	});

	it("removes the only field from a braced object", () => {
		const text = "{name: exo}";
		const root = parseStructured(text);
		const result = root.removeField(text, "name");
		expect(result).toBe("{}");
	});

	it("removes first field of a flat multi-field object", () => {
		const text = "a: 1\n  b: 2\n  c: 3";
		const root = parseStructured(text);
		const result = root.removeField(text, "a");
		expect(result).toBe("b: 2\n  c: 3");
	});

	it("removes middle field of a flat multi-field object", () => {
		const text = "a: 1\n  b: 2\n  c: 3";
		const root = parseStructured(text);
		const result = root.removeField(text, "b");
		expect(result).toBe("a: 1\n  c: 3");
	});

	it("removes last field of a flat multi-field object", () => {
		const text = "a: 1\n  b: 2\n  c: 3";
		const root = parseStructured(text);
		const result = root.removeField(text, "c");
		expect(result).toBe("a: 1\n  b: 2");
	});

	it("removes first field from a braced inline object", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const root = parseStructured(text);
		const result = root.removeField(text, "a");
		expect(result).toBe("{b: 2, c: 3}");
	});

	it("removes middle field from a braced inline object", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const root = parseStructured(text);
		const result = root.removeField(text, "b");
		expect(result).toBe("{a: 1, c: 3}");
	});

	it("removes last field from a braced inline object", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const root = parseStructured(text);
		const result = root.removeField(text, "c");
		expect(result).toBe("{a: 1, b: 2}");
	});

	it("returns original when key does not exist", () => {
		const text = "a: 1";
		const root = parseStructured(text);
		const result = root.removeField(text, "nonexistent");
		expect(result).toBe(text);
	});

	it("removes a multiline field from a braced object", () => {
		const text = `{
  a: 1,
  nested: {
    x: 10,
    y: 20
  },
  b: 2
}`;
		const root = parseStructured(text);
		const result = root.removeField(text, "nested");
		expect(result).toBe(`{
  a: 1,
  b: 2
}`);
	});

	it("removes last multiline field from a braced object", () => {
		const text = `{
  a: 1,
  b: 2,
  nested: {
    x: 10
  }
}`;
		const root = parseStructured(text);
		const result = root.removeField(text, "nested");
		expect(result).toBe(`{
  a: 1,
  b: 2
}`);
	});

	it("handles trailing comma before the removed field", () => {
		const text = "{a: 1, b: 2,}";
		const root = parseStructured(text);
		const result = root.removeField(text, "b");
		expect(result).toBe("{a: 1,}");
	});

	it("round-trips after removing a field", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const root = parseStructured(text);
		const patched = root.removeField(text, "b");
		const parsed = HJSON.parse(patched);
		expect(parsed).toEqual({ a: 1, c: 3 });
	});
});

// ---------------------------------------------------------------------------
// HjsonObjectNode.insertField
// ---------------------------------------------------------------------------

describe("HjsonObjectNode.insertField", () => {
	it("inserts into a braced object with existing fields", () => {
		const text = "{\n  hardness: 82\n}";
		const root = parseStructured(text);
		const result = root.insertField(text, "cost", "7");
		expect(result).toBe("{\n  hardness: 82,\n  cost: 7\n}");
	});

	it("inserts into an empty braced object", () => {
		const text = "{}";
		const root = parseStructured(text);
		const result = root.insertField(text, "active", "true");
		expect(result).toBe("{\n  active: true\n}");
	});

	it("inserts into a flat root object (no braces)", () => {
		const text = "a: 1";
		const root = parseStructured(text);
		const result = root.insertField(text, "b", "2");
		expect(result).toBe("a: 1\nb: 2\n");
	});

	it("inserts at end after trailing comma", () => {
		const text = "{\n  a: 1,\n}";
		const root = parseStructured(text);
		const result = root.insertField(text, "b", "2");
		expect(result).toBe("{\n  a: 1,\n  b: 2\n}");
	});

	it("respects existing indentation when inserting", () => {
		const text = "{\n    a: 1\n}";
		const root = parseStructured(text);
		const result = root.insertField(text, "b", "2");
		expect(result).toBe("{\n    a: 1,\n    b: 2\n}");
	});
});

// ---------------------------------------------------------------------------
// HjsonObjectNode.patchComment
// ---------------------------------------------------------------------------

describe("HjsonObjectNode.patchComment", () => {
	it("replaces an existing preceding comment", () => {
		const text = "# old\nname: exo";
		const root = parseStructured(text);
		const result = root.patchComment(text, "name", "# new");
		expect(result).toBe("# new\nname: exo");
	});

	it("inserts a comment when none exists", () => {
		const text = "name: exo";
		const root = parseStructured(text);
		const result = root.patchComment(text, "name", "# added");
		expect(result).toBe("# added\nname: exo");
	});

	it("returns original when field key does not exist", () => {
		const text = "a: 1";
		const root = parseStructured(text);
		const result = root.patchComment(text, "nonexistent", "# comment");
		expect(result).toBe(text);
	});
});

// ---------------------------------------------------------------------------
// HjsonArrayNode.patchValue
// ---------------------------------------------------------------------------

describe("HjsonArrayNode.patchValue", () => {
	it("replaces element at given index", () => {
		const { node: arr, original } = wrapArray("[a, b, c]");
		const result = arr.patchValue(original, 1, '"y"');
		expect(result).toBe('arr: [a, "y", c]');
	});

	it("replaces first element", () => {
		const { node: arr, original } = wrapArray("[a, b, c]");
		const result = arr.patchValue(original, 0, '"x"');
		expect(result).toBe('arr: ["x", b, c]');
	});

	it("replaces last element", () => {
		const { node: arr, original } = wrapArray("[a, b, c]");
		const result = arr.patchValue(original, 2, '"z"');
		expect(result).toBe('arr: [a, b, "z"]');
	});

	it("returns original for out-of-bounds index", () => {
		const { node: arr, original } = wrapArray("[a]");
		const result = arr.patchValue(original, 99, '"x"');
		expect(result).toBe(original);
	});

	it("throws when key is not a number", () => {
		const { node: arr, original } = wrapArray("[a]");
		expect(() => arr.patchValue(original, "bad" as unknown as number, '"x"')).toThrow("key must be a number");
	});
});

// ---------------------------------------------------------------------------
// HjsonArrayNode.insertElement
// ---------------------------------------------------------------------------

describe("HjsonArrayNode.insertElement", () => {
	it("inserts at beginning of an inline array", () => {
		const { node: arr, original } = wrapArray("[b, c]");
		const result = arr.insertElement(original, 0, '"a"');
		expect(result).toBe('arr: ["a", b, c]');
	});

	it("inserts in the middle of an inline array", () => {
		const { node: arr, original } = wrapArray("[a, c]");
		const result = arr.insertElement(original, 1, '"b"');
		expect(result).toBe('arr: [a, "b", c]');
	});

	it("appends at the end of an inline array", () => {
		const { node: arr, original } = wrapArray("[a, b]");
		const result = arr.insertElement(original, 2, '"c"');
		expect(result).toBe('arr: [a, b, "c"]');
	});

	it("inserts into an empty array", () => {
		const { node: arr, original } = wrapArray("[]");
		const result = arr.insertElement(original, 0, '"a"');
		expect(result).toBe('arr: ["a"]');
	});

	it("preserves trailing comma when appending", () => {
		const { node: arr, original } = wrapArray("[a, b,]");
		const result = arr.insertElement(original, 2, '"c"');
		expect(result).toBe('arr: [a, b, "c",]');
	});

	it("returns original for out-of-bounds index", () => {
		const { node: arr, original } = wrapArray("[a]");
		const result = arr.insertElement(original, 5, '"b"');
		expect(result).toBe(original);
	});

	it("returns original for negative index", () => {
		const { node: arr, original } = wrapArray("[a]");
		const result = arr.insertElement(original, -1, '"b"');
		expect(result).toBe(original);
	});
});

// ---------------------------------------------------------------------------
// HjsonArrayNode.removeElement
// ---------------------------------------------------------------------------

describe("HjsonArrayNode.removeElement", () => {
	it("removes first element", () => {
		const { node: arr, original } = wrapArray("[a, b, c]");
		const result = arr.removeElement(original, 0);
		expect(result).toBe("arr: [b, c]");
	});

	it("removes middle element", () => {
		const { node: arr, original } = wrapArray("[a, b, c]");
		const result = arr.removeElement(original, 1);
		expect(result).toBe("arr: [a, c]");
	});

	it("removes last element", () => {
		const { node: arr, original } = wrapArray("[a, b, c]");
		const result = arr.removeElement(original, 2);
		expect(result).toBe("arr: [a, b]");
	});

	it("removes single element leaving empty array", () => {
		const { node: arr, original } = wrapArray("[a]");
		const result = arr.removeElement(original, 0);
		expect(result).toBe("arr: []");
	});

	it("preserves trailing comma after removal", () => {
		const { node: arr, original } = wrapArray("[a, b, c,]");
		const result = arr.removeElement(original, 1);
		expect(result).toBe("arr: [a, c,]");
	});

	it("returns original for out-of-bounds index", () => {
		const { node: arr, original } = wrapArray("[a]");
		const result = arr.removeElement(original, 99);
		expect(result).toBe(original);
	});

	it("returns original for negative index", () => {
		const { node: arr, original } = wrapArray("[a]");
		const result = arr.removeElement(original, -1);
		expect(result).toBe(original);
	});
});

// ---------------------------------------------------------------------------
// HjsonArrayNode.patchComment
// ---------------------------------------------------------------------------

describe("HjsonArrayNode.patchComment", () => {
	it("replaces an existing preceding comment on an element", () => {
		const text = `items: [
  # old
  a,
  b
]`;
		const root = parseStructured(text);
		const arr = root.get("items") as HjsonArrayNode;
		const result = arr.patchComment(text, 0, "# new");
		expect(result).toContain("# new");
		expect(result).not.toContain("# old");
	});

	it("inserts a comment before element when none exists", () => {
		const text = `items: [
  a,
  b
]`;
		const root = parseStructured(text);
		const arr = root.get("items") as HjsonArrayNode;
		const result = arr.patchComment(text, 0, "# added");
		expect(result).toContain("# added");
	});

	it("returns original when element index does not exist", () => {
		const text = `items: [a]`;
		const root = parseStructured(text);
		const arr = root.get("items") as HjsonArrayNode;
		const result = arr.patchComment(text, 99, "# comment");
		expect(result).toBe(text);
	});
});

// ---------------------------------------------------------------------------
// HjsonValueNode.patchValue
// ---------------------------------------------------------------------------

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

	it("replaces value within a nested object", () => {
		const text = 'obj: {inner: "val"}';
		const root = parseStructured(text);
		const obj = root.get("obj") as HjsonObjectNode;
		const inner = obj.get("inner") as HjsonValueNode;
		const result = inner.patchValue(text, '"new-val"');
		expect(result).toBe('obj: {inner: "new-val"}');
	});

	it("replaces value within an array element", () => {
		const text = "items: [1, 2, 3]";
		const root = parseStructured(text);
		const arr = root.get("items") as HjsonArrayNode;
		const el = arr.at(0)!;
		const valueNode = el.value as HjsonValueNode;
		const result = valueNode.patchValue(text, "42");
		expect(result).toBe("items: [42, 2, 3]");
	});
});

// ---------------------------------------------------------------------------
// HjsonValueNode.patchRemove
// ---------------------------------------------------------------------------

describe("HjsonValueNode.patchRemove", () => {
	it("delegates to parent object when parent is set", () => {
		const text = "{a: 1, b: 2}";
		const root = parseStructured(text);
		const bNode = root.get("b") as HjsonValueNode;
		const result = bNode.patchRemove(text, "b");
		expect(result).toBe("{a: 1}");
	});

	it("removes inline when node has no parent", () => {
		const standalone = new HjsonValueNode("hello", { row: 1, col: 1, index: 0 }, { row: 1, col: 6, index: 5 });
		const result = standalone.patchRemove("hello", "");
		expect(result).toBe("");
	});
});

// ---------------------------------------------------------------------------
// HjsonMissingNode
// ---------------------------------------------------------------------------

describe("HjsonMissingNode", () => {
	it("patchValue throws", () => {
		expect(() => HjsonMissingNode.instance.patchValue("", "", "")).toThrow("Cannot patch missing node");
	});

	it("patchRemove throws", () => {
		expect(() => HjsonMissingNode.instance.patchRemove("", "")).toThrow("Missing node cannot be removed");
	});
});

// ---------------------------------------------------------------------------
// Sequential / round-trip patching
// ---------------------------------------------------------------------------

describe("Sequential patching", () => {
	it("patchField sequentially with re-parse preserves structure", () => {
		const text = `{
  "cost": 1,
  "research": {parent: team-quantra, requirements: ["lead/200555555"]}
}`;
		let content = text;
		const values = ["lead/20055555", "lead/200555"];
		for (const v of values) {
			const node = HJSON.parseStructured(content) as HjsonObjectNode;
			const serialized = HJSON.stringify({ parent: "team-quantra", requirements: [v] });
			content = node.patchValue(content, "research", serialized);
		}
		const result = HJSON.parse(content);
		expect(result).toEqual({
			cost: 1,
			research: { parent: "team-quantra", requirements: ["lead/200555"] },
		});
	});
});

describe("Round-trip patching", () => {
	it("patchValue round-trips correctly", () => {
		const text = "{a: 1, b: 2, c: 3}";
		const root = parseStructured(text);
		const patched = root.patchValue(text, "b", "42");
		const parsed = HJSON.parse(patched);
		expect(parsed).toEqual({ a: 1, b: 42, c: 3 });
	});

	it("insertField round-trips correctly", () => {
		const text = "{a: 1}";
		const root = parseStructured(text);
		const patched = root.insertField(text, "b", "2");
		const parsed = HJSON.parse(patched);
		expect(parsed).toEqual({ a: 1, b: 2 });
	});

	it("insertElement round-trips correctly", () => {
		const { node: arr, original } = wrapArray("[1, 2]");
		const patched = arr.insertElement(original, 2, "3");
		const reparsed = wrapArray(patched.slice(5)).node;
		expect(reparsed.valueOf()).toEqual([1, 2, 3]);
	});

	it("removeElement round-trips correctly", () => {
		const { node: arr, original } = wrapArray("[1, 2, 3]");
		const patched = arr.removeElement(original, 1);
		const reparsed = wrapArray(patched.slice(5)).node;
		expect(reparsed.valueOf()).toEqual([1, 3]);
	});
});
