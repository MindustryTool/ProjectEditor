import type { HjsonObjectNode } from "@project/hjson";
import * as v from "valibot";

export type AnySchema =
	| v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
	| v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>
	| v.TupleSchema<v.TupleItems, v.ErrorMessage<v.TupleIssue> | undefined>;

const WRAPPER_TYPES = new Set(["optional", "nullable", "optional", "undefinedable", "exact_optional"]);

export const types = [
	"color",
	"research",
	"effect",
	"string",
	"number",
	"boolean",
	"object",
	"array",
	"unknown",
	"picklist",
	"liquids",
	"select",
	"sprite",
	"never",
] as const;

export type Type = (typeof types)[number];

export function unwrapSchema(schema: AnySchema): AnySchema {
	if (WRAPPER_TYPES.has((schema as unknown as { type: string }).type) && "wrapped" in schema) {
		return unwrapSchema((schema as unknown as { wrapped: AnySchema }).wrapped);
	}
	return schema;
}

export function hasNullableWrapper(schema: AnySchema): boolean {
	const s = schema as unknown as { type: string };
	return ["nullable", "nullish"].includes(s.type);
}

export function hasNullishWrapper(schema: AnySchema): boolean {
	const s = schema as unknown as { type: string };
	return WRAPPER_TYPES.has(s.type);
}

function getTypeFromMetadata(schema: AnySchema): Type | null {
	const unwrapped = unwrapSchema(schema);
	const s = unwrapped as unknown as { type: string; pipe?: Array<{ type: string; metadata: Record<string, unknown> }> };

	if (!s.pipe) return null;

	let result: Type | null = null;

	for (const action of s.pipe) {
		if (action.type === "metadata" && action.metadata && typeof action.metadata.type === "string") {
			const t = action.metadata.type;
			if ((types as readonly string[]).includes(t)) {
				result = t as Type;
			} else {
				console.warn(`Unkown type: ${t}`);
			}
		}
	}

	return result;
}

function getSchemaType(schema: AnySchema, value: unknown): Type {
	const s = schema as unknown as { type: string; pipe?: AnySchema[] };

	if (s.pipe && s.pipe.length > 0) {
		const first: AnySchema = s.pipe[0]!;
		return detectSchemaType(first, value);
	}

	if (s.type === "string") return "string";
	if (s.type === "number") return "number";
	if (s.type === "boolean") return "boolean";
	if (s.type === "object") return "object";
	if (s.type === "array") return "array";
	if (s.type === "picklist") return "picklist";
	if (s.type === "never") return "never";

	console.warn({ unknownType: s.type });

	return s.type as Type;
}

export function detectSchemaType(rawSchema: AnySchema, value: unknown): Type {
	const unwrapped = unwrapSchema(rawSchema) as unknown as {
		type: string;
		pipe?: AnySchema[] | Array<{ type: string }>;
		getter?: (val: unknown) => AnySchema;
		wrapped?: AnySchema;
	} & AnySchema;

	let metadataType = getTypeFromMetadata(unwrapped);

	if (metadataType) {
		return metadataType;
	}

	if (unwrapped.type === "lazy" && unwrapped.getter) {
		return detectSchemaType(unwrapped.getter(value), value);
	}

	metadataType = getTypeFromMetadata(unwrapped);

	if (metadataType) {
		return metadataType;
	}

	return getSchemaType(unwrapped, value);
}

export function resolveSchema(schema: AnySchema, value: unknown): AnySchema {
	const s = schema as unknown as {
		type: string;
		pipe?: AnySchema[] | Array<{ type: string }>;
		getter?: (val: unknown) => AnySchema;
		wrapped?: AnySchema;
	};

	if (WRAPPER_TYPES.has(s.type) && s.wrapped) {
		return resolveSchema(s.wrapped, value);
	}

	if (s.type === "lazy" && s.getter) {
		return resolveSchema(s.getter(value), value);
	}

	if (Array.isArray(s.pipe) && s.pipe.length > 0) {
		return resolveSchema(s.pipe[0] as AnySchema, value);
	}

	return schema;
}

export function getSchemaEntries(schema: AnySchema): [string, AnySchema][] {
	schema = unwrapSchema(schema);
	const s = schema as unknown as { type: string; entries?: Record<string, AnySchema>; pipe?: AnySchema[] };

	if (s.type === "object" && s.entries) {
		return Object.entries(s.entries) as [string, AnySchema][];
	}

	if (Array.isArray(s.pipe) && s.pipe.length > 0) {
		return getSchemaEntries(s.pipe[0] as AnySchema);
	}

	return [];
}

export function getArrayItemSchema(schema: AnySchema, index = 0): AnySchema | null {
	const s = unwrapSchema(schema) as unknown as { type: string; item?: AnySchema; getter?: (index: number) => AnySchema };

	if (s.type === "array") {
		if (s.getter) {
			return s.getter(index);
		}
		if (s.item) {
			return s.item as AnySchema;
		}
	}

	return null;
}

export type SchemaMetadata = {
	type?: string;
	name?: string;
	description?: string;
	category?: string;
	multiline?: boolean;
	visibleWhen?: {
		field: string;
		value: unknown;
	};
};

export function metadata<T>(meta: SchemaMetadata): v.MetadataAction<T, SchemaMetadata> {
	return v.metadata(meta);
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

export type SpriteData = {
	name: string;
	path: string;
	mirror: boolean;
	position: {
		x: {
			value: number;
			path: string;
		};
		y: {
			value: number;
			path: string;
		};
	};
};

export function collectSpriteData(
	findFileWithName: (filename: string) => string | undefined,
	node: HjsonObjectNode,
	schema: AnySchema,
): SpriteData[] {
	const result: SpriteData[] = [];

	function visit(value: unknown, currentSchema: AnySchema, currentPath: string) {
		currentSchema = resolveSchema(currentSchema, value);

		if (value && typeof value === "object" && !Array.isArray(value)) {
			const entries = getSchemaEntries(currentSchema);

			const obj = value as Record<string, unknown>;

			const hasName = typeof obj.name === "string";
			const hasX = typeof obj.x === "number";
			const hasY = typeof obj.y === "number";
			const filename = obj.name + ".png";
			const mirror = obj.mirror === true;

			const filePath = findFileWithName(filename);

			if (hasName && hasX && hasY && filePath) {
				result.push({
					name: obj.name as string,
					path: filePath,
					mirror,
					position: {
						x: {
							value: obj.x as number,
							path: currentPath ? `${currentPath}.x` : "x",
						},
						y: {
							value: obj.y as number,
							path: currentPath ? `${currentPath}.y` : "y",
						},
					},
				});
			}

			for (const [key, childSchema] of entries) {
				if (!(key in obj)) continue;

				visit(obj[key], childSchema, currentPath ? `${currentPath}.${key}` : key);
			}

			return;
		}

		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				const itemSchema = getArrayItemSchema(currentSchema, i);
				if (!itemSchema) continue;

				visit(value[i], itemSchema, `${currentPath}[${i}]`);
			}
		}
	}

	visit(node.valueOf(), schema, "");

	return result;
}
