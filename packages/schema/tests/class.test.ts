import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { mergeEntries } from "../src/class";
import { getSchemaMetadata } from "../src/utils";
import type { AnySchema } from "../src/utils";

describe("ClassMap", () => {
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
});
