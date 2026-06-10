import * as v from "valibot";
import { describe, expect, it, vi } from "vitest";
import { ClassMap, createClassHjsonSchema, mergeEntries } from "../src/class";
import { getSchemaMetadata } from "../src/utils";
import type { AnySchema } from "../src/utils";
import type { ProjectContents } from "@project/types";

const mockContext: ProjectContents = {
	items: [],
	blocks: [],
	liquids: [],
	sectors: [],
	statuses: [],
	units: [],
	sprites: [],
	effects: [],
	sounds: [],
	name: "test",
};

describe("ClassMap", () => {
	describe("get", () => {
		it("returns empty entries for null input", () => {
			const classMap = new ClassMap<string>({});
			expect(classMap.get(null, mockContext)).toEqual({});
		});

		it("returns empty entries for non-object input", () => {
			const classMap = new ClassMap<string>({});
			expect(classMap.get(undefined, mockContext)).toEqual({});
			expect(classMap.get(42, mockContext)).toEqual({});
			expect(classMap.get("string", mockContext)).toEqual({});
			expect(classMap.get([], mockContext)).toEqual({});
		});

		it("returns empty entries for object without type field", () => {
			const classMap = new ClassMap<string>({});
			expect(classMap.get({ name: "test" }, mockContext)).toEqual({});
		});

		it("returns entries for a class with no extends", () => {
			const classMap = new ClassMap<string>({
				Simple: () => v.object({ fieldA: v.string(), fieldB: v.number() }),
			});
			const result = classMap.get({ type: "simple" }, mockContext);
			expect(result).toHaveProperty("fieldA");
			expect(result).toHaveProperty("fieldB");
			expect(Object.keys(result)).toHaveLength(2);
		});

		it("resolves single-level extends chain", () => {
			const classMap = new ClassMap<string>({
				Child: () => v.object({ className: v.literal("Parent"), childField: v.string() }),
				Parent: () => v.object({ parentField: v.number() }),
			});
			const result = classMap.get({ type: "child" }, mockContext);
			expect(result).toHaveProperty("parentField");
			expect(result).toHaveProperty("childField");
		});

		it("resolves two-level extends chain", () => {
			const classMap = new ClassMap<string>({
				Grandchild: () =>
					v.object({ className: v.literal("Child"), grandchildField: v.string() }),
				Child: () =>
					v.object({ className: v.literal("Parent"), childField: v.string() }),
				Parent: () => v.object({ parentField: v.number() }),
			});
			const result = classMap.get({ type: "grandchild" }, mockContext);
			expect(result).toHaveProperty("parentField");
			expect(result).toHaveProperty("childField");
			expect(result).toHaveProperty("grandchildField");
		});

		it("resolves three-level extends chain (4 levels total)", () => {
			const classMap = new ClassMap<string>({
				Lv4: () => v.object({ className: v.literal("Lv3"), lv4Field: v.string() }),
				Lv3: () => v.object({ className: v.literal("Lv2"), lv3Field: v.string() }),
				Lv2: () => v.object({ className: v.literal("Lv1"), lv2Field: v.number() }),
				Lv1: () => v.object({ lv1Field: v.string() }),
			});
			const result = classMap.get({ type: "lv4" }, mockContext);
			expect(result).toHaveProperty("lv1Field");
			expect(result).toHaveProperty("lv2Field");
			expect(result).toHaveProperty("lv3Field");
			expect(result).toHaveProperty("lv4Field");
			expect(Object.keys(result)).toHaveLength(4);
		});

		it("child fields override parent fields with same name", () => {
			const classMap = new ClassMap<string>({
				Child: () =>
					v.object({ className: v.literal("Parent"), shared: v.string() }),
				Parent: () => v.object({ shared: v.number() }),
			});
			const result = classMap.get({ type: "child" }, mockContext);
			expect(result).toHaveProperty("shared");
		});

		it("capitalizes first letter of type to form the key", () => {
			const classMap = new ClassMap<string>({
				Test: () => v.object({ field: v.string() }),
			});
			expect(classMap.get({ type: "test" }, mockContext)).toHaveProperty("field");
			expect(classMap.get({ type: "Test" }, mockContext)).toHaveProperty("field");
		});

		it("detects circular references and logs error", () => {
			vi.spyOn(console, "error").mockImplementation(() => {});
			const classMap = new ClassMap<string>({
				A: () => v.object({ className: v.literal("B") }),
				B: () => v.object({ className: v.literal("A") }),
			});
			classMap.get({ type: "a" }, mockContext);
			expect(console.error).toHaveBeenCalled();
			vi.restoreAllMocks();
		});

		it("handles missing class and logs error", () => {
			vi.spyOn(console, "error").mockImplementation(() => {});
			const classMap = new ClassMap<string>({});
			classMap.get({ type: "nonexistent" }, mockContext);
			expect(console.error).toHaveBeenCalled();
			vi.restoreAllMocks();
		});

		it("passes context to schema providers", () => {
			const contextFn = vi.fn((_: ProjectContents) => v.object({ field: v.string() }));
			const classMap = new ClassMap<string>({ Test: contextFn });
			classMap.get({ type: "test" }, mockContext);
			expect(contextFn).toHaveBeenCalledWith(mockContext);
		});
	});

	describe("register", () => {
		it("does not have register method (removed)", () => {
			const classMap = new ClassMap<string>({});
			expect((classMap as Record<string, unknown>).register).toBeUndefined();
		});
	});

	describe("mergeEntries", () => {
		it("inherits base metadata when variant field lacks its own", () => {
			const base = {
				lifetime: v.pipe(v.optional(v.number(), 50), v.metadata({ name: "base.name", description: "base.desc" })),
			};
			const variant = {
				lifetime: v.pipe(v.optional(v.number(), 100), v.minValue(1)),
			};

			const result = mergeEntries(base, variant);
			expect(result).toHaveProperty("lifetime");
		});

		it("merges base and variant metadata (variant wins conflicts)", () => {
			const base = {
				field: v.pipe(v.string(), v.metadata({ name: "base.name", description: "base.desc" })),
			};
			const variant = {
				field: v.pipe(v.number(), v.metadata({ name: "variant.name" })),
			};

			const result = mergeEntries(base, variant);
			expect(result).toHaveProperty("field");
			const meta = getSchemaMetadata(result.field!);
			expect(meta).not.toBeNull();
			expect(meta!.name).toBe("variant.name");
			expect(meta!.description).toBe("base.desc");
		});

		it("adds variant-only fields as-is", () => {
			const base = { existing: v.string() };
			const variant = { existing: v.number(), newField: v.boolean() };

			const result = mergeEntries(base, variant);
			expect(result).toHaveProperty("existing");
			expect(result).toHaveProperty("newField");
		});

		it("skips variant entries with undefined value", () => {
			const base = { keepMe: v.string() };
			const variant = { keepMe: undefined } as unknown as Record<string, AnySchema>;

			const result = mergeEntries(base, variant);
			expect(result).toHaveProperty("keepMe");
		});
	});

	describe("createClassHjsonSchema", () => {
		it("produces a SchemaFn that merges base and variant entries", () => {
			const classMap = new ClassMap<string>({
				Test: () => v.object({ variantField: v.string() }),
			});
			const schemaFn = createClassHjsonSchema({
				classMap,
				baseSchema: { baseField: v.number() },
				type: "test-type",
			});

			const schema = schemaFn(mockContext) as { type: string; getter: (input: unknown) => { pipe: Array<{ entries: Record<string, unknown> }> } };
			expect(schema.type).toBe("lazy");

			const resolved = schema.getter({ type: "test" });
			const objectSchema = resolved.pipe[0]!;
			expect(objectSchema.entries).toHaveProperty("baseField");
			expect(objectSchema.entries).toHaveProperty("variantField");
		});

		it("accepts dynamic base schema via function", () => {
			const classMap = new ClassMap<string>({
				Test: () => v.object({ variantField: v.string() }),
			});
			const schemaFn = createClassHjsonSchema({
				classMap,
				baseSchema: () => ({ dynamicBase: v.number() }),
				type: "test",
			});

			const schema = schemaFn(mockContext) as { type: string; getter: (input: unknown) => { pipe: Array<{ entries: Record<string, unknown> }> } };
			const resolved = schema.getter({ type: "test" });
			const objectSchema = resolved.pipe[0]!;
			expect(objectSchema.entries).toHaveProperty("dynamicBase");
			expect(objectSchema.entries).toHaveProperty("variantField");
		});

		it("includes extra fields after variant merge", () => {
			const classMap = new ClassMap<string>({
				Test: () => v.object({ variantField: v.string() }),
			});
			const schemaFn = createClassHjsonSchema({
				classMap,
				baseSchema: { baseField: v.number() },
				type: "test",
				extra: () => ({ extraField: v.boolean() }),
			});

			const schema = schemaFn(mockContext) as { type: string; getter: (input: unknown) => { pipe: Array<{ entries: Record<string, unknown> }> } };
			const resolved = schema.getter({ type: "test" });
			const objectSchema = resolved.pipe[0]!;
			expect(objectSchema.entries).toHaveProperty("baseField");
			expect(objectSchema.entries).toHaveProperty("variantField");
			expect(objectSchema.entries).toHaveProperty("extraField");
		});
	});
});
