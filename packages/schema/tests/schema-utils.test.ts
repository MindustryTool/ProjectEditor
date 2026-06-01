import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { unwrapSchema, hasNullishWrapper, detectSchemaType, getSchemaEntries, getArrayItemSchema, getSchemaMetadata, type AnySchema, MindustryHexColorSchema, ContentNameSchema } from "@project/schema";

describe("unwrapSchema", () => {
	it("returns the same schema for non-wrapped types", () => {
		const schema = v.string();
		expect(unwrapSchema(schema as AnySchema)).toBe(schema);
	});

	it("strips v.optional wrapper", () => {
		const inner = v.number();
		const wrapped = v.optional(inner);
		expect(unwrapSchema(wrapped as AnySchema)).toBe(inner);
	});

	it("strips v.nullable wrapper", () => {
		const inner = v.string();
		const wrapped = v.nullable(inner);
		expect(unwrapSchema(wrapped as AnySchema)).toBe(inner);
	});

	it("strips v.nullish wrapper", () => {
		const inner = v.boolean();
		const wrapped = v.nullish(inner);
		expect(unwrapSchema(wrapped as AnySchema)).toBe(inner);
	});

	it("strips nested wrappers", () => {
		const inner = v.number();
		const wrapped = v.nullish(v.optional(v.nullable(inner)));
		expect(unwrapSchema(wrapped as AnySchema)).toBe(inner);
	});

	it("does not strip v.pipe", () => {
		const schema = v.pipe(v.string(), v.minLength(1));
		expect(unwrapSchema(schema as AnySchema)).toBe(schema);
	});
});

describe("hasNullishWrapper", () => {
	it("returns true for v.nullish", () => {
		expect(hasNullishWrapper(v.nullish(v.string()) as AnySchema)).toBe(true);
	});

	it("returns true for v.optional", () => {
		expect(hasNullishWrapper(v.optional(v.string()) as AnySchema)).toBe(true);
	});

	it("returns true for v.nullable", () => {
		expect(hasNullishWrapper(v.nullable(v.string()) as AnySchema)).toBe(true);
	});

	it("returns false for bare types", () => {
		expect(hasNullishWrapper(v.string() as AnySchema)).toBe(false);
		expect(hasNullishWrapper(v.number() as AnySchema)).toBe(false);
	});

	it("returns false for v.pipe", () => {
		expect(hasNullishWrapper(v.pipe(v.string(), v.minLength(1)) as AnySchema)).toBe(false);
	});

	it("returns false for v.object", () => {
		expect(hasNullishWrapper(v.object({}) as AnySchema)).toBe(false);
	});
});

describe("detectSchemaType", () => {
	it("returns 'string' for v.string()", () => {
		expect(detectSchemaType(v.string() as AnySchema)).toBe("string");
	});

	it("returns 'string' for v.pipe(v.string(), ...)", () => {
		expect(detectSchemaType(v.pipe(v.string(), v.minLength(1)) as AnySchema)).toBe("string");
	});

	it("returns 'number' for v.number()", () => {
		expect(detectSchemaType(v.number() as AnySchema)).toBe("number");
	});

	it("returns 'number' for v.pipe(v.number(), v.minValue(0))", () => {
		expect(detectSchemaType(v.pipe(v.number(), v.minValue(0)) as AnySchema)).toBe("number");
	});

	it("returns 'boolean' for v.boolean()", () => {
		expect(detectSchemaType(v.boolean() as AnySchema)).toBe("boolean");
	});

	it("returns 'object' for v.object({})", () => {
		expect(detectSchemaType(v.object({}) as AnySchema)).toBe("object");
	});

	it("returns 'array' for v.array(v.string())", () => {
		expect(detectSchemaType(v.array(v.string()) as AnySchema)).toBe("array");
	});

	it("detects color by identity", () => {
		expect(detectSchemaType(MindustryHexColorSchema as AnySchema)).toBe("color");
	});

	it("detects color through v.nullish wrapper", () => {
		const wrapped = v.nullish(MindustryHexColorSchema);
		expect(detectSchemaType(wrapped as AnySchema)).toBe("color");
	});

	it("detects research via metadata", () => {
		const researchPipe = v.pipe(v.string(), v.metadata({ type: "research" }));
		expect(detectSchemaType(researchPipe as AnySchema)).toBe("research");
	});

	it("detects research through nullish wrapper via metadata", () => {
		const wrapped = v.nullish(v.pipe(v.string(), v.metadata({ type: "research" })));
		expect(detectSchemaType(wrapped as AnySchema)).toBe("research");
	});

	it("detects effect via metadata", () => {
		const effectPipe = v.pipe(v.string(), v.metadata({ type: "effect" }));
		expect(detectSchemaType(effectPipe as AnySchema)).toBe("effect");
	});

	it("does not detect ContentNameSchema as color", () => {
		expect(detectSchemaType(ContentNameSchema as AnySchema)).not.toBe("color");
	});

	it("falls back to base type when metadata type is not in known types", () => {
		const customMetadata = v.pipe(v.number(), v.metadata({ type: "custom_widget" }));
		expect(detectSchemaType(customMetadata as AnySchema)).toBe("number");
	});

	it("returns 'unknown' for a custom schema", () => {
		const custom = v.custom(() => true);
		expect(detectSchemaType(custom as AnySchema)).toBe("unknown");
	});

	it("returns 'unknown' for v.union schema", () => {
		const union = v.union([v.string(), v.number()]);
		expect(detectSchemaType(union as AnySchema)).toBe("unknown");
	});

	it("returns 'unknown' for v.pipe with unknown base", () => {
		const pipe = v.pipe(
			v.any(),
			v.check(() => true),
		);
		expect(detectSchemaType(pipe as AnySchema)).toBe("unknown");
	});
});

describe("getSchemaEntries", () => {
	it("returns entries for an object schema", () => {
		const schema = v.object({
			name: v.string(),
			count: v.number(),
		});
		const entries = getSchemaEntries(schema as AnySchema);
		expect(entries).toHaveLength(2);
		expect(entries[0]![0]).toBe("name");
		expect(entries[1]![0]).toBe("count");
	});

	it("returns empty array for non-object schema", () => {
		expect(getSchemaEntries(v.string() as AnySchema)).toEqual([]);
	});

	it("returns empty array for array schema", () => {
		expect(getSchemaEntries(v.array(v.string()) as AnySchema)).toEqual([]);
	});
});

describe("getArrayItemSchema", () => {
	it("returns item schema for an array schema", () => {
		const item = v.string();
		const schema = v.array(item);
		expect(getArrayItemSchema(schema as AnySchema)).toBe(item);
	});

	it("returns null for non-array schema", () => {
		expect(getArrayItemSchema(v.string() as AnySchema)).toBeNull();
	});

	it("returns null for object schema", () => {
		expect(getArrayItemSchema(v.object({}) as AnySchema)).toBeNull();
	});
});

describe("getSchemaMetadata", () => {
	it("returns metadata from pipe with v.metadata()", () => {
		const schema = v.pipe(v.string(), v.metadata({ visibleWhen: { field: "x", value: true } }));
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({ visibleWhen: { field: "x", value: true } });
	});

	it("returns null for pipe without metadata", () => {
		const schema = v.pipe(v.string(), v.minLength(1));
		expect(getSchemaMetadata(schema as AnySchema)).toBeNull();
	});

	it("returns null for non-pipe schema", () => {
		expect(getSchemaMetadata(v.string() as AnySchema)).toBeNull();
		expect(getSchemaMetadata(v.number() as AnySchema)).toBeNull();
		expect(getSchemaMetadata(v.boolean() as AnySchema)).toBeNull();
	});

	it("returns null for object schema", () => {
		expect(getSchemaMetadata(v.object({}) as AnySchema)).toBeNull();
	});

	it("unwraps nullish wrapper before extracting metadata", () => {
		const inner = v.pipe(v.string(), v.metadata({ visibleWhen: { field: "toggle", value: true } }));
		const wrapped = v.nullish(inner);
		expect(getSchemaMetadata(wrapped as AnySchema)).toEqual({ visibleWhen: { field: "toggle", value: true } });
	});

	it("unwraps optional wrapper before extracting metadata", () => {
		const inner = v.pipe(v.number(), v.metadata({ visibleWhen: { field: "flag", value: 1 } }));
		const wrapped = v.optional(inner);
		expect(getSchemaMetadata(wrapped as AnySchema)).toEqual({ visibleWhen: { field: "flag", value: 1 } });
	});

	it("returns last metadata when multiple metadata actions exist", () => {
		const schema = v.pipe(
			v.string(),
			v.metadata({ visibleWhen: { field: "first", value: 1 } }),
			v.metadata({ visibleWhen: { field: "last", value: 2 } }),
		);
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({ visibleWhen: { field: "last", value: 2 } });
	});

	it("returns metadata from pipe with color base schema", () => {
		const schema = v.pipe(MindustryHexColorSchema, v.metadata({ visibleWhen: { field: "gas", value: true } }));
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({ visibleWhen: { field: "gas", value: true } });
	});

	it("detects type as color for pipe with MindustryHexColorSchema and metadata", () => {
		const schema = v.pipe(MindustryHexColorSchema, v.metadata({ visibleWhen: { field: "gas", value: true } }));
		expect(detectSchemaType(schema as AnySchema)).toBe("color");
	});

	it("detects type as string for pipe with v.string() and metadata", () => {
		const schema = v.pipe(v.string(), v.metadata({ visibleWhen: { field: "x", value: "y" } }));
		expect(detectSchemaType(schema as AnySchema)).toBe("string");
	});

	it("detects type as number for pipe with v.number() and metadata", () => {
		const schema = v.pipe(v.number(), v.minValue(0), v.metadata({ visibleWhen: { field: "x", value: true } }));
		expect(detectSchemaType(schema as AnySchema)).toBe("number");
	});
});
