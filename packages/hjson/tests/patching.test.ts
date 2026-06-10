import { describe, it, expect } from "vitest";
import { HJSON, HjsonMissingNode, HjsonObjectNode, HjsonArrayNode, HjsonValueNode } from "@project/hjson";
import type { FieldInfo, ElementInfo, HjsonNode } from "@project/hjson";

function parseStructured(input: string) {
	return HJSON.parseStructured(input) as HjsonObjectNode;
}

// ---------------------------------------------------------------------------
// FieldInfo / ElementInfo replaceValue
// ---------------------------------------------------------------------------

describe("FieldInfo.replaceValue", () => {
	it("replaces existing field value in source", () => {
		const pre = { name: "old" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const field = root.field("name")!;
		const result = field.replaceValue(text, "new");
		const post = { name: "new" };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces numeric field value in source", () => {
		const pre = { version: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const field = root.field("version")!;
		const result = field.replaceValue(text, 42);
		const post = { version: 42 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with null", () => {
		const pre = { name: "old" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const field = root.field("name")!;
		const result = field.replaceValue(text, null);
		const post = { name: null };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with empty string", () => {
		const pre = { name: "old" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const field = root.field("name")!;
		const result = field.replaceValue(text, "");
		const post = { name: "" };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with empty array", () => {
		const pre = { name: "old" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const field = root.field("name")!;
		const result = field.replaceValue(text, []);
		const post = { name: [] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with empty object", () => {
		const pre = { name: "old" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const field = root.field("name")!;
		const result = field.replaceValue(text, {});
		const post = { name: {} };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});
});

describe("ElementInfo.replaceValue", () => {
	it("replaces string element in source", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const el = arr.at(0)!;
		const result = el.replaceValue(text, "x");
		const post = { data: ["x", "b", "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces last element in source", () => {
		const pre = { data: [1, 2, 3] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const el = arr.at(2)!;
		const result = el.replaceValue(text, 99);
		const post = { data: [1, 2, 99] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces element with null", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const el = arr.at(1)!;
		const result = el.replaceValue(text, null);
		const post = { data: ["a", null, "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces element with empty string", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const el = arr.at(1)!;
		const result = el.replaceValue(text, "");
		const post = { data: ["a", "", "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces element with empty array", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const el = arr.at(1)!;
		const result = el.replaceValue(text, []);
		const post = { data: ["a", [], "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces element with empty object", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const el = arr.at(1)!;
		const result = el.replaceValue(text, {});
		const post = { data: ["a", {}, "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});
});

// ---------------------------------------------------------------------------
// HjsonObjectNode.patchValue
// ---------------------------------------------------------------------------

describe("HjsonObjectNode.patchValue", () => {
	it("replaces existing field value", () => {
		const pre = { name: "old" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.patchValue(text, "name", "new");
		const post = { name: "new" };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("inserts new field when key does not exist", () => {
		const pre = { name: "test" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.patchValue(text, "version", "1.0");
		const post = { name: "test", version: "1.0" };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with null", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.patchValue(text, "a", null);
		const post = { a: null };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("inserts null field when key does not exist", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.patchValue(text, "b", null);
		const post = { a: 1, b: null };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with empty string", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.patchValue(text, "a", "");
		const post = { a: "" };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with empty array", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.patchValue(text, "a", []);
		const post = { a: [] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with empty object", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.patchValue(text, "a", {});
		const post = { a: {} };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("throws when key is not a string", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		expect(() => root.patchValue(text, 42 as unknown as string, 2)).toThrow("key must be a string");
	});
});

// ---------------------------------------------------------------------------
// HjsonObjectNode.removeField
// ---------------------------------------------------------------------------

describe("HjsonObjectNode.removeField", () => {
	it("removes only field leaving empty object", () => {
		const pre = { name: "exo" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.removeField(text, "name");
		const post = {};
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("removes first field of a multi-field object", () => {
		const pre = { a: 1, b: 2, c: 3 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.removeField(text, "a");
		const post = { b: 2, c: 3 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("removes middle field of a multi-field object", () => {
		const pre = { a: 1, b: 2, c: 3 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.removeField(text, "b");
		const post = { a: 1, c: 3 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("removes last field of a multi-field object", () => {
		const pre = { a: 1, b: 2, c: 3 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.removeField(text, "c");
		const post = { a: 1, b: 2 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("returns original when key does not exist", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.removeField(text, "nonexistent");
		expect(result).toBe(HJSON.stringify(pre, null, 2));
	});

	it("removes a multiline nested field from a braced object", () => {
		const pre = { a: 1, nested: { x: 10, y: 20 }, b: 2 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.removeField(text, "nested");
		const post = { a: 1, b: 2 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("removes last multiline nested field from a braced object", () => {
		const pre = { a: 1, b: 2, nested: { x: 10 } };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.removeField(text, "nested");
		const post = { a: 1, b: 2 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("handles trailing comma before the removed field", () => {
		const pre = { a: 1, b: 2 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.removeField(text, "b");
		const post = { a: 1 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});
});

// ---------------------------------------------------------------------------
// HjsonObjectNode.insertField
// ---------------------------------------------------------------------------

describe("HjsonObjectNode.insertField", () => {
	it("inserts into a braced object with existing fields", () => {
		const pre = { hardness: 82 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.insertField(text, "cost", 7);
		const post = { hardness: 82, cost: 7 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("inserts into an empty braced object", () => {
		const pre = {};
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.insertField(text, "active", true);
		const post = { active: true };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("inserts into an object with field", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.insertField(text, "b", 2);
		const post = { a: 1, b: 2 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("inserts into empty nested braced object with correct indent", () => {
		const pre = { a: {} };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const innerObj = root.get("a") as HjsonObjectNode;
		const result = innerObj.insertField(text, "b", 1);
		const post = { a: { b: 1 } };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("inserts into deeply nested empty object (3 levels)", () => {
		const pre = { a: { b: {} } };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const innerObj = root.get("a").get("b") as HjsonObjectNode;
		const result = innerObj.insertField(text, "c", 1);
		const post = { a: { b: { c: 1 } } };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});
});



// ---------------------------------------------------------------------------
// HjsonArrayNode.patchValue
// ---------------------------------------------------------------------------

describe("HjsonArrayNode.patchValue", () => {
	it("replaces element at given index", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.patchValue(text, 1, "y");
		const post = { data: ["a", "y", "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces first element", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.patchValue(text, 0, "x");
		const post = { data: ["x", "b", "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces last element", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.patchValue(text, 2, "z");
		const post = { data: ["a", "b", "z"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("returns original for out-of-bounds index", () => {
		const pre = { data: ["a"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.patchValue(text, 99, "x");
		expect(result).toBe(HJSON.stringify(pre, null, 2));
	});

	it("replaces with null", () => {
		const pre = { data: [1, 2, 3] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.patchValue(text, 1, null);
		const post = { data: [1, null, 3] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with empty string", () => {
		const pre = { data: [1, 2, 3] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.patchValue(text, 1, "");
		const post = { data: [1, "", 3] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with empty array", () => {
		const pre = { data: [1, 2, 3] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.patchValue(text, 1, []);
		const post = { data: [1, [], 3] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces with empty object", () => {
		const pre = { data: [1, 2, 3] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.patchValue(text, 1, {});
		const post = { data: [1, {}, 3] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("throws when key is not a number", () => {
		const pre = { data: ["a"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		expect(() => arr.patchValue(text, "bad" as unknown as number, "x")).toThrow("key must be a number");
	});
});

// ---------------------------------------------------------------------------
// HjsonArrayNode.insertElement
// ---------------------------------------------------------------------------

describe("HjsonArrayNode.insertElement", () => {
	it("inserts at beginning of an array", () => {
		const pre = { data: ["b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.insertElement(text, 0, "a");
		const post = { data: ["a", "b", "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("inserts in the middle of an array", () => {
		const pre = { data: ["a", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.insertElement(text, 1, "b");
		const post = { data: ["a", "b", "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("appends at the end of an array", () => {
		const pre = { data: ["a", "b"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.insertElement(text, 2, "c");
		const post = { data: ["a", "b", "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("inserts into an empty array", () => {
		const pre = { data: [] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.insertElement(text, 0, "a");
		const post = { data: ["a"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("returns original for out-of-bounds index", () => {
		const pre = { data: ["a"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.insertElement(text, 5, "b");
		expect(result).toBe(HJSON.stringify(pre, null, 2));
	});

	it("returns original for negative index", () => {
		const pre = { data: ["a"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.insertElement(text, -1, "b");
		expect(result).toBe(HJSON.stringify(pre, null, 2));
	});

	it("inserts element into empty nested array stays inline", () => {
		const pre = { items: [] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("items") as HjsonArrayNode;
		const result = arr.insertElement(text, 0, 1);
		const post = { items: [1] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});
});

// ---------------------------------------------------------------------------
// HjsonArrayNode.removeElement
// ---------------------------------------------------------------------------

describe("HjsonArrayNode.removeElement", () => {
	it("removes first element", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.removeElement(text, 0);
		const post = { data: ["b", "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("removes middle element", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.removeElement(text, 1);
		const post = { data: ["a", "c"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("removes last element", () => {
		const pre = { data: ["a", "b", "c"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.removeElement(text, 2);
		const post = { data: ["a", "b"] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("removes single element leaving empty array", () => {
		const pre = { data: ["a"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.removeElement(text, 0);
		const post = { data: [] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("returns original for out-of-bounds index", () => {
		const pre = { data: ["a"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.removeElement(text, 99);
		expect(result).toBe(HJSON.stringify(pre, null, 2));
	});

	it("returns original for negative index", () => {
		const pre = { data: ["a"] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const result = arr.removeElement(text, -1);
		expect(result).toBe(HJSON.stringify(pre, null, 2));
	});
});

// ---------------------------------------------------------------------------
// HjsonValueNode.patchValue
// ---------------------------------------------------------------------------

describe("HjsonValueNode.patchValue", () => {
	it("replaces string value", () => {
		const pre = { name: "hello" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const valueNode = root.get("name") as HjsonValueNode;
		const result = valueNode.patchValue(text, "world");
		const post = { name: "world" };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces numeric value", () => {
		const pre = { count: 42 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const valueNode = root.get("count") as HjsonValueNode;
		const result = valueNode.patchValue(text, 100);
		const post = { count: 100 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces boolean value", () => {
		const pre = { active: true };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const valueNode = root.get("active") as HjsonValueNode;
		const result = valueNode.patchValue(text, false);
		const post = { active: false };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces value within a nested object", () => {
		const pre = { obj: { inner: "val" } };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const obj = root.get("obj") as HjsonObjectNode;
		const inner = obj.get("inner") as HjsonValueNode;
		const result = inner.patchValue(text, "new-val");
		const post = { obj: { inner: "new-val" } };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces value within an array element", () => {
		const pre = { items: [1, 2, 3] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("items") as HjsonArrayNode;
		const el = arr.at(0)!;
		const valueNode = el.value as HjsonValueNode;
		const result = valueNode.patchValue(text, 42);
		const post = { items: [42, 2, 3] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces value with null", () => {
		const pre = { name: "hello" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const valueNode = root.get("name") as HjsonValueNode;
		const result = valueNode.patchValue(text, null);
		const post = { name: null };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces value with undefined", () => {
		const pre = { name: "hello" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const valueNode = root.get("name") as HjsonValueNode;
		const result = valueNode.patchValue(text, undefined);
		const expected = text.slice(0, valueNode.start.index) + text.slice(valueNode.end.index);
		expect(result).toBe(expected);
	});

	it("replaces value with empty string", () => {
		const pre = { name: "hello" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const valueNode = root.get("name") as HjsonValueNode;
		const result = valueNode.patchValue(text, "");
		const post = { name: "" };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces value with empty array", () => {
		const pre = { name: "hello" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const valueNode = root.get("name") as HjsonValueNode;
		const result = valueNode.patchValue(text, []);
		const post = { name: [] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaces value with empty object", () => {
		const pre = { name: "hello" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const valueNode = root.get("name") as HjsonValueNode;
		const result = valueNode.patchValue(text, {});
		const post = { name: {} };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});
});

// ---------------------------------------------------------------------------
// HjsonValueNode.patchRemove
// ---------------------------------------------------------------------------

describe("HjsonValueNode.patchRemove", () => {
	it("delegates to parent object when parent is set", () => {
		const pre = { a: 1, b: 2 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const bNode = root.get("b") as HjsonValueNode;
		const result = bNode.patchRemove(text, "b");
		const post = { a: 1 };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("removes inline when node has no parent", () => {
		const src = HJSON.stringify("hello", null, 2);
		const standalone = new HjsonValueNode(src, { row: 1, col: 1, index: 0 }, { row: 1, col: 1 + src.length, index: src.length });
		const result = standalone.patchRemove(src, "");
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
// Auto-serialization of raw values
// ---------------------------------------------------------------------------

describe("Auto-serialization", () => {
	it("patchValue with raw object auto-serializes correctly", () => {
		const pre = { a: {} };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.patchValue(text, "a", { b: 1, c: "hello" });
		const post = { a: { b: 1, c: "hello" } };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("patchValue with raw array auto-serializes correctly", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const result = root.patchValue(text, "a", [1, 2, 3]);
		const post = { a: [1, 2, 3] };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});

	it("replaceValue with raw object auto-serializes correctly", () => {
		const pre = { name: "old" };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const field = root.field("name")!;
		const result = field.replaceValue(text, { nested: true });
		const post = { name: { nested: true } };
		expect(result).toBe(HJSON.stringify(post, null, 2));
	});
});

// ---------------------------------------------------------------------------
// Sequential / round-trip patching
// ---------------------------------------------------------------------------

describe("Sequential patching", () => {
	it("patchField sequentially with re-parse preserves structure", () => {
		const pre = { cost: 1, research: { parent: "team-quantra", requirements: ["lead/200555555"] } };
		const text = HJSON.stringify(pre, null, 2);
		let content = text;
		const values = ["lead/20055555", "lead/200555"];
		for (const v of values) {
			const node = HJSON.parseStructured(content) as HjsonObjectNode;
			content = node.patchValue(content, "research", { parent: "team-quantra", requirements: [v] });
		}
		const post = { cost: 1, research: { parent: "team-quantra", requirements: ["lead/200555"] } };
		expect(content).toBe(HJSON.stringify(post, null, 2));
	});
});

describe("Round-trip patching", () => {
	it("patchValue round-trips correctly", () => {
		const pre = { a: 1, b: 2, c: 3 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const patched = root.patchValue(text, "b", 42);
		const post = { a: 1, b: 42, c: 3 };
		expect(patched).toBe(HJSON.stringify(post, null, 2));
	});

	it("insertField round-trips correctly", () => {
		const pre = { a: 1 };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const patched = root.insertField(text, "b", 2);
		const post = { a: 1, b: 2 };
		expect(patched).toBe(HJSON.stringify(post, null, 2));
	});

	it("insertElement round-trips correctly", () => {
		const pre = { data: [1, 2] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const patched = arr.insertElement(text, 2, 3);
		const post = { data: [1, 2, 3] };
		expect(patched).toBe(HJSON.stringify(post, null, 2));
	});

	it("removeElement round-trips correctly", () => {
		const pre = { data: [1, 2, 3] };
		const text = HJSON.stringify(pre, null, 2);
		const root = parseStructured(text);
		const arr = root.get("data") as HjsonArrayNode;
		const patched = arr.removeElement(text, 1);
		const post = { data: [1, 3] };
		expect(patched).toBe(HJSON.stringify(post, null, 2));
	});
});

// ---------------------------------------------------------------------------
// Structured pre/post object round-trip patching
// ---------------------------------------------------------------------------
// Tests define object1 (pre-patch) and object2 (post-patch),
// stringify both with HJSON, apply the patch to the parsed source,
// then compare the formatted result against the expected string.
// Covers: update / insert / remove on flat and deeply nested structures
// up to 4 levels, with 0–3 fields/elements, across all 4 nesting patterns:
// arr-in-arr, obj-in-obj, arr-in-obj, obj-in-arr.

describe("Structured pre/post round-trip", () => {
	const S = (obj: unknown) => HJSON.stringify(obj, null, 2);

	// -----------------------------------------------------------------------
	// Flat object (update / insert / remove fields, 0–3 fields)
	// -----------------------------------------------------------------------

	describe("flat object", () => {
		for (const n of [1, 2, 3]) {
			it(`update field (${n} field${n > 1 ? "s" : ""})`, () => {
				const pre: Record<string, number> = {};
				const post: Record<string, number> = {};
				for (let i = 0; i < n; i++) { pre[`k${i}`] = i; post[`k${i}`] = i; }
				const target = `k${n - 1}`;
				post[target] = 99;
				const text = S(pre);
				const root = HJSON.parseStructured(text) as HjsonObjectNode;
				const result = root.patchValue(text, target, 99);
				expect(result).toBe(HJSON.stringify(post, null, 2));
			});
		}

		for (const n of [0, 1, 2]) {
			it(`insert field into object with ${n} field${n !== 1 ? "s" : ""}`, () => {
				const pre: Record<string, number> = {};
				for (let i = 0; i < n; i++) pre[`k${i}`] = i;
				const post = { ...pre, newField: 42 };
				const text = S(pre);
				const root = HJSON.parseStructured(text) as HjsonObjectNode;
				const result = root.insertField(text, "newField", 42);
				expect(result).toBe(HJSON.stringify(post, null, 2));
			});
		}

		for (const n of [1, 2, 3]) {
			it(`remove field from object with ${n + 1} fields → ${n}`, () => {
				const pre: Record<string, number> = {};
				const post: Record<string, number> = {};
				for (let i = 0; i < n + 1; i++) pre[`k${i}`] = i;
				for (let i = 0; i < n + 1; i++) if (i !== 1) post[`k${i}`] = i;
				const text = S(pre);
				const root = HJSON.parseStructured(text) as HjsonObjectNode;
				const result = root.removeField(text, "k1");
				expect(result).toBe(HJSON.stringify(post, null, 2));
			});
		}
	});

	// -----------------------------------------------------------------------
	// Flat array (update / insert / remove elements, 0–3 elements)
	// -----------------------------------------------------------------------

	describe("flat array", () => {
		function a(arr: unknown[]) { return { data: arr }; }

		for (const n of [1, 2, 3]) {
			it(`update element at index ${Math.floor(n / 2)} (${n} elements)`, () => {
				const pre = a(Array.from({ length: n }, (_, i) => i));
				const post = a(Array.from({ length: n }, (_, i) => (i === Math.floor(n / 2) ? 99 : i)));
				const text = S(pre);
				const root = HJSON.parseStructured(text) as HjsonObjectNode;
				const arr = root.get("data") as HjsonArrayNode;
				const result = arr.patchValue(text, Math.floor(n / 2), 99);
				expect(result).toBe(HJSON.stringify(post, null, 2));
			});
		}

		for (const n of [0, 1, 2]) {
			it(`insert element into array with ${n} element${n !== 1 ? "s" : ""}`, () => {
				const pre = a(Array.from({ length: n }, (_, i) => i));
				const post = a([...Array.from({ length: n }, (_, i) => i), 99]);
				const text = S(pre);
				const root = HJSON.parseStructured(text) as HjsonObjectNode;
				const arr = root.get("data") as HjsonArrayNode;
				const result = arr.insertElement(text, n, 99);
				expect(result).toBe(HJSON.stringify(post, null, 2));
			});
		}

		for (const n of [1, 2, 3]) {
			it(`remove element from array with ${n + 1} elements → ${n}`, () => {
				const idx = Math.floor(n / 2);
				const pre = a(Array.from({ length: n + 1 }, (_, i) => i));
				const post = a(Array.from({ length: n + 1 }, (_, i) => i).filter((_, i) => i !== idx));
				const text = S(pre);
				const root = HJSON.parseStructured(text) as HjsonObjectNode;
				const arr = root.get("data") as HjsonArrayNode;
				const result = arr.removeElement(text, idx);
				expect(result).toBe(HJSON.stringify(post, null, 2));
			});
		}
	});

	// -----------------------------------------------------------------------
	// Object → Object (depth 2)
	// -----------------------------------------------------------------------

	describe("obj in obj (depth 2)", () => {
		it("updates nested field", () => {
			const pre = { outer: { a: 1, b: 2 } };
			const post = { outer: { a: 1, b: 99 } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const inner = root.get("outer") as HjsonObjectNode;
			const result = inner.patchValue(text, "b", 99);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts into nested object (1→2 fields)", () => {
			const pre = { outer: { a: 1 } };
			const post = { outer: { a: 1, b: 2 } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const inner = root.get("outer") as HjsonObjectNode;
			const result = inner.insertField(text, "b", 2);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts into empty nested object", () => {
			const pre = { outer: {} };
			const post = { outer: { x: 1 } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const inner = root.get("outer") as HjsonObjectNode;
			const result = inner.insertField(text, "x", 1);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes from nested object (2→1 fields)", () => {
			const pre = { outer: { a: 1, b: 2 } };
			const post = { outer: { a: 1 } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const inner = root.get("outer") as HjsonObjectNode;
			const result = inner.removeField(text, "b");
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});
	});

	// -----------------------------------------------------------------------
	// Array → Array (depth 2, arr-in-arr)
	// -----------------------------------------------------------------------

	describe("arr in arr (depth 2)", () => {
		it("updates nested array element", () => {
			const pre = { data: [[1, 2], [3, 4]] };
			const post = { data: [[1, 2], [3, 99]] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const outer = root.get("data") as HjsonArrayNode;
			const inner = outer.at(1)!.value as HjsonArrayNode;
			const result = inner.patchValue(text, 1, 99);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts into nested array", () => {
			const pre = { data: [[1, 2], [3]] };
			const post = { data: [[1, 2], [3, 4]] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const outer = root.get("data") as HjsonArrayNode;
			const inner = outer.at(1)!.value as HjsonArrayNode;
			const result = inner.insertElement(text, 1, 4);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes from nested array", () => {
			const pre = { data: [[1, 2], [3, 4]] };
			const post = { data: [[1, 2], [3]] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const outer = root.get("data") as HjsonArrayNode;
			const inner = outer.at(1)!.value as HjsonArrayNode;
			const result = inner.removeElement(text, 1);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});
	});

	// -----------------------------------------------------------------------
	// Array → Object (depth 2, arr-in-obj)
	// Modify array elements within an object
	// -----------------------------------------------------------------------

	describe("arr in obj (depth 2)", () => {
		it("updates array element inside object", () => {
			const pre = { items: [1, 2, 3] };
			const post = { items: [1, 99, 3] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("items") as HjsonArrayNode;
			const result = arr.patchValue(text, 1, 99);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts array element inside object", () => {
			const pre = { items: [1, 3] };
			const post = { items: [1, 2, 3] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("items") as HjsonArrayNode;
			const result = arr.insertElement(text, 1, 2);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes array element inside object", () => {
			const pre = { items: [1, 2, 3] };
			const post = { items: [1, 3] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("items") as HjsonArrayNode;
			const result = arr.removeElement(text, 1);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes all array elements → empty array", () => {
			const pre = { items: [1] };
			const post = { items: [] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("items") as HjsonArrayNode;
			const result = arr.removeElement(text, 0);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});
	});

	// -----------------------------------------------------------------------
	// Object → Array (depth 2, obj-in-arr)
	// Modify object fields within array elements
	// -----------------------------------------------------------------------

	describe("obj in arr (depth 2)", () => {
		it("updates field inside object array element", () => {
			const pre = { data: [{ a: 1 }, { b: 2 }] };
			const post = { data: [{ a: 1 }, { b: 99 }] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("data") as HjsonArrayNode;
			const el = arr.at(1)!;
			const obj = el.value as HjsonObjectNode;
			const result = obj.patchValue(text, "b", 99);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts field inside object array element", () => {
			const pre = { data: [{ a: 1 }, { b: 2 }] };
			const post = { data: [{ a: 1 }, { b: 2, c: 3 }] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("data") as HjsonArrayNode;
			const el = arr.at(1)!;
			const obj = el.value as HjsonObjectNode;
			const result = obj.insertField(text, "c", 3);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes field inside object array element", () => {
			const pre = { data: [{ a: 1, b: 2 }, { x: 10, y: 20 }] };
			const post = { data: [{ a: 1, b: 2 }, { x: 10 }] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("data") as HjsonArrayNode;
			const el = arr.at(1)!;
			const obj = el.value as HjsonObjectNode;
			const result = obj.removeField(text, "y");
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts new object into array", () => {
			const pre = { data: [{ a: 1 }] };
			const post = { data: [{ a: 1 }, { b: 2 }] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("data") as HjsonArrayNode;
			const result = arr.insertElement(text, 1, { b: 2 });
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});
	});

	// -----------------------------------------------------------------------
	// Object → Object → Object (depth 3)
	// -----------------------------------------------------------------------

	describe("obj→obj→obj (depth 3)", () => {
		it("updates deeply nested field", () => {
			const pre = { a: { b: { x: 1 } } };
			const post = { a: { b: { x: 99 } } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("a") as HjsonObjectNode;
			const l2 = l1.get("b") as HjsonObjectNode;
			const result = l2.patchValue(text, "x", 99);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts field into deeply nested object (1→2 fields)", () => {
			const pre = { a: { b: { x: 1 } } };
			const post = { a: { b: { x: 1, y: 2 } } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("a") as HjsonObjectNode;
			const l2 = l1.get("b") as HjsonObjectNode;
			const result = l2.insertField(text, "y", 2);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts into empty nested object (depth 3)", () => {
			const pre = { a: { b: {} } };
			const post = { a: { b: { x: 1 } } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("a") as HjsonObjectNode;
			const l2 = l1.get("b") as HjsonObjectNode;
			const result = l2.insertField(text, "x", 1);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes field from deeply nested object", () => {
			const pre = { a: { b: { x: 1, y: 2, z: 3 } } };
			const post = { a: { b: { x: 1, z: 3 } } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("a") as HjsonObjectNode;
			const l2 = l1.get("b") as HjsonObjectNode;
			const result = l2.removeField(text, "y");
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});
	});

	// -----------------------------------------------------------------------
	// Array → Array → Array (depth 3)
	// -----------------------------------------------------------------------

	describe("arr→arr→arr (depth 3)", () => {
		it("updates deeply nested array element", () => {
			const pre = { data: [[[1, 2], [3, 4]], [[5, 6]]] };
			const post = { data: [[[1, 2], [3, 99]], [[5, 6]]] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("data") as HjsonArrayNode;
			const l2 = l1.at(0)!.value as HjsonArrayNode;
			const l3 = l2.at(1)!.value as HjsonArrayNode;
			const result = l3.patchValue(text, 1, 99);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts into deeply nested array", () => {
			const pre = { data: [[[1], [2, 3]]] };
			const post = { data: [[[1], [2, 3, 4]]] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("data") as HjsonArrayNode;
			const l2 = l1.at(0)!.value as HjsonArrayNode;
			const l3 = l2.at(1)!.value as HjsonArrayNode;
			const result = l3.insertElement(text, 2, 4);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes from deeply nested array", () => {
			const pre = { data: [[[1, 2, 3], [4, 5]]] };
			const post = { data: [[[1, 2, 3], [4]]] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("data") as HjsonArrayNode;
			const l2 = l1.at(0)!.value as HjsonArrayNode;
			const l3 = l2.at(1)!.value as HjsonArrayNode;
			const result = l3.removeElement(text, 1);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});
	});

	// -----------------------------------------------------------------------
	// Object → Array → Object (depth 3, mixed)
	// -----------------------------------------------------------------------

	describe("obj→arr→obj (depth 3 mixed)", () => {
		it("updates field in object inside array inside object", () => {
			const pre = { data: [{ inner: { x: 1 } }, { inner: { x: 2 } }] };
			const post = { data: [{ inner: { x: 1 } }, { inner: { x: 99 } }] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("data") as HjsonArrayNode;
			const el = arr.at(1)!;
			const obj = el.value as HjsonObjectNode;
			const inner = obj.get("inner") as HjsonObjectNode;
			const result = inner.patchValue(text, "x", 99);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts field in object inside array inside object", () => {
			const pre = { data: [{ inner: { x: 1 } }, { inner: { x: 2 } }] };
			const post = { data: [{ inner: { x: 1 } }, { inner: { x: 2, y: 3 } }] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("data") as HjsonArrayNode;
			const el = arr.at(1)!;
			const obj = el.value as HjsonObjectNode;
			const inner = obj.get("inner") as HjsonObjectNode;
			const result = inner.insertField(text, "y", 3);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes field from object inside array inside object", () => {
			const pre = { data: [{ inner: { x: 1 } }, { inner: { x: 2, y: 3 } }] };
			const post = { data: [{ inner: { x: 1 } }, { inner: { x: 2 } }] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const arr = root.get("data") as HjsonArrayNode;
			const el = arr.at(1)!;
			const obj = el.value as HjsonObjectNode;
			const inner = obj.get("inner") as HjsonObjectNode;
			const result = inner.removeField(text, "y");
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});
	});

	// -----------------------------------------------------------------------
	// Object → Object → Object → Object (depth 4)
	// -----------------------------------------------------------------------

	describe("obj→obj→obj→obj (depth 4)", () => {
		it("updates field 4 levels deep", () => {
			const pre = { a: { b: { c: { x: 1 } } } };
			const post = { a: { b: { c: { x: 99 } } } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("a") as HjsonObjectNode;
			const l2 = l1.get("b") as HjsonObjectNode;
			const l3 = l2.get("c") as HjsonObjectNode;
			const result = l3.patchValue(text, "x", 99);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts field 4 levels deep", () => {
			const pre = { a: { b: { c: { x: 1 } } } };
			const post = { a: { b: { c: { x: 1, y: 2 } } } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("a") as HjsonObjectNode;
			const l2 = l1.get("b") as HjsonObjectNode;
			const l3 = l2.get("c") as HjsonObjectNode;
			const result = l3.insertField(text, "y", 2);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts into empty object 4 levels deep", () => {
			const pre = { a: { b: { c: {} } } };
			const post = { a: { b: { c: { x: 1 } } } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("a") as HjsonObjectNode;
			const l2 = l1.get("b") as HjsonObjectNode;
			const l3 = l2.get("c") as HjsonObjectNode;
			const result = l3.insertField(text, "x", 1);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes field 4 levels deep", () => {
			const pre = { a: { b: { c: { x: 1, y: 2, z: 3 } } } };
			const post = { a: { b: { c: { x: 1, z: 3 } } } };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("a") as HjsonObjectNode;
			const l2 = l1.get("b") as HjsonObjectNode;
			const l3 = l2.get("c") as HjsonObjectNode;
			const result = l3.removeField(text, "y");
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});
	});

	// -----------------------------------------------------------------------
	// Array → Array → Object (depth 3, mixed)
	// -----------------------------------------------------------------------

	describe("arr→arr→obj (depth 3 mixed)", () => {
		it("updates field in object inside array inside array", () => {
			const pre = { data: [[{ x: 1 }, { x: 2 }], [{ x: 3 }]] };
			const post = { data: [[{ x: 1 }, { x: 2 }], [{ x: 99 }]] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("data") as HjsonArrayNode;
			const l2 = l1.at(1)!.value as HjsonArrayNode;
			const el = l2.at(0)!;
			const obj = el.value as HjsonObjectNode;
			const result = obj.patchValue(text, "x", 99);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("inserts field in object inside array inside array", () => {
			const pre = { data: [[{ x: 1 }], [{ y: 2 }]] };
			const post = { data: [[{ x: 1 }], [{ y: 2, z: 3 }]] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("data") as HjsonArrayNode;
			const l2 = l1.at(1)!.value as HjsonArrayNode;
			const el = l2.at(0)!;
			const obj = el.value as HjsonObjectNode;
			const result = obj.insertField(text, "z", 3);
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});

		it("removes field from object inside array inside array", () => {
			const pre = { data: [[{ x: 1 }], [{ y: 2, z: 3 }]] };
			const post = { data: [[{ x: 1 }], [{ y: 2 }]] };
			const text = S(pre);
			const root = HJSON.parseStructured(text) as HjsonObjectNode;
			const l1 = root.get("data") as HjsonArrayNode;
			const l2 = l1.at(1)!.value as HjsonArrayNode;
			const el = l2.at(0)!;
			const obj = el.value as HjsonObjectNode;
			const result = obj.removeField(text, "z");
			expect(result).toBe(HJSON.stringify(post, null, 2));
		});
	});
});
