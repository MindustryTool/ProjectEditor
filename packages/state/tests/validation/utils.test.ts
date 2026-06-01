import { describe, it, expect } from "vitest";
import * as v from "valibot";
import { findUnknownProperties } from "@project/state";

describe("findUnknownProperties", () => {
  describe("leaf / non-structural schemas", () => {
    it("returns [] for primitive schemas", () => {
      expect(findUnknownProperties(v.string(), "hello")).toEqual([]);
      expect(findUnknownProperties(v.number(), 42)).toEqual([]);
      expect(findUnknownProperties(v.boolean(), true)).toEqual([]);
    });

    it("returns [] for v.optional wrapping an object", () => {
      const schema = v.optional(v.object({ a: v.string() }));
      expect(findUnknownProperties(schema, { a: "x", extra: true })).toEqual([]);
    });

    it("returns [] for v.nullable wrapping an object", () => {
      const schema = v.nullable(v.object({ a: v.string() }));
      expect(findUnknownProperties(schema, { a: "x", extra: true })).toEqual([]);
    });

    it("returns [] for v.nullish wrapping an object", () => {
      const schema = v.nullish(v.object({ a: v.string() }));
      expect(findUnknownProperties(schema, { a: "x", extra: true })).toEqual([]);
    });

    it("returns [] for v.union", () => {
      const schema = v.union([v.string(), v.object({ a: v.number() })]);
      expect(findUnknownProperties(schema, { a: 1, extra: true })).toEqual([]);
    });
  });

  describe("object schema", () => {
    it("returns [] for null value", () => {
      const schema = v.object({ a: v.string() });
      expect(findUnknownProperties(schema, null)).toEqual([]);
    });

    it("returns [] for non-object value (string, number, array)", () => {
      const schema = v.object({ a: v.string() });
      expect(findUnknownProperties(schema, "nope")).toEqual([]);
      expect(findUnknownProperties(schema, 99)).toEqual([]);
      expect(findUnknownProperties(schema, [1, 2, 3])).toEqual([]);
    });

    it("returns [] when value is an empty object", () => {
      const schema = v.object({ a: v.string(), b: v.number() });
      expect(findUnknownProperties(schema, {})).toEqual([]);
    });

    it("reports all keys as unknown for an empty object schema", () => {
      const schema = v.object({});
      expect(findUnknownProperties(schema, { a: 1, b: "x", c: true })).toEqual(["a", "b", "c"]);
    });

    it("returns [] when all value keys match schema entries", () => {
      const schema = v.object({ name: v.string(), count: v.number() });
      expect(findUnknownProperties(schema, { name: "foo", count: 42 })).toEqual([]);
    });

    it("reports extra keys as unknown", () => {
      const schema = v.object({ known: v.string() });
      expect(findUnknownProperties(schema, { known: "ok", extra1: 1, extra2: true })).toEqual(["extra1", "extra2"]);
    });

    it("does not flag missing keys as unknown", () => {
      const schema = v.object({ a: v.string(), b: v.number() });
      expect(findUnknownProperties(schema, { a: "only" })).toEqual([]);
    });

    it("builds correct dotted paths for root-level unknowns", () => {
      const schema = v.object({ a: v.string() });
      const result = findUnknownProperties(schema, { a: "x", b: 1, c: 2 });
      expect(result).toEqual(["b", "c"]);
    });
  });

  describe("object schema — nested / multiple layers", () => {
    it("recurses into a directly nested object (no wrapper)", () => {
      const schema = v.object({
        inner: v.object({ existing: v.string() }),
      });
      const value = { inner: { existing: "ok", extra: true } };
      expect(findUnknownProperties(schema, value)).toEqual(["inner.extra"]);
    });

    it("recurses multiple levels deep and builds correct paths", () => {
      const schema = v.object({
        lvl1: v.object({
          lvl2: v.object({
            lvl3: v.string(),
          }),
        }),
      });
      const value = { lvl1: { lvl2: { lvl3: "ok", lvl4: "extra" } } };
      expect(findUnknownProperties(schema, value)).toEqual(["lvl1.lvl2.lvl4"]);
    });

    it("detects unknowns at every nesting level", () => {
      const schema = v.object({
        a: v.object({
          b: v.string(),
          c: v.object({
            d: v.number(),
          }),
        }),
      });
      const value = {
        a: {
          b: "x",
          extra1: 1,
          c: {
            d: 42,
            extra2: 2,
          },
        },
        extraRoot: true,
      };
      const result = findUnknownProperties(schema, value);
      expect(result).toContain("extraRoot");
      expect(result).toContain("a.extra1");
      expect(result).toContain("a.c.extra2");
      expect(result).toHaveLength(3);
    });
  });

  describe("object schema — wrapped fields (optional / nullable / nullish / union)", () => {
    it("does NOT recurse into v.optional fields", () => {
      const schema = v.object({
        a: v.optional(v.object({ n: v.number() })),
      });
      const value = { a: { n: 1, extra: true } };
      expect(findUnknownProperties(schema, value)).toEqual([]);
    });

    it("does NOT recurse into v.nullable fields", () => {
      const schema = v.object({
        a: v.nullable(v.object({ n: v.number() })),
      });
      const value = { a: { n: 1, extra: true } };
      expect(findUnknownProperties(schema, value)).toEqual([]);
    });

    it("does NOT recurse into v.nullish fields", () => {
      const schema = v.object({
        a: v.nullish(v.object({ n: v.number() })),
      });
      const value = { a: { n: 1, extra: true } };
      expect(findUnknownProperties(schema, value)).toEqual([]);
    });

    it("does NOT recurse into v.union fields", () => {
      const schema = v.object({
        a: v.union([v.string(), v.object({ n: v.number() })]),
      });
      const value = { a: { n: 1, extra: true } };
      expect(findUnknownProperties(schema, value)).toEqual([]);
    });

    it("does NOT recurse into nested optional → object fields within deeper objects", () => {
      const schema = v.object({
        inner: v.object({
          opt: v.optional(v.object({ x: v.string() })),
        }),
      });
      const value = { inner: { opt: { x: "ok", extra: "y" } } };
      expect(findUnknownProperties(schema, value)).toEqual([]);
    });

    it("still detects unknown keys at the parent level when fields are wrapped", () => {
      const schema = v.object({
        ok: v.optional(v.object({})),
      });
      const value = { ok: {}, extraRoot: true };
      expect(findUnknownProperties(schema, value)).toEqual(["extraRoot"]);
    });
  });

  describe("array schema", () => {
    it("returns [] for non-array value", () => {
      const schema = v.array(v.string());
      expect(findUnknownProperties(schema, "not-array")).toEqual([]);
      expect(findUnknownProperties(schema, null)).toEqual([]);
      expect(findUnknownProperties(schema, {})).toEqual([]);
    });

    it("returns [] for empty array", () => {
      const schema = v.array(v.object({ a: v.string() }));
      expect(findUnknownProperties(schema, [])).toEqual([]);
    });

    it("returns [] for array of primitives", () => {
      const schema = v.array(v.string());
      expect(findUnknownProperties(schema, ["a", "b", "c"])).toEqual([]);
    });

    it("detects unknown properties in array of objects", () => {
      const schema = v.array(v.object({ x: v.number() }));
      const value = [{ x: 1, y: 2 }, { x: 3, z: 4 }];
      expect(findUnknownProperties(schema, value)).toEqual(["[0].y", "[1].z"]);
    });

    it("handles arrays nested inside objects", () => {
      const schema = v.object({
        items: v.array(v.object({ name: v.string() })),
      });
      const value = {
        items: [
          { name: "foo", extra: 1 },
          { name: "bar" },
          { name: "baz", other: true },
        ],
      };
      const result = findUnknownProperties(schema, value);
      expect(result).toEqual(["items[0].extra", "items[2].other"]);
    });

    it("handles nested arrays (array of arrays)", () => {
      const schema = v.array(v.array(v.object({ id: v.number() })));
      const value = [
        [{ id: 1 }, { id: 2, extra: "x" }],
        [{ id: 3 }],
      ];
      expect(findUnknownProperties(schema, value)).toEqual(["[0][1].extra"]);
    });

    it("builds correct bracket-indexed paths", () => {
      const schema = v.array(v.object({ a: v.string() }));
      const value = [{ a: "x" }, { a: "y", b: "extra" }];
      expect(findUnknownProperties(schema, value)).toEqual(["[1].b"]);
    });
  });

  describe("tuple schema", () => {
    it("returns [] for non-array value", () => {
      const schema = v.tuple([v.string(), v.number()]);
      expect(findUnknownProperties(schema, "not-tuple")).toEqual([]);
      expect(findUnknownProperties(schema, null)).toEqual([]);
    });

    it("returns [] when value matches tuple length exactly", () => {
      const schema = v.tuple([v.string(), v.number()]);
      expect(findUnknownProperties(schema, ["hello", 42])).toEqual([]);
    });

    it("reports extra elements beyond tuple length", () => {
      const schema = v.tuple([v.string()]);
      expect(findUnknownProperties(schema, ["hello", 42, true])).toEqual(["[1]", "[2]"]);
    });

    it("does not report missing elements (shorter array)", () => {
      const schema = v.tuple([v.string(), v.number(), v.boolean()]);
      expect(findUnknownProperties(schema, ["hello", 42])).toEqual([]);
    });

    it("recurses into object tuple items", () => {
      const schema = v.tuple([v.object({ a: v.string() }), v.string()]);
      const value = [{ a: "ok", extra: "x" }, "hello"];
      expect(findUnknownProperties(schema, value)).toEqual(["[0].extra"]);
    });

    it("handles tuples inside objects", () => {
      const schema = v.object({
        point: v.tuple([v.number(), v.number(), v.number()]),
      });
      const value = { point: [1, 2, 3, 4] };
      expect(findUnknownProperties(schema, value)).toEqual(["point[3]"]);
    });
  });

  describe("mixed / combined nesting", () => {
    it("object → array → object → unknown", () => {
      const schema = v.object({
        data: v.array(
          v.object({
            nested: v.object({ id: v.string() }),
          }),
        ),
      });
      const value = {
        data: [
          { nested: { id: "abc", extra: true } },
        ],
      };
      expect(findUnknownProperties(schema, value)).toEqual(["data[0].nested.extra"]);
    });

    it("tuple with object items nested in array", () => {
      const schema = v.array(
        v.tuple([v.object({ x: v.number() }), v.string()]),
      );
      const value = [
        [{ x: 1, extra: true }, "a"],
        [{ x: 2 }, "b"],
      ];
      expect(findUnknownProperties(schema, value)).toEqual(["[0][0].extra"]);
    });
  });

  describe("path construction", () => {
    it("joins object keys with dots", () => {
      const schema = v.object({
        a: v.object({ b: v.object({ c: v.string() }) }),
      });
      const value = { a: { b: { c: "x", d: 1 } } };
      expect(findUnknownProperties(schema, value)).toEqual(["a.b.d"]);
    });

    it("uses bracket notation for array indices", () => {
      const schema = v.object({
        arr: v.array(v.object({ val: v.number() })),
      });
      const value = { arr: [{ val: 1, extra: true }] };
      expect(findUnknownProperties(schema, value)).toEqual(["arr[0].extra"]);
    });

    it("handles mixed dot and bracket paths", () => {
      const schema = v.object({
        matrix: v.array(v.array(v.object({ val: v.number() }))),
      });
      const value = {
        matrix: [
          [{ val: 1 }, { val: 2 }],
          [{ val: 3, extra: true }],
        ],
      };
      expect(findUnknownProperties(schema, value)).toEqual(["matrix[1][0].extra"]);
    });
  });
});
