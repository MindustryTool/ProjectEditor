import type * as v from "valibot";
import { EffectSchema, MindustryHexColorSchema } from "./base";
import { ResearchSchema } from "./base";

export type AnySchema =
	| v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
	| v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>
	| v.TupleSchema<v.TupleItems, v.ErrorMessage<v.TupleIssue> | undefined>;

const WRAPPER_TYPES = new Set(["optional", "nullable", "nullish", "undefinedable", "exact_optional"]);

export function unwrapSchema(schema: AnySchema): AnySchema {
	if (WRAPPER_TYPES.has((schema as unknown as { type: string }).type) && "wrapped" in schema) {
		return unwrapSchema((schema as unknown as { wrapped: AnySchema }).wrapped);
	}
	return schema;
}

export function hasNullishWrapper(schema: AnySchema): boolean {
	const s = schema as unknown as { type: string };
	return WRAPPER_TYPES.has(s.type);
}

const specialSchemaRegistry = new Map<AnySchema, string>();
specialSchemaRegistry.set(MindustryHexColorSchema as unknown as AnySchema, "color");
specialSchemaRegistry.set(ResearchSchema as unknown as AnySchema, "research");
specialSchemaRegistry.set(EffectSchema as unknown as AnySchema, "effect");

function getSchemaType(schema: AnySchema): string {
	const s = schema as unknown as { type: string; pipe?: AnySchema[] };

	if (s.pipe && s.pipe.length > 0) {
		const first: AnySchema = s.pipe[0]!;
		return detectSchemaType(first);
	}

	if (s.type === "string") return "string";
	if (s.type === "number") return "number";
	if (s.type === "boolean") return "boolean";
	if (s.type === "object") return "object";
	if (s.type === "array") return "array";
	return "unknown";
}

export function detectSchemaType(rawSchema: AnySchema): string {
	const specialBefore = specialSchemaRegistry.get(rawSchema);
	if (specialBefore) return specialBefore;

	const unwrapped = unwrapSchema(rawSchema);

	const specialAfter = specialSchemaRegistry.get(unwrapped);
	if (specialAfter) return specialAfter;

	return getSchemaType(unwrapped);
}

export function getSchemaEntries(schema: AnySchema): [string, AnySchema][] {
	const s = schema as unknown as { type: string; entries?: Record<string, AnySchema> };
	if (s.type === "object" && s.entries) {
		return Object.entries(s.entries) as [string, AnySchema][];
	}
	return [];
}

export function getArrayItemSchema(schema: AnySchema): AnySchema | null {
	const s = schema as unknown as { type: string; item?: AnySchema };
	if (s.type === "array" && s.item) {
		return s.item as AnySchema;
	}
	return null;
}

export interface SchemaMetadata {
	visibleWhen?: {
		field: string;
		value: unknown;
	};
}

export function getSchemaMetadata(schema: AnySchema): SchemaMetadata | null {
	const unwrapped = unwrapSchema(schema);
	const s = unwrapped as unknown as { type: string; pipe?: Array<{ type: string; metadata: SchemaMetadata }> };

	if (!s.pipe) return null;

	let result: SchemaMetadata | null = null;
	for (const action of s.pipe) {
		if (action.type === "metadata" && action.metadata) {
			result = action.metadata;
		}
	}

	return result;
}
