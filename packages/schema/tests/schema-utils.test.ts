import * as v from "valibot";
import { describe, expect, it } from "vitest";
import {
	resolveSchema,
	unwrapSchema,
	getDefaults,
	getSchemaEntries,
	getArrayItemSchema,
	getSchemaMetadata,
	type AnySchema,
	MindustryHexColorSchema,
	metadata,
	UnitHjsonSchema,
} from "@project/schema";
import type { ProjectContents } from "@project/types";

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

	it("strips v.optional wrapper", () => {
		const inner = v.boolean();
		const wrapped = v.optional(inner);
		expect(unwrapSchema(wrapped as AnySchema)).toBe(inner);
	});

	it("strips nested wrappers", () => {
		const inner = v.number();
		const wrapped = v.optional(v.optional(v.nullable(inner)));
		expect(unwrapSchema(wrapped as AnySchema)).toBe(inner);
	});

	it("does not strip v.pipe", () => {
		const schema = v.pipe(v.string(), v.minLength(1));
		expect(unwrapSchema(schema as AnySchema)).toBe(schema);
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

	it("throws for non-array schema", () => {
		expect(() => getArrayItemSchema(v.string() as AnySchema)).toThrow("Array schema must have item or getter");
	});

	it("throws for object schema", () => {
		expect(() => getArrayItemSchema(v.object({}) as AnySchema)).toThrow("Array schema must have item or getter");
	});
});

describe("getSchemaMetadata", () => {
	it("returns metadata from pipe with metadata()", () => {
		const schema = v.pipe(v.string(), metadata({ visibleWhen: { field: "x", value: true } }));
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

	it("unwraps optional wrapper before extracting metadata", () => {
		const inner = v.pipe(v.string(), metadata({ visibleWhen: { field: "toggle", value: true } }));
		const wrapped = v.optional(inner);
		expect(getSchemaMetadata(wrapped as AnySchema)).toEqual({ visibleWhen: { field: "toggle", value: true } });
	});

	it("unwraps optional wrapper before extracting metadata", () => {
		const inner = v.pipe(v.number(), metadata({ visibleWhen: { field: "flag", value: 1 } }));
		const wrapped = v.optional(inner);
		expect(getSchemaMetadata(wrapped as AnySchema)).toEqual({ visibleWhen: { field: "flag", value: 1 } });
	});

	it("returns last metadata when multiple metadata actions exist", () => {
		const schema = v.pipe(
			v.string(),
			metadata({ visibleWhen: { field: "first", value: 1 } }),
			metadata({ visibleWhen: { field: "last", value: 2 } }),
		);
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({ visibleWhen: { field: "last", value: 2 } });
	});

	it("returns metadata from pipe with color base schema", () => {
		const schema = v.pipe(MindustryHexColorSchema, metadata({ visibleWhen: { field: "gas", value: true } }));
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({ type: "color", visibleWhen: { field: "gas", value: true } });
	});

	it("getSchemaMetadata with getSchemaEntries returns metadata for each entry", () => {
		const schema = v.object({
			a: v.pipe(v.string(), metadata({ category: "cat1", name: "Field A" })),
			b: v.pipe(v.number(), metadata({ category: "cat2", name: "Field B" })),
			c: v.string(),
		});
		const entries = getSchemaEntries(schema as AnySchema);
		expect(getSchemaMetadata(entries[0]![1] as AnySchema)).toEqual({ category: "cat1", name: "Field A" });
		expect(getSchemaMetadata(entries[1]![1] as AnySchema)).toEqual({ category: "cat2", name: "Field B" });
		expect(getSchemaMetadata(entries[2]![1] as AnySchema)).toBeNull();
	});

	it("getSchemaMetadata works identically with and without unwrapSchema on non-wrapped schemas", () => {
		const schema = v.pipe(v.string(), metadata({ name: "test" }));
		const unwrapped = unwrapSchema(schema as AnySchema);
		expect(getSchemaMetadata(schema as AnySchema)).toEqual(getSchemaMetadata(unwrapped as AnySchema));
	});

	it("getSchemaMetadata differs with and without unwrapSchema on wrapped schemas", () => {
		const inner = v.pipe(v.string(), metadata({ name: "wrapped" }));
		const wrapped = v.optional(inner);
		expect(getSchemaMetadata(wrapped as AnySchema)).toEqual({ name: "wrapped" });
		expect(getSchemaMetadata(wrapped as AnySchema)).toEqual(getSchemaMetadata(unwrapSchema(wrapped as AnySchema) as AnySchema));
	});

	it("getSchemaMetadata works with v.pipe(v.optional(x), metadata()) pattern used in unit.ts", () => {
		const schema = v.pipe(
			v.optional(v.number(), 1.1),
			metadata({ name: "editor.unit.speed", description: "editor.unit.speed-description" }),
		);
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({
			name: "editor.unit.speed",
			description: "editor.unit.speed-description",
		});
	});

	it("getSchemaMetadata works with v.pipe(v.optional(v.boolean()), metadata()) pattern", () => {
		const schema = v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.unit.flying", description: "editor.unit.flying-description" }),
		);
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({
			name: "editor.unit.flying",
			description: "editor.unit.flying-description",
		});
	});

	it("unwrapSchema still strips v.pipe(v.optional(x), metadata()) to reach inner type", () => {
		const schema = v.pipe(v.optional(v.number()), metadata({ name: "test" }));
		const unwrapped = unwrapSchema(schema as AnySchema);
		expect((unwrapped as unknown as { type: string }).type).toBe("number");
	});

	it("unwrapSchema still strips plain v.optional()", () => {
		const inner = v.number();
		const wrapped = v.optional(inner);
		expect(unwrapSchema(wrapped as AnySchema)).toBe(inner);
	});

	it("UnitHjsonSchema entries have detectable metadata", () => {
		const mockContext: ProjectContents = {
			name: "test",
			items: [],
			blocks: [],
			liquids: [],
			sectors: [],
			statuses: [],
			units: [],
			sprites: [],
			effects: [],
			sounds: [],
		};
		const schema = UnitHjsonSchema(mockContext);
		const entries = getSchemaEntries(schema as AnySchema);
		const speedEntry = entries.find(([k]) => k === "speed");
		expect(speedEntry).toBeDefined();
		const meta = getSchemaMetadata(speedEntry![1] as AnySchema);
		expect(meta).toEqual({
			name: "editor.unit.speed",
			description: "editor.unit.speed-description",
			category: "editor.unit.category.movement-physics",
		});
	});

	it("getSchemaMetadata merges multiple metadata actions in the same pipe", () => {
		const schema = v.pipe(
			v.string(),
			metadata({ name: "test-name", description: "test-desc" }),
			metadata({ visibleWhen: { field: "x", value: true } }),
		);
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({
			name: "test-name",
			description: "test-desc",
			visibleWhen: { field: "x", value: true },
		});
	});

	it("getSchemaMetadata merges metadata from nested pipes", () => {
		const inner = v.pipe(v.string(), metadata({ name: "inner-name", description: "inner-desc" }));
		const schema = v.pipe(inner, metadata({ visibleWhen: { field: "x", value: true } }));
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({
			name: "inner-name",
			description: "inner-desc",
			visibleWhen: { field: "x", value: true },
		});
	});

	it("getSchemaMetadata nested pipe outer overrides inner on conflict", () => {
		const inner = v.pipe(v.string(), metadata({ name: "inner-name", description: "inner-desc" }));
		const schema = v.pipe(inner, metadata({ name: "outer-name" }));
		expect(getSchemaMetadata(schema as AnySchema)).toEqual({
			name: "outer-name",
			description: "inner-desc",
		});
	});

	it("getTypeFromMetadata extracts type from merged metadata", () => {
		const inner = v.pipe(v.string(), metadata({ name: "inner" }));
		const schema = v.pipe(inner, metadata({ type: "effect" }));
		const meta = getSchemaMetadata(schema as AnySchema);
		expect(meta).toEqual({ name: "inner", type: "effect" });
	});

	it("getSchemaEntries sort respects categories when used with getSchemaMetadata", () => {
		const schema = v.object({
			zField: v.pipe(v.string(), metadata({ category: "advanced" })),
			aField: v.pipe(v.string(), metadata({ category: "general" })),
			mField: v.pipe(v.string(), metadata({ category: "advanced" })),
			plainField: v.string(),
		});
		const entries = getSchemaEntries(schema as AnySchema);
		const categories = entries.map(([, s]) => getSchemaMetadata(s as AnySchema)?.category);
		const advIndices = categories.map((c, i) => (c === "advanced" ? i : -1)).filter((i) => i >= 0);
		const genIndices = categories.map((c, i) => (c === "general" ? i : -1)).filter((i) => i >= 0);
		const plainIndices = categories.map((c, i) => (c === undefined ? i : -1)).filter((i) => i >= 0);

		expect(advIndices[0]!).toBeLessThan(advIndices[1]!);
		expect(advIndices[0]!).toBeLessThan(genIndices[0]!);
		expect(genIndices[0]!).toBeLessThan(plainIndices[0]!);
	});
});

describe("resolveSchema", () => {
	it("returns non-lazy non-wrapped schema as-is", () => {
		const schema = v.object({ x: v.string() });
		expect(resolveSchema(schema as AnySchema, {})).toBe(schema);
	});

	it("returns inner schema for v.pipe(object, metadata)", () => {
		const inner = v.object({ x: v.string() });
		const piped = v.pipe(inner, metadata({ type: "object" }));
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
		const piped = v.pipe(inner, metadata({ type: "effect" }));
		const resolved = resolveSchema(piped as AnySchema, { x: true });
		expect(getSchemaEntries(resolved as AnySchema).map(([k]) => k)).toEqual(["y"]);
	});

	it("strips optional wrapper then resolves lazy", () => {
		const lazy = v.lazy(() => v.object({ val: v.string() }));
		const wrapped = v.optional(lazy);
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
		const piped = v.pipe(inner, metadata({ type: "object" }));
		const entries = getSchemaEntries(piped as AnySchema);
		expect(entries).toHaveLength(1);
		expect(entries[0]![0]).toBe("name");
	});

	it("extracts entries from v.pipe(string, metadata) - returns none", () => {
		const piped = v.pipe(v.string(), metadata({ type: "effect" }));
		expect(getSchemaEntries(piped as AnySchema)).toEqual([]);
	});

	it("extracts entries from piped lazy after resolveSchema", () => {
		const lazy = v.lazy(() => v.object({ x: v.string() }));
		const piped = v.pipe(lazy, metadata({ type: "effect" }));
		const resolved = resolveSchema(piped as AnySchema, {});
		const entries = getSchemaEntries(resolved as AnySchema);
		expect(entries.map(([k]) => k)).toEqual(["x"]);
	});
});

describe("Effect schema integration", () => {
	it("resolves effect union with correct type dispatching", () => {
		const effectBaseObjectSchema = v.object({
			type: v.picklist(["ParticleEffect", "MultiEffect"] as const),
			lifetime: v.optional(v.number(), 50),
		});
		const classSchemaMap: Record<string, () => ReturnType<typeof v.object>> = {
			ParticleEffect: () => v.object({ colorFrom: v.optional(v.string()) }),
			MultiEffect: () =>
				v.object({
					effects: v.array(
						v.pipe(
							v.lazy(() => effectItemUnionSchema),
							metadata({ type: "effect" }),
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
			metadata({ type: "effect" }),
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
						return v.object({ type: v.string(), colorFrom: v.optional(v.string()), colorTo: v.optional(v.string()) });
					}
				}
				return v.pipe(v.string(), v.minLength(1), v.maxLength(127));
			}),
			metadata({ type: "effect" }),
		);

		// Step 2: resolveSchema with node value
		const resolved = resolveSchema(effectSchema as AnySchema, { type: "ParticleEffect", colorFrom: "ff0000" });

		// Step 3: getSchemaEntries from resolved schema
		const entries = getSchemaEntries(resolved as AnySchema);
		expect(entries.map(([k]) => k).sort()).toEqual(["colorFrom", "colorTo", "type"].sort());
	});
});

describe("getDefaults", () => {
	it("returns empty string for string schema (no default)", () => {
		const schema = v.string();
		expect(getDefaults(schema as AnySchema, undefined)).toBe("");
	});

	it("returns empty string for number schema (no default)", () => {
		const schema = v.number();
		expect(getDefaults(schema as AnySchema, undefined)).toBe("");
	});

	it("returns empty string for boolean schema (no default)", () => {
		const schema = v.boolean();
		expect(getDefaults(schema as AnySchema, undefined)).toBe("");
	});

	it("returns default values for object schema with optional entries", () => {
		const schema = v.object({
			name: v.optional(v.string(), "hello"),
			count: v.optional(v.number(), 42),
		});
		expect(getDefaults(schema as AnySchema, {})).toEqual({ name: "hello", count: 42 });
	});

	it("returns empty object for empty object schema", () => {
		const schema = v.object({});
		expect(getDefaults(schema as AnySchema, {})).toEqual({});
	});

	it("returns empty array for array schema", () => {
		const schema = v.array(v.string());
		const result = getDefaults(schema as AnySchema, undefined);
		expect(Array.isArray(result)).toBe(true);
	});

	it("returns empty string for picklist schema (fallback)", () => {
		const schema = v.picklist(["a", "b", "c"] as const);
		expect(getDefaults(schema as AnySchema, undefined)).toBe("");
	});

	it("returns tuple values for tuple schema with defaults", () => {
		const schema = v.tuple([v.optional(v.string(), "x"), v.optional(v.number(), 1)]);
		expect(getDefaults(schema as AnySchema, {})).toEqual(["x", 1]);
	});

	it("returns default from optional wrapper", () => {
		const schema = v.optional(v.string(), "fallback");
		expect(getDefaults(schema as AnySchema, undefined)).toBe("fallback");
	});

	it("returns null for nullable schema with null default", () => {
		const schema = v.nullable(v.string(), null);
		expect(getDefaults(schema as AnySchema, undefined)).toBeNull();
	});

	it("returns null for nullable schema regardless of explicit default", () => {
		const schema = v.nullable(v.string(), "fallback");
		expect(getDefaults(schema as AnySchema, undefined)).toBeNull();
	});

	it("returns null for nullish schema regardless of explicit default", () => {
		const schema = v.nullish(v.string(), "fallback");
		expect(getDefaults(schema as AnySchema, undefined)).toBeNull();
	});

	it("returns default value for undefinedable schema with explicit default", () => {
		const schema = v.undefinedable(v.number(), 0);
		expect(getDefaults(schema as AnySchema, undefined)).toBe(0);
	});

	it("resolves lazy schema and returns inner defaults", () => {
		const schema = v.lazy(() => v.object({ x: v.optional(v.string(), "default") }));
		expect(getDefaults(schema as AnySchema, {})).toEqual({ x: "default" });
	});

	it("handles pipe by recursing on first item", () => {
		const inner = v.object({ x: v.optional(v.string(), "val") });
		const schema = v.pipe(inner, metadata({ type: "object" }));
		expect(getDefaults(schema as AnySchema, {})).toEqual({ x: "val" });
	});

	it("returns default from pipe with optional wrapper", () => {
		const schema = v.pipe(v.optional(v.string(), "pipe-default"), v.minLength(1));
		expect(getDefaults(schema as AnySchema, {})).toBe("pipe-default");
	});

	it("returns empty string for union schema without shared defaults", () => {
		const schema = v.union([v.string(), v.number()]);
		expect(getDefaults(schema as AnySchema, {})).toBe("");
	});

	it("returns empty string for unknown schema", () => {
		const schema = v.unknown();
		expect(getDefaults(schema as AnySchema, undefined)).toBe("");
	});

	it("returns empty string for valibot any schema", () => {
		const schema = v.any();
		expect(getDefaults(schema as AnySchema, undefined)).toBe("");
	});

	it("resolves lazy schema inside pipe", () => {
		const schema = v.pipe(
			v.lazy((input: unknown) => {
				const val = input as Record<string, unknown>;
				if (val.type === "a") return v.object({ key: v.optional(v.string(), "from-a") });
				return v.object({ key: v.optional(v.string(), "from-b") });
			}),
			metadata({ type: "object" }),
		);
		expect(getDefaults(schema as AnySchema, { type: "a" })).toEqual({ key: "from-a" });
		expect(getDefaults(schema as AnySchema, { type: "b" })).toEqual({ key: "from-b" });
	});

	describe("nested schemas", () => {
		it("returns defaults for 2-level nested object", () => {
			const schema = v.object({
				outer: v.object({ inner: v.optional(v.string(), "deep") }),
			});
			expect(getDefaults(schema as AnySchema, {})).toEqual({ outer: { inner: "deep" } });
		});

		it("returns defaults for 3-level nested object", () => {
			const schema = v.object({
				l1: v.object({
					l2: v.object({ value: v.optional(v.number(), 42) }),
				}),
			});
			expect(getDefaults(schema as AnySchema, {})).toEqual({ l1: { l2: { value: 42 } } });
		});

		it("returns defaults for array nested inside object (valibot returns undefined items)", () => {
			const schema = v.object({
				items: v.array(v.object({ label: v.optional(v.string(), "item") })),
			});
			expect(getDefaults(schema as AnySchema, {})).toEqual({ items: undefined });
		});

		it("returns defaults for tuple with nested object", () => {
			const schema = v.tuple([
				v.object({ x: v.optional(v.number(), 1) }),
				v.object({ y: v.optional(v.string(), "z") }),
			]);
			expect(getDefaults(schema as AnySchema, {})).toEqual([{ x: 1 }, { y: "z" }]);
		});

		it("returns null for nullable wrapping nested object", () => {
			const schema = v.nullable(v.object({ x: v.optional(v.string(), "val") }), { x: "fallback" });
			expect(getDefaults(schema as AnySchema, {})).toBeNull();
		});

		it("returns defaults for pipe wrapping nested object", () => {
			const schema = v.pipe(
				v.object({ nested: v.object({ key: v.optional(v.boolean(), true) }) }),
				metadata({ type: "object" }),
			);
			expect(getDefaults(schema as AnySchema, {})).toEqual({ nested: { key: true } });
		});

		it("returns defaults for optional wrapping object with nested array", () => {
			const schema = v.optional(
				v.object({
					tags: v.array(v.object({ name: v.optional(v.string(), "tag") })),
				}),
				{ tags: [] },
			);
			expect(getDefaults(schema as AnySchema, {})).toEqual({ tags: [] });
		});
	});
});
