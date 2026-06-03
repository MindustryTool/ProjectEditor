import * as v from "valibot";
import { describe, expect, it } from "vitest";
import {
	resolveSchema,
	unwrapSchema,
	hasNullishWrapper,
	getSchemaEntries,
	getArrayItemSchema,
	getSchemaMetadata,
	type AnySchema,
	MindustryHexColorSchema,
} from "@project/schema";

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

	it("preserves entries through resolveSchema for plain object", () => {
		const schema = v.object({ a: v.string(), b: v.number() });
		const resolved = resolveSchema(schema as AnySchema, {});
		expect(getSchemaEntries(resolved as AnySchema)).toHaveLength(2);
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
	it("resolves effect union with correct type dispatching", () => {
		const effectBaseObjectSchema = v.object({
			type: v.picklist(["ParticleEffect", "MultiEffect"] as const),
			lifetime: v.nullish(v.number(), 50),
		});
		const classSchemaMap: Record<string, () => ReturnType<typeof v.object>> = {
			ParticleEffect: () => v.object({ colorFrom: v.nullish(v.string()) }),
			MultiEffect: () =>
				v.object({
					effects: v.array(
						v.pipe(
							v.lazy(() => effectItemUnionSchema),
							v.metadata({ type: "effect" }),
						),
					),
				}),
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

		// Test resolution with ParticleEffect
		const resolvedParticle = resolveSchema(effectItemUnionSchema as AnySchema, { type: "ParticleEffect", colorFrom: "ff0000" });
		const particleEntries = getSchemaEntries(resolvedParticle as AnySchema);
		expect(particleEntries.map(([k]) => k)).toContain("colorFrom");
		expect(particleEntries.map(([k]) => k)).toContain("lifetime");

		// Test resolution with MultiEffect
		const resolvedMulti = resolveSchema(effectItemUnionSchema as AnySchema, {
			type: "MultiEffect",
			effects: [{ type: "ParticleEffect" }],
		});
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

		// Step 2: resolveSchema with node value
		const resolved = resolveSchema(effectSchema as AnySchema, { type: "ParticleEffect", colorFrom: "ff0000" });

		// Step 3: getSchemaEntries from resolved schema
		const entries = getSchemaEntries(resolved as AnySchema);
		expect(entries.map(([k]) => k).sort()).toEqual(["colorFrom", "colorTo", "type"].sort());
	});
});
