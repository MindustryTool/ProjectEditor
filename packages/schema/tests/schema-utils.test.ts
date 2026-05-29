import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { unwrapSchema, hasNullishWrapper, detectSchemaType, getSchemaEntries, getArrayItemSchema } from "../src/schema-utils";
import { MindustryHexColorSchema, ResearchSchema, ContentNameSchema } from "../src/index";

describe("unwrapSchema", () => {
	it("returns the same schema for non-wrapped types", () => {
		const schema = v.string();
		expect(unwrapSchema(schema as any)).toBe(schema);
	});

	it("strips v.optional wrapper", () => {
		const inner = v.number();
		const wrapped = v.optional(inner);
		expect(unwrapSchema(wrapped as any)).toBe(inner);
	});

	it("strips v.nullable wrapper", () => {
		const inner = v.string();
		const wrapped = v.nullable(inner);
		expect(unwrapSchema(wrapped as any)).toBe(inner);
	});

	it("strips v.nullish wrapper", () => {
		const inner = v.boolean();
		const wrapped = v.nullish(inner);
		expect(unwrapSchema(wrapped as any)).toBe(inner);
	});

	it("strips nested wrappers", () => {
		const inner = v.number();
		const wrapped = v.nullish(v.optional(v.nullable(inner)));
		expect(unwrapSchema(wrapped as any)).toBe(inner);
	});

	it("does not strip v.pipe", () => {
		const schema = v.pipe(v.string(), v.minLength(1));
		expect(unwrapSchema(schema as any)).toBe(schema);
	});
});

describe("hasNullishWrapper", () => {
	it("returns true for v.nullish", () => {
		expect(hasNullishWrapper(v.nullish(v.string()) as any)).toBe(true);
	});

	it("returns true for v.optional", () => {
		expect(hasNullishWrapper(v.optional(v.string()) as any)).toBe(true);
	});

	it("returns true for v.nullable", () => {
		expect(hasNullishWrapper(v.nullable(v.string()) as any)).toBe(true);
	});

	it("returns false for bare types", () => {
		expect(hasNullishWrapper(v.string() as any)).toBe(false);
		expect(hasNullishWrapper(v.number() as any)).toBe(false);
	});

	it("returns false for v.pipe", () => {
		expect(hasNullishWrapper(v.pipe(v.string(), v.minLength(1)) as any)).toBe(false);
	});

	it("returns false for v.object", () => {
		expect(hasNullishWrapper(v.object({}) as any)).toBe(false);
	});
});

describe("detectSchemaType", () => {
	it("returns 'string' for v.string()", () => {
		expect(detectSchemaType(v.string() as any)).toBe("string");
	});

	it("returns 'string' for v.pipe(v.string(), ...)", () => {
		expect(detectSchemaType(v.pipe(v.string(), v.minLength(1)) as any)).toBe("string");
	});

	it("returns 'number' for v.number()", () => {
		expect(detectSchemaType(v.number() as any)).toBe("number");
	});

	it("returns 'number' for v.pipe(v.number(), v.minValue(0))", () => {
		expect(detectSchemaType(v.pipe(v.number(), v.minValue(0)) as any)).toBe("number");
	});

	it("returns 'boolean' for v.boolean()", () => {
		expect(detectSchemaType(v.boolean() as any)).toBe("boolean");
	});

	it("returns 'object' for v.object({})", () => {
		expect(detectSchemaType(v.object({}) as any)).toBe("object");
	});

	it("returns 'array' for v.array(v.string())", () => {
		expect(detectSchemaType(v.array(v.string()) as any)).toBe("array");
	});

	it("detects hex-color by identity", () => {
		expect(detectSchemaType(MindustryHexColorSchema as any)).toBe("hex-color");
	});

	it("detects hex-color through v.nullish wrapper", () => {
		const wrapped = v.nullish(MindustryHexColorSchema);
		expect(detectSchemaType(wrapped as any)).toBe("hex-color");
	});

	it("detects research by identity", () => {
		expect(detectSchemaType(ResearchSchema as any)).toBe("research");
	});

	it("does not detect ContentNameSchema as hex-color", () => {
		expect(detectSchemaType(ContentNameSchema as any)).not.toBe("hex-color");
	});

	it("returns 'unknown' for a custom schema", () => {
		const custom = v.custom(() => true);
		expect(detectSchemaType(custom as any)).toBe("unknown");
	});

	it("returns 'unknown' for v.union schema", () => {
		const union = v.union([v.string(), v.number()]);
		expect(detectSchemaType(union as any)).toBe("unknown");
	});

	it("returns 'unknown' for v.pipe with unknown base", () => {
		const pipe = v.pipe(v.any(), v.check(() => true));
		expect(detectSchemaType(pipe as any)).toBe("unknown");
	});
});

describe("getSchemaEntries", () => {
	it("returns entries for an object schema", () => {
		const schema = v.object({
			name: v.string(),
			count: v.number(),
		});
		const entries = getSchemaEntries(schema as any);
		expect(entries).toHaveLength(2);
		expect(entries[0]![0]).toBe("name");
		expect(entries[1]![0]).toBe("count");
	});

	it("returns empty array for non-object schema", () => {
		expect(getSchemaEntries(v.string() as any)).toEqual([]);
	});

	it("returns empty array for array schema", () => {
		expect(getSchemaEntries(v.array(v.string()) as any)).toEqual([]);
	});
});

describe("getArrayItemSchema", () => {
	it("returns item schema for an array schema", () => {
		const item = v.string();
		const schema = v.array(item);
		expect(getArrayItemSchema(schema as any)).toBe(item);
	});

	it("returns null for non-array schema", () => {
		expect(getArrayItemSchema(v.string() as any)).toBeNull();
	});

	it("returns null for object schema", () => {
		expect(getArrayItemSchema(v.object({}) as any)).toBeNull();
	});
});
