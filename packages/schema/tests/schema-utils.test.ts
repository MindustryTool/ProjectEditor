import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { lazyArray, resolveSchema, unwrapSchema, hasNullishWrapper, detectSchemaType, getSchemaEntries, getArrayItemSchema, getSchemaMetadata, type AnySchema, MindustryHexColorSchema, ContentNameSchema } from "@project/schema";

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

	it("returns indexed item schema for lazyArray", () => {
		const schema = lazyArray((index) => (index % 2 === 0 ? v.string() : v.number()));
		expect(detectSchemaType(getArrayItemSchema(schema as AnySchema, 0) as AnySchema)).toBe("string");
		expect(detectSchemaType(getArrayItemSchema(schema as AnySchema, 1) as AnySchema)).toBe("number");
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

describe("resolveSchema", () => {
	it("returns non-lazy non-wrapped schema as-is", () => {
		const schema = v.object({ x: v.string() });
		expect(resolveSchema(schema as AnySchema, {})).toBe(schema);
	});

	it("returns inner schema for v.pipe(object, metadata)", () => {
		const inner = v.object({ x: v.string() });
		const piped = v.pipe(inner, v.metadata({ type: "test" }));
		const resolved = resolveSchema(piped as AnySchema, {});
		expect(resolved).not.toBe(piped);
		expect((resolved as unknown as { entries: Record<string, unknown> }).entries).toBeDefined();
	});

	it("resolves v.lazy with given value", () => {
		const schema = v.lazy((input: unknown) => {
			const type = (input as Record<string, unknown>)?.type;
			if (type === "a") return v.object({ aField: v.string() });
			return v.object({ bField: v.number() });
		});
		const resolvedA = resolveSchema(schema as AnySchema, { type: "a" });
		expect((resolvedA as unknown as Record<string, unknown>).type).toBe("object");
		expect(getSchemaEntries(resolvedA as AnySchema).map(([k]) => k)).toEqual(["aField"]);

		const resolvedB = resolveSchema(schema as AnySchema, { type: "b" });
		expect(getSchemaEntries(resolvedB as AnySchema).map(([k]) => k)).toEqual(["bField"]);
	});

	it("resolves nested lazy inside pipe", () => {
		const inner = v.lazy((input: unknown) => {
			if ((input as Record<string, unknown>)?.x) return v.object({ y: v.string() });
			return v.object({ z: v.number() });
		});
		const piped = v.pipe(inner, v.metadata({ type: "effect" }));
		const resolved = resolveSchema(piped as AnySchema, { x: true });
		expect(getSchemaEntries(resolved as AnySchema).map(([k]) => k)).toEqual(["y"]);
	});

	it("strips nullish wrapper then resolves lazy", () => {
		const lazy = v.lazy(() => v.object({ val: v.string() }));
		const wrapped = v.nullish(lazy);
		const resolved = resolveSchema(wrapped as AnySchema, {});
		expect((resolved as unknown as { type: string }).type).toBe("object");
		expect(getSchemaEntries(resolved as AnySchema).map(([k]) => k)).toEqual(["val"]);
	});

	it("handles piped lazy with metadata for getSchemaEntries", () => {
		const lazy = v.lazy((input: unknown) => {
			if ((input as Record<string, unknown>)?.type === "foo") return v.object({ fooField: v.string() });
			return v.object({ barField: v.number() });
		});
		const piped = v.pipe(lazy, v.metadata({ type: "effect" }));
		// detectSchemaType should find metadata
		expect(detectSchemaType(piped as AnySchema)).toBe("effect");
		// resolveSchema with value should produce object with correct entries
		const resolved = resolveSchema(piped as AnySchema, { type: "foo" });
		const entries = getSchemaEntries(resolved as AnySchema);
		expect(entries.map(([k]) => k)).toEqual(["fooField"]);
	});

	it("preserves entries through resolveSchema for plain object", () => {
		const schema = v.object({ a: v.string(), b: v.number() });
		const resolved = resolveSchema(schema as AnySchema, {});
		expect(getSchemaEntries(resolved as AnySchema)).toHaveLength(2);
	});

	it("parses each lazyArray item with schema resolved from index", () => {
		const schema = lazyArray((index) =>
			index % 2 === 0
				? v.pipe(v.string(), v.minLength(2))
				: v.pipe(v.number(), v.minValue(10)),
		);

		const success = v.safeParse(schema, ["ab", 12, "cd"]);
		expect(success.success).toBe(true);
		if (success.success) {
			expect(success.output).toEqual(["ab", 12, "cd"]);
		}

		const failure = v.safeParse(schema, ["a", 3]);
		expect(failure.success).toBe(false);
		if (!failure.success) {
			expect(failure.issues).toHaveLength(2);
			expect(failure.issues[0]?.path?.[0]?.key).toBe(0);
			expect(failure.issues[1]?.path?.[0]?.key).toBe(1);
		}
	});
});

describe("getSchemaEntries with valibot pipe structure", () => {
	it("extracts entries from v.pipe(object, metadata)", () => {
		const inner = v.object({ name: v.string() });
		const piped = v.pipe(inner, v.metadata({ type: "test" }));
		const entries = getSchemaEntries(piped as AnySchema);
		expect(entries).toHaveLength(1);
		expect(entries[0]![0]).toBe("name");
	});

	it("extracts entries from v.pipe(string, metadata) - returns none", () => {
		const piped = v.pipe(v.string(), v.metadata({ type: "effect" }));
		expect(getSchemaEntries(piped as AnySchema)).toEqual([]);
	});

	it("extracts entries from piped lazy after resolveSchema", () => {
		const lazy = v.lazy(() => v.object({ x: v.string() }));
		const piped = v.pipe(lazy, v.metadata({ type: "effect" }));
		const resolved = resolveSchema(piped as AnySchema, {});
		const entries = getSchemaEntries(resolved as AnySchema);
		expect(entries.map(([k]) => k)).toEqual(["x"]);
	});
});

describe("Effect schema integration", () => {
	it("detects bare lazy inside array as unknown (needs metadata wrapper)", () => {
		const lazy = v.lazy(() => v.pipe(v.string(), v.metadata({ type: "effect" })));
		const arr = v.array(lazy);
		const item = getArrayItemSchema(arr as AnySchema);
		expect(detectSchemaType(item as AnySchema)).toBe("unknown");
	});

	it("detects metadata-wrapped lazy inside array as effect", () => {
		const wrapped = v.pipe(v.lazy(() => v.pipe(v.string(), v.metadata({ type: "effect" }))), v.metadata({ type: "effect" }));
		const arr = v.array(wrapped);
		const item = getArrayItemSchema(arr as AnySchema);
		expect(detectSchemaType(item as AnySchema)).toBe("effect");
	});

	it("detects piped lazy with metadata as effect", () => {
		const lazy = v.lazy(() => v.object({ colorFrom: v.nullish(v.string()) }));
		const piped = v.pipe(lazy, v.metadata({ type: "effect" }));
		expect(detectSchemaType(piped as AnySchema)).toBe("effect");
	});

	it("resolves effect union with correct type dispatching", () => {
		const effectBaseObjectSchema = v.object({
			type: v.picklist(["ParticleEffect", "MultiEffect"] as const),
			lifetime: v.nullish(v.number(), 50),
		});
		const classSchemaMap: Record<string, () => ReturnType<typeof v.object>> = {
			ParticleEffect: () => v.object({ colorFrom: v.nullish(v.string()) }),
			MultiEffect: () => v.object({ effects: v.array(v.pipe(v.lazy(() => effectItemUnionSchema), v.metadata({ type: "effect" }))) }),
		};
		const effectItemUnionSchema = v.pipe(
			v.lazy((input) => {
				if (typeof input === "object" && input !== null && "type" in input) {
					const type = (input as Record<string, unknown>).type as string;
					const fn = classSchemaMap[type];
					if (fn) return v.object({ ...effectBaseObjectSchema.entries, ...fn().entries });
				}
				return v.pipe(v.string(), v.minLength(1), v.maxLength(127));
			}),
			v.metadata({ type: "effect" }),
		);

		// Test detection
		expect(detectSchemaType(effectItemUnionSchema as AnySchema)).toBe("effect");

		// Test resolution with ParticleEffect
		const resolvedParticle = resolveSchema(effectItemUnionSchema as AnySchema, { type: "ParticleEffect", colorFrom: "ff0000" });
		const particleEntries = getSchemaEntries(resolvedParticle as AnySchema);
		expect(particleEntries.map(([k]) => k)).toContain("colorFrom");
		expect(particleEntries.map(([k]) => k)).toContain("lifetime");

		// Test resolution with MultiEffect
		const resolvedMulti = resolveSchema(effectItemUnionSchema as AnySchema, { type: "MultiEffect", effects: [{ type: "ParticleEffect" }] });
		const multiEntries = getSchemaEntries(resolvedMulti as AnySchema);
		expect(multiEntries.map(([k]) => k)).toContain("effects");
		expect(multiEntries.map(([k]) => k)).toContain("type");
	});

	it("simulates FieldRenderer entry schema flow for effect fields", () => {
		// This mirrors how FieldsRenderer/ObjectField process entry schemas
		const effectSchema = v.pipe(
			v.lazy((input) => {
				if (typeof input === "object" && input !== null && "type" in input) {
					const type = (input as Record<string, unknown>).type;
					if (type === "ParticleEffect") {
						return v.object({ type: v.string(), colorFrom: v.nullish(v.string()), colorTo: v.nullish(v.string()) });
					}
				}
				return v.pipe(v.string(), v.minLength(1), v.maxLength(127));
			}),
			v.metadata({ type: "effect" }),
		);

		// Step 1: detectSchemaType should return "effect"
		expect(detectSchemaType(effectSchema as AnySchema)).toBe("effect");

		// Step 2: resolveSchema with node value
		const resolved = resolveSchema(effectSchema as AnySchema, { type: "ParticleEffect", colorFrom: "ff0000" });

		// Step 3: getSchemaEntries from resolved schema
		const entries = getSchemaEntries(resolved as AnySchema);
		expect(entries.map(([k]) => k).sort()).toEqual(["colorFrom", "colorTo", "type"].sort());
	});
});
