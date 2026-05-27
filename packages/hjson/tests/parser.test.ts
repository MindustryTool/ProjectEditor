import { describe, it, expect } from "vitest";
import { Parser } from "../src/parser.js";
import { HJSONError, HJSONErrorCode } from "../src/errors.js";
import {
  StructuredNode,
  StructuredObjectNode,
  StructuredArrayNode,
  StructuredValueNode,
  type FieldInfo,
  StructuredObject,
} from "../src/structured.js";

function parse(input: string, reviver?: (key: string, value: any) => any) {
  return Parser.parse(input, reviver);
}

function parseStructured(input: string, reviver?: (key: string, value: any) => any) {
  return Parser.parse(input, reviver, { structured: true });
}

function parseAsync(input: string, reviver?: (key: string, value: any) => any) {
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
        k === "d" ? new Date(v) : v,
      );
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

    it("throws on invalid number", () => {
      expect(() => parse("{n: 12.34.56}")).toThrow(HJSONError);
    });
  });

  describe("structured parsing", () => {
    it("default parse still returns plain JS value", () => {
      const result = parse('{"a": 1}');
      expect(result).toEqual({ a: 1 });
      expect(result).not.toBeInstanceOf(StructuredObject);
    });

    it("structured parse returns StructuredObject instance", () => {
      const result = parseStructured('{"a": 1}');
      expect(result).toBeInstanceOf(StructuredObject);
    });

    it("structured parse has correct field positions", () => {
      const text = '{"a": 42}';
      const result = parseStructured(text) as StructuredObjectNode;
      const info = result.field("a")!;
      expect(info.key).toBe("a");
      expect(info.value.valueOf()).toBe(42);
      expect(info.start).toEqual({ row: 1, col: 2, index: 1 });
      expect(info.valueStart).toEqual({ row: 1, col: 7, index: 6 });
    });

    it("field() returns correct FieldInfo", () => {
      const result = parseStructured('{"x": "hello"}') as StructuredObjectNode;
      const info = result.field("x")!;
      expect(info.key).toBe("x");
      expect(info.value.valueOf()).toBe("hello");
    });

    it("field() returns undefined for missing key", () => {
      const result = parseStructured('{"a": 1}') as StructuredObjectNode;
      expect(result.field("bogus")).toBeUndefined();
    });

    it("fields() iterates all entries", () => {
      const result = parseStructured('{"a": 1, "b": 2}') as StructuredObjectNode;
      const entries = Array.from(result.fields());
      expect(entries).toHaveLength(2);
      expect(entries.map((f) => f.key)).toEqual(["a", "b"]);
    });

    it("nested objects are recursively StructuredNode", () => {
      const result = parseStructured('{"outer": {"inner": 1}}') as StructuredObjectNode;
      const outerField = result.field("outer")!;
      expect(outerField.value).toBeInstanceOf(StructuredNode);
      const inner = outerField.value as StructuredObjectNode;
      const innerField = inner.field("inner")!;
      expect(innerField.key).toBe("inner");
      expect(innerField.value.valueOf()).toBe(1);
    });

    it("primitives in object fields store correct values", () => {
      const result = parseStructured('{"n": 42, "b": true, "v": null, "s": "hi"}') as StructuredObjectNode;
      expect(result.field("n")!.value.valueOf()).toBe(42);
      expect(result.field("b")!.value.valueOf()).toBe(true);
      expect(result.field("v")!.value.valueOf()).toBeNull();
      expect(result.field("s")!.value.valueOf()).toBe("hi");
    });

    it("arrays return StructuredArrayNode in structured mode", () => {
      const result = parseStructured("[1, 2, 3]");
      expect(result.isArray()).toBe(true);
      expect(result.valueOf()).toEqual([1, 2, 3]);
    });

    it("valueOf() returns plain JS object", () => {
      const result = parseStructured('{"a": 1}') as StructuredObjectNode;
      expect(result.valueOf()).toEqual({ a: 1 });
    });

    it("toJSON() returns plain JS object", () => {
      const result = parseStructured('{"a": 1}') as StructuredObjectNode;
      expect(JSON.stringify(result)).toBe('{"a":1}');
    });

    it("structured parse with reviver works correctly", () => {
      const result = parseStructured('{"a": 1}', (key, val) =>
        typeof val === "number" ? val * 2 : val,
      ) as StructuredObjectNode;
      expect(result.valueOf()).toEqual({ a: 2 });
      const info = result.field("a")!;
      expect(info.value.valueOf()).toBe(2);
    });

    it("structured parse with legacy root works", () => {
      const result = parseStructured("a: 1\nb: 2") as StructuredObjectNode;
      expect(result).toBeInstanceOf(StructuredObject);
      expect(result.valueOf()).toEqual({ a: 1, b: 2 });
      expect(result.field("a")).toBeDefined();
      expect(result.field("b")).toBeDefined();
    });
  });
});
