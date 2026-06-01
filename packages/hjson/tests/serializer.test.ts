import { describe, it, expect } from "vitest";
import { HJSON } from "@project/hjson";

function stringifyAndParse(value: unknown, space?: string | number) {
  const str = HJSON.stringify(value, null, space);
  const parsed = HJSON.parse(str);
  return { str, parsed };
}

describe("Serializer", () => {
  describe("basic values", () => {
    it("stringifies null", () => {
      expect(HJSON.stringify(null)).toBe("null");
    });

    it("stringifies boolean true", () => {
      expect(HJSON.stringify(true)).toBe("true");
    });

    it("stringifies boolean false", () => {
      expect(HJSON.stringify(false)).toBe("false");
    });

    it("stringifies numbers", () => {
      expect(HJSON.stringify(42)).toBe("42");
      expect(HJSON.stringify(3.14)).toBe("3.14");
    });
  });

  describe("strings", () => {
    it("stringifies simple strings with unquoted keys", () => {
      const result = HJSON.stringify({ key: "value" });
      expect(result).toContain("key:");
      expect(result).toContain("value");
    });

    it("quotes keys with special characters", () => {
      const result = HJSON.stringify({ "key with spaces": "val" });
      expect(result).toContain('"key with spaces"');
    });

    it("handles multi-line strings with ''' syntax", () => {
      const result = HJSON.stringify({ text: "hello\nworld" }, null, 2);
      expect(result).toContain("'''");
    });
  });

  describe("indentation", () => {
    it("stringifies with 2-space indent", () => {
      const result = HJSON.stringify({ a: { b: 1 } }, null, 2);
      const lines = result.split("\n");
      expect(lines.length).toBeGreaterThan(1);
      expect(lines[1]).toMatch(/^  /);
    });

    it("stringifies with tab indent", () => {
      const result = HJSON.stringify({ a: 1 }, null, "\t");
      expect(result).toContain("\t");
    });
  });

  describe("replacer", () => {
    it("replacer function filters values", () => {
      const result = HJSON.stringify(
        { a: 1, b: 2, c: 3 },
        (k, v) => (k === "b" ? undefined : v),
      );
      expect(result).not.toContain("b");
    });

    it("replacer array filters keys", () => {
      const result = HJSON.stringify({ a: 1, b: 2, c: 3 }, ["a", "c"]);
      expect(result).toContain("a");
      expect(result).not.toContain("b");
      expect(result).toContain("c");
    });
  });

  describe("toJSON", () => {
    it("respects toJSON method", () => {
      const obj = {
        toJSON: () => ({ serialized: true }),
      };
      const result = HJSON.stringify(obj);
      expect(result).toContain("serialized");
      expect(result).toContain("true");
    });
  });

  describe("round-trip", () => {
    it("round-trips a simple object", () => {
      const original = { name: "test", value: 42, active: true };
      const { parsed } = stringifyAndParse(original);
      expect(parsed).toEqual(original);
    });

    it("round-trips nested objects", () => {
      const original = { outer: { inner: "deep", num: 123 } };
      const { parsed } = stringifyAndParse(original);
      expect(parsed).toEqual(original);
    });

    it("round-trips arrays", () => {
      const original = [1, "two", true, null, { nested: "obj" }];
      const result = HJSON.stringify(original, null, 2);
      const parsed = HJSON.parse(result);
      expect(parsed).toEqual(original);
    });
  });
});
