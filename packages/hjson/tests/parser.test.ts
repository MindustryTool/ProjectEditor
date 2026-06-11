import { describe, it, expect } from "vitest";
import { Parser, HJSONError, HJSONErrorCode, HjsonNode, HjsonObjectNode, type FieldInfo, type ElementInfo, type InfoBase } from "@project/hjson";
import type { HjsonArrayNode, HjsonValueNode } from "@project/hjson";

function parse(input: string, reviver?: (key: string, value: unknown) => unknown) {
  return Parser.parse(input, reviver);
}

function parseStructured(input: string, reviver?: (key: string, value: unknown) => unknown): HjsonNode {
  return Parser.parse(input, reviver, { structured: true }) as HjsonNode;
}

function parseAsync(input: string, reviver?: (key: string, value: unknown) => unknown) {
  return Parser.parseAsync(input, reviver);
}

describe("Parser", () => {
  describe("standard JSON", () => {
    it('parses {"key": "value", "num": 42}', () => {
      const result = parse('{"key": "value", "num": 42}');
      expect(result).toEqual({ key: "value", num: 42 });
    });

    it("parses standard JSON object", () => {
      const result = parse('{"key": "value", "num": 42}');
      expect(result).toEqual({ key: "value", num: 42 });
    });
  });

  describe("unquoted keys", () => {
    it('parses {key: "value", flag: true}', () => {
      const result = parse('{key: "value", flag: true}');
      expect(result).toEqual({ key: "value", flag: true });
    });
  });

  describe("trailing comma", () => {
    it("parses {a: 1, b: 2,}", () => {
      const result = parse("{a: 1, b: 2,}");
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe("comments", () => {
    it("skips single-line // comments", () => {
      const result = parse("{ // comment\n key: 'val' }");
      expect(result).toEqual({ key: "val" });
    });

    it("skips multi-line /* */ comments", () => {
      const result = parse("{ /* comment */ key: 'val' }");
      expect(result).toEqual({ key: "val" });
    });
  });

  describe("unquoted string values", () => {
    it('parses {key: hello world}', () => {
      const result = parse("{key: hello world}");
      expect(result).toEqual({ key: "hello world" });
    });
  });

  describe("multi-line strings", () => {
    it("parses multi-line string with '''", () => {
      const result = parse("{\n  text: '''\n    hello\n    world\n    '''\n}");
      expect(result).toEqual({ text: "hello\nworld" });
    });
  });

  describe("numeric values", () => {
    it("parses all HJSON numeric forms", () => {
      const result = parse("{int: 42, neg: -10, float: 3.14, exp: 5e2, hex: 0xFF}");
      expect(result).toEqual({ int: 42, neg: -10, float: 3.14, exp: 500, hex: 255 });
    });
  });

  describe("root braced object", () => {
    it("parses file-level key-value pairs without outer braces", () => {
      const result = parse("key: val\nnum: 42");
      expect(result).toEqual({ key: "val", num: 42 });
    });

    it('parses root-level with digit-prefixed unquoted string value: type: Duct\\nname: 4.4.1-duct', () => {
      const result = parse("type: Duct\nname: 4.4.1-duct");
      expect(result).toEqual({ type: "Duct", name: "4.4.1-duct" });
    });
  });

  describe("nested objects", () => {
    it("parses nested objects", () => {
      const result = parse("{outer: {inner: 'deep'}}");
      expect(result).toEqual({ outer: { inner: "deep" } });
    });
  });

  describe("arrays", () => {
    it("parses arrays with mixed types", () => {
      const result = parse('[1, "two", true, null]');
      expect(result).toEqual([1, "two", true, null]);
    });
  });

  describe("reviver", () => {
    it("reviver transforms parsed values", () => {
      const result = parse('{"d": "2024-01-01"}', (k, v) =>
        k === "d" ? new Date(v as string) : v,
      ) as Record<string, any>;
      expect(result.d).toBeInstanceOf(Date);
      expect(result.d.toISOString()).toBe("2024-01-01T00:00:00.000Z");
    });

    it("reviver called on all keys", () => {
      const keys: string[] = [];
      parse('{"a": {"b": 1}}', (k, v) => {
        keys.push(k);
        return v;
      });
      expect(keys).toContain("");
      expect(keys).toContain("a");
      expect(keys).toContain("b");
    });
  });

  describe("async parse", () => {
    it("parseAsync returns correct value", async () => {
      const result = await parseAsync('{"key": "val"}');
      expect(result).toEqual({ key: "val" });
    });

    it("parseAsync rejects on invalid input", async () => {
      await expect(parseAsync("{invalid")).rejects.toThrow(HJSONError);
    });
  });

  describe("error handling", () => {
    it("throws HJSONError on invalid input", () => {
      expect(() => parse("{key: @invalid}")).toThrow(HJSONError);
    });

    it("throws on duplicate keys", () => {
      expect(() => parse('{a: 1, a: 2}')).toThrow(HJSONError);
      expect(() => parse('{a: 1, a: 2}')).toThrow(
        expect.objectContaining({ code: HJSONErrorCode.DuplicateKey }),
      );
    });

    it("throws on unterminated string", () => {
      expect(() => parse('{key: "unclosed}')).toThrow(HJSONError);
    });

    it("parses multi-dot value as unquoted string instead of throwing", () => {
      const result = parse("{n: 12.34.56}");
      expect(result).toEqual({ n: "12.34.56" });
    });
  });

  describe("structured parsing", () => {
    it("default parse still returns plain JS value", () => {
      const result = parse('{"a": 1}');
      expect(result).toEqual({ a: 1 });
      expect(result).not.toBeInstanceOf(HjsonObjectNode);
    });

    it("structured parse returns HjsonObjectNode instance", () => {
      const result = parseStructured('{"a": 1}');
      expect(result).toBeInstanceOf(HjsonObjectNode);
    });

    it("structured parse has correct field positions", () => {
      const text = '{"a": 42}';
      const result = parseStructured(text) as HjsonObjectNode;
      const info = result.field("a")!;
      expect(info.key).toBe("a");
      expect((info.value as HjsonValueNode).valueOf()).toBe(42);
      expect(info.start).toEqual({ row: 1, col: 2, index: 1 });
      expect(info.valueStart).toEqual({ row: 1, col: 7, index: 6 });
    });

    it("field() returns correct FieldInfo", () => {
      const result = parseStructured('{"x": "hello"}') as HjsonObjectNode;
      const info = result.field("x")!;
      expect(info.key).toBe("x");
      expect((info.value as HjsonValueNode).valueOf()).toBe("hello");
    });

    it("field() returns undefined for missing key", () => {
      const result = parseStructured('{"a": 1}') as HjsonObjectNode;
      expect(result.field("bogus")).toBeUndefined();
    });

    it("fields() iterates all entries", () => {
      const result = parseStructured('{"a": 1, "b": 2}') as HjsonObjectNode;
      const entries = Array.from(result.fields());
      expect(entries).toHaveLength(2);
      expect(entries.map((f) => f.key)).toEqual(["a", "b"]);
    });

    it("nested objects are recursively HjsonNode", () => {
      const result = parseStructured('{"outer": {"inner": 1}}') as HjsonObjectNode;
      const outerField = result.field("outer")!;
      expect(outerField.value).toBeInstanceOf(HjsonNode);
      const inner = outerField.value as HjsonObjectNode;
      const innerField = inner.field("inner")!;
      expect(innerField.key).toBe("inner");
      expect((innerField.value as HjsonValueNode).valueOf()).toBe(1);
    });

    it("primitives in object fields store correct values", () => {
      const result = parseStructured('{"n": 42, "b": true, "v": null, "s": "hi"}') as HjsonObjectNode;
      expect((result.field("n")!.value as HjsonValueNode).valueOf()).toBe(42);
      expect((result.field("b")!.value as HjsonValueNode).valueOf()).toBe(true);
      expect((result.field("v")!.value as HjsonValueNode).valueOf()).toBeNull();
      expect((result.field("s")!.value as HjsonValueNode).valueOf()).toBe("hi");
    });

    it("arrays return HjsonArrayNode in structured mode", () => {
      const result = parseStructured("[1, 2, 3]") as HjsonArrayNode;
      expect((result as HjsonArrayNode).isArray()).toBe(true);
      expect((result as HjsonArrayNode).valueOf()).toEqual([1, 2, 3]);
    });

    it("valueOf() returns plain JS object", () => {
      const result = parseStructured('{"a": 1}') as HjsonObjectNode;
      expect(result.valueOf()).toEqual({ a: 1 });
    });

    it("toJSON() returns plain JS object", () => {
      const result = parseStructured('{"a": 1}') as HjsonObjectNode;
      expect(JSON.stringify(result)).toBe('{"a":1}');
    });

    it("structured parse with reviver works correctly", () => {
      const result = parseStructured('{"a": 1}', (_key, val) =>
        typeof val === "number" ? val * 2 : val,
      ) as HjsonObjectNode;
      expect(result.valueOf()).toEqual({ a: 2 });
      const info = result.field("a")!;
      expect((info.value as HjsonValueNode).valueOf()).toBe(2);
    });

    it("structured parse with legacy root works", () => {
      const result = parseStructured("a: 1\nb: 2") as HjsonObjectNode;
      expect(result).toBeInstanceOf(HjsonObjectNode);
      expect(result.valueOf()).toEqual({ a: 1, b: 2 });
      expect(result.field("a")).toBeDefined();
      expect(result.field("b")).toBeDefined();
    });

    it("at(string) on object returns FieldInfo with key and value", () => {
      const result = parseStructured('{"a": 42, "b": "hi"}') as HjsonObjectNode;
      const infoA = result.at("a")!;
      expect(infoA.key).toBe("a");
      expect((infoA.value as HjsonValueNode).valueOf()).toBe(42);
      expect(infoA.start).toBeDefined();
      expect(infoA.end).toBeDefined();
      expect(infoA.valueStart).toBeDefined();
      expect(infoA.valueEnd).toBeDefined();
      expect(typeof infoA.replaceValue).toBe("function");

      const infoB = result.at("b")!;
      expect(infoB.key).toBe("b");
      expect((infoB.value as HjsonValueNode).valueOf()).toBe("hi");
    });

    it("at(string) on object returns undefined for non-existent field", () => {
      const result = parseStructured('{"a": 1}') as HjsonObjectNode;
      expect(result.at("bogus")).toBeUndefined();
    });

    it("at(number) on object returns undefined", () => {
      const result = parseStructured('{"a": 1}') as HjsonObjectNode;
      expect(result.at(0)).toBeUndefined();
    });

    it("at(number) on array returns ElementInfo with index and value", () => {
      const result = parseStructured("[10, 20, 30]") as HjsonArrayNode;
      const el0 = result.at(0)!;
      expect(el0.index).toBe(0);
      expect((el0.value as HjsonValueNode).valueOf()).toBe(10);
      expect(el0.start).toBeDefined();
      expect(el0.end).toBeDefined();

      const el1 = result.at(1)!;
      expect(el1.index).toBe(1);
      expect((el1.value as HjsonValueNode).valueOf()).toBe(20);

      const el2 = result.at(2)!;
      expect(el2.index).toBe(2);
      expect((el2.value as HjsonValueNode).valueOf()).toBe(30);
    });

    it("at(number) on array returns undefined for out-of-bounds index", () => {
      const result = parseStructured("[1, 2, 3]") as HjsonArrayNode;
      expect(result.at(5)).toBeUndefined();
      expect(result.at(-1)).toBeUndefined();
    });

    it("at(string) on array returns undefined", () => {
      const result = parseStructured("[1, 2, 3]") as HjsonArrayNode;
      expect(result.at("a")).toBeUndefined();
    });

    it("at() on value node returns undefined", () => {
      const result = parseStructured('{"x": 42}') as HjsonObjectNode;
      const fieldInfo = result.at("x")!;
      const valNode = fieldInfo.value as HjsonValueNode;
      expect(valNode.at("anything")).toBeUndefined();
      expect(valNode.at(0)).toBeUndefined();
    });

    it("FieldInfo satisfies InfoBase contract", () => {
      const result = parseStructured('{"x": 1}') as HjsonObjectNode;
      const info: InfoBase = result.at("x")!;
      expect(info.start).toBeDefined();
      expect(info.end).toBeDefined();
      expect(typeof info.start.row).toBe("number");
      expect(typeof info.start.col).toBe("number");
    });

    it("ElementInfo satisfies InfoBase contract", () => {
      const result = parseStructured("[10, 20]") as HjsonArrayNode;
      for (const el of result.elements()) {
        const info: InfoBase = el;
        expect(info.start).toBeDefined();
        expect(info.end).toBeDefined();
      }
    });

    it("at(string) on object returns FieldInfo with patchable replaceValue", () => {
      const text = '{"x": "hello"}';
      const result = parseStructured(text) as HjsonObjectNode;
      const info = result.at("x")!;
      const patched = info.replaceValue(text, "world");
      expect(patched).toBe('{"x": world}');
    });

    it("at(number) on array can access nested FieldInfo via ElementInfo.value", () => {
      const result = parseStructured('[{"nested": 99}]') as HjsonArrayNode;
      const el = result.at(0)!;
      expect(el.index).toBe(0);
      const objNode = el.value as HjsonObjectNode;
      expect(((objNode.at("nested")!.value) as HjsonValueNode).valueOf()).toBe(99);
    });

    it("get(number) on array returns value node", () => {
      const result = parseStructured("[10, 20, 30]") as HjsonArrayNode;
      const node = result.get(0) as HjsonValueNode;
      expect(node.isValue()).toBe(true);
      expect(node.valueOf()).toBe(10);
    });

    it("get(number) on array returns HjsonMissingNode for out-of-bounds", () => {
      const result = parseStructured("[1, 2, 3]") as HjsonArrayNode;
      expect(result.get(5).isMissing()).toBe(true);
      expect(result.get(-1).isMissing()).toBe(true);
    });

    it("get(number) on object returns HjsonMissingNode", () => {
      const result = parseStructured('{"a": 1}') as HjsonObjectNode;
      expect(result.get(0).isMissing()).toBe(true);
    });

    it("get(number) on value node returns HjsonMissingNode", () => {
      const result = parseStructured('{"x": 42}') as HjsonObjectNode;
      const valNode = result.get("x") as HjsonValueNode;
      expect(valNode.get(0).isMissing()).toBe(true);
    });

    it("get(number) on missing node returns HjsonMissingNode", () => {
      const result = parseStructured('{"x": 42}') as HjsonObjectNode;
      const missing = result.get("nonexistent");
      expect(missing.isMissing()).toBe(true);
      expect(missing.get(0).isMissing()).toBe(true);
    });

    it("info() on value node returns correct positions", () => {
      const text = '{"a": 42}';
      const result = parseStructured(text) as HjsonObjectNode;
      const valNode = result.get("a") as HjsonValueNode;
      const info = valNode.info();
      expect(info).toBeDefined();
      expect(info.start.row).toBe(1);
      expect(info.start.col).toBe(7);
      expect(info.start.index).toBe(6);
      expect(info.end.col).toBe(9);
      expect(info.end.index).toBe(8);
    });

    it("info() on object node returns correct block positions", () => {
      const text = '{"a": 1, "b": 2}';
      const result = parseStructured(text) as HjsonObjectNode;
      const info = result.info();
      expect(info).toBeDefined();
      expect(info!.start.col).toBe(1);
      expect(info!.start.index).toBe(0);
    });

    it("info() on array node returns correct block positions", () => {
      const text = "[10, 20, 30]";
      const result = parseStructured(text) as HjsonArrayNode;
      const info = result.info();
      expect(info).toBeDefined();
      expect(info!.start.col).toBe(1);
      expect(info!.start.index).toBe(0);
    });

    it("info() on missing node returns undefined", () => {
      const result = parseStructured('{"a": 1}') as HjsonObjectNode;
      const missing = result.get("nonexistent");
      expect(missing.info()).toBeUndefined();
    });

    describe("path()", () => {
      it("single key returns FieldInfo for the field", () => {
        const result = parseStructured('{"a": 42}') as HjsonObjectNode;
        const info = result.path("a");
        expect(info).toBeDefined();
        expect(((info! as FieldInfo).value as HjsonValueNode).valueOf()).toBe(42);
        expect((info! as FieldInfo).key).toBe("a");
      });

      it("deep object path returns FieldInfo for the deepest field", () => {
        const result = parseStructured('{"a": {"b": {"c": "deep"}}}') as HjsonObjectNode;
        const info = result.path("a.b.c");
        expect(info).toBeDefined();
        expect(((info! as FieldInfo).value as HjsonValueNode).valueOf()).toBe("deep");
        expect((info! as FieldInfo).key).toBe("c");
      });

      it("array index bracket notation returns ElementInfo", () => {
        const result = parseStructured('{"items": [10, 20, 30]}') as HjsonObjectNode;
        const info = result.path("items[1]");
        expect(info).toBeDefined();
        expect(((info! as ElementInfo).value as HjsonValueNode).valueOf()).toBe(20);
        expect((info! as ElementInfo).index).toBe(1);
      });

      it("mixed dot and bracket paths", () => {
        const result = parseStructured('{"a": {"d": [0, 0, {"c": "x"}]}}') as HjsonObjectNode;
        const info = result.path("a.d[2].c");
        expect(info).toBeDefined();
        expect(((info! as FieldInfo).value as HjsonValueNode).valueOf()).toBe("x");
        expect((info! as FieldInfo).key).toBe("c");
      });

      it("missing segment returns undefined", () => {
        const result = parseStructured('{"a": {"b": 1}}') as HjsonObjectNode;
        expect(result.path("a.nonexistent.b")).toBeUndefined();
      });

      it("path on value node returns undefined", () => {
        const result = parseStructured('{"x": 42}') as HjsonObjectNode;
        const valNode = result.get("x");
        expect(valNode.path("anything")).toBeUndefined();
      });

      it("empty path returns undefined", () => {
        const result = parseStructured('{"a": 1}') as HjsonObjectNode;
        expect(result.path("")).toBeUndefined();
      });
    });
  });
});
