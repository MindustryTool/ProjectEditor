import type { HjsonObjectNode } from "@project/hjson";
import * as v from "valibot";
import type { ProjectContents } from "@project/types";

export type AnySchema =
	| v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
	| v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>
	| v.TupleSchema<v.TupleItems, v.ErrorMessage<v.TupleIssue> | undefined>
	| v.PicklistSchema<v.PicklistOptions, v.ErrorMessage<v.PicklistIssue> | undefined>
	| v.ArraySchema<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, v.ErrorMessage<v.ArrayIssue> | undefined>
	| v.LazySchema<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>
	| v.OptionalSchema<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, unknown>
	| v.UndefinedableSchema<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, unknown>
	| v.ExactOptionalSchema<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, unknown>
	| v.NullableSchema<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, unknown>
	| v.NullishSchema<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, unknown>
	| v.StringSchema<v.ErrorMessage<v.StringIssue> | undefined>
	| v.NumberSchema<v.ErrorMessage<v.NumberIssue> | undefined>
	| v.BooleanSchema<v.ErrorMessage<v.BooleanIssue> | undefined>
	| v.SchemaWithPipe<
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			readonly [v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, ...v.PipeItem<any, unknown, v.BaseIssue<unknown>>[]]
	  >
	| v.AnySchema;

const WRAPPER_TYPES = new Set(["optional", "nullable", "optional", "nullish", "undefinedable", "exact_optional"]);

export const types = [
	"env",
	"color",
	"content",
	"string",
	"number",
	"boolean",
	"object",
	"array",
	"unknown",
	"picklist",
	"liquids",
	"select",
	"texture",
	"textures",
	"item-stack",
	"liquid-stack",
	"options",
	"sound",
	"never",
] as const;

export type Type = (typeof types)[number];

/**
 * Recursively unwraps wrapper schemas (optional, nullable, nullish, undefinedable, exact_optional)
 * to get to the actual inner schema. Continues unwrapping if the inner schema is also a wrapper.
 * Returns the innermost non-wrapper schema.
 */
export function unwrapSchema(schema: AnySchema): AnySchema {
	if (WRAPPER_TYPES.has((schema as unknown as { type: string }).type) && "wrapped" in schema) {
		return unwrapSchema((schema as unknown as { wrapped: AnySchema }).wrapped);
	}
	return schema;
}

/**
 * Checks if a schema has a nullable or nullish wrapper at the top level (does not recurse).
 * Returns true if the schema's type is "nullable" or "nullish".
 */
export function hasNullableWrapper(schema: AnySchema): boolean {
	const s = schema as unknown as { type: string };
	return ["nullable", "nullish"].includes(s.type);
}

/**
 * Extracts the custom type string from a schema's metadata (set via `metadata()`).
 * Returns null if no metadata type is found or if the type is not in the known `types` list.
 * Logs a warning if the type is unknown.
 */
function getTypeFromMetadata(schema: AnySchema): Type | null {
	const meta = getSchemaMetadata(schema);

	if (!meta?.type) {
		return null;
	}

	const t = meta.type;

	if ((types as readonly string[]).includes(t)) {
		return t as Type;
	}
	console.warn(`Unknown type: ${t}`);

	return null;
}

/**
 * Determines the Type from a schema's native valibot type (e.g. "string", "number", "object").
 * First checks the pipe array in reverse order (skipping "never" types) for a detectable type.
 * If no pipe, maps the schema's native `type` field directly to a known Type.
 * Returns { type: "never", schema } for unrecognized or non-schema kinds.
 */
function getSchemaType(schema: AnySchema, value: unknown): { type: Type; schema: AnySchema } {
	const s = schema as unknown as { type: string; pipe?: AnySchema[]; kind: string };

	if (s.pipe && s.pipe.length > 0) {
		for (let i = s.pipe.length - 1; i >= 0; i--) {
			const result = detectSchemaType(s.pipe[i] as AnySchema, value);
			if (result.type === "never") {
				continue;
			}

			return { type: result.type, schema: s.pipe[i] as AnySchema };
		}
		console.warn({ unknownTypeInPipe: s.type });
		return { type: "never", schema };
	}

	if (s.kind !== "schema") {
		return { type: "never", schema };
	}

	if (types.includes(s.type as Type)) {
		return { type: s.type as Type, schema };
	}

	return { type: "never", schema };
}

/**
 * Detects the custom Type for a schema. First unwraps any wrapper schemas, then:
 * 1. Checks for metadata type from the unwrapped schema.
 * 2. If the schema is a lazy schema, recursively detects the type from its getter result.
 * 3. Falls back to the native valibot type via getSchemaType.
 * Returns the detected type and the relevant schema (unwrapped or resolved).
 */
export function detectSchemaType(rawSchema: AnySchema, value: unknown): { type: Type; schema: AnySchema } {
	const unwrapped = unwrapSchema(rawSchema) as unknown as {
		kind: string;
		type: string;
		pipe?: AnySchema[] | Array<{ type: string }>;
		getter?: (val: unknown) => AnySchema;
		wrapped?: AnySchema;
	} & AnySchema;

	const metadataType = getTypeFromMetadata(unwrapped);

	if (metadataType) {
		return { type: metadataType, schema: unwrapped };
	}

	if (unwrapped.type === "lazy" && unwrapped.getter) {
		return detectSchemaType(unwrapped.getter(value), value);
	}

	if (metadataType) {
		return { type: metadataType, schema: unwrapped };
	}

	return getSchemaType(unwrapped, value);
}

/**
 * Gets default values for a schema. Resolves lazy schemas by calling the getter with the provided value.
 * Uses valibot's getDefaults internally. If no default is found (undefined), unwraps the schema and
 * returns a sensible fallback: {} for objects, [] for arrays, or "" for other types.
 */
export function getDefaults(schema: AnySchema, value: unknown, recursive?: boolean): unknown {
	if ("pipe" in schema) {
		const pipe = schema.pipe[0];
		return getDefaults(pipe, value);
	}

	if (v.isOfType("lazy", schema) && schema.getter) {
		return getDefaults(schema.getter(value), value);
	}

	const result = v.getDefaults(schema);

	if (hasNullableWrapper(schema)) {
		return null;
	}

	if (result === undefined) {
		schema = unwrapSchema(schema);

		if ("pipe" in schema) {
			const pipe = schema.pipe[0];
			return getDefaults(pipe, value);
		}

		if (v.isOfType("lazy", schema) && schema.getter) {
			return getDefaults(schema.getter(value), value);
		}

		if (v.isOfType("object", schema)) {
			return recursive ? v.getDefaults(schema) : {};
		}

		if (v.isOfType("array", schema)) {
			return recursive ? v.getDefaults(schema) : [];
		}

		return "";
	}

	return result;
}

/**
 * Resolves a schema to its most concrete form by:
 * 1. Unwrapping wrapper types (optional, nullable, etc.).
 * 2. Resolving lazy schemas via their getter.
 * 3. Searching the pipe array (in reverse) for the first non-metadata, non-"never" schema with a detectable type,
 *    then recursively resolving it. Falls back to a simple object/array pipe item if found.
 * Returns the most specific inner schema.
 */
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

	if (Array.isArray(s.pipe)) {
		for (let i = s.pipe.length - 1; i >= 0; i--) {
			const inner = s.pipe[i] as AnySchema | v.MetadataAction<unknown, Record<string, unknown>>;

			if (inner.kind === "metadata") {
				continue;
			}

			if (inner.type === "object" || inner.type === "array") {
				return inner;
			}

			const { type } = detectSchemaType(inner, value);
			if (type === "never") {
				continue;
			}

			return resolveSchema(inner, value);
		}
	}

	return schema;
}

/**
 * Retrieves the entries of an object schema.
 * If the schema is not an object, recursively checks the first pipe item for entries.
 * Returns an empty array if no entries can be found.
 */
export function getSchemaEntries(schema: AnySchema): [string, AnySchema][] {
	schema = unwrapSchema(schema);
	const s = schema as unknown as { type: string; entries?: Record<string, AnySchema>; pipe?: AnySchema[] };

	if (s.type === "object" && s.entries) {
		return (Object.entries(s.entries) as [string, AnySchema][]).sort(([, a], [, b]) => {
			const aOrder = getSchemaMetadata(a)?.order || 0;
			const bOrder = getSchemaMetadata(b)?.order || 0;

			return aOrder - bOrder;
		});
	}

	if (Array.isArray(s.pipe) && s.pipe.length > 0) {
		return getSchemaEntries(s.pipe[0] as AnySchema);
	}

	return [];
}

/**
 * Gets the item schema for an array schema. If the array schema has a getter function,
 * calls it with the given index to return a dynamic item schema. Otherwise, uses the
 * static `item` property. Throws if neither getter nor item is available.
 */
export function getArrayItemSchema(schema: AnySchema, index = 0): AnySchema {
	const s = unwrapSchema(schema) as unknown as { type: string; item?: AnySchema; getter?: (index: number) => AnySchema };

	if (s.type === "array") {
		if (s.getter) {
			return s.getter(index);
		}
		if (s.item) {
			return s.item as AnySchema;
		}
	}

	throw new Error("Array schema must have item or getter");
}

export type SchemaMetadata = {
	type?: string;
	name?: string;
	description?: string;
	multiline?: boolean;
	visibleWhen?: {
		field: string;
		value: unknown;
	};
	disabled?: boolean;
	options?: AnySchema[];
	option?: string;
	order?: number;
};

/**
 * Wraps valibot's metadata action with the SchemaMetadata type bound to the action.
 * Allows attaching custom metadata (type name, description, visibility, etc.)
 * to any schema for later retrieval via getSchemaMetadata.
 */
export function metadata<T>(meta: SchemaMetadata): v.MetadataAction<T, SchemaMetadata> {
	return v.metadata(meta);
}

/**
 * Deeply walks a schema (and its unwrapped form) to collect all metadata actions into a single
 * SchemaMetadata object. Visits nested pipes and child schemas to merge metadata.
 * Uses a WeakSet to avoid cycles. When `pipe` is true (default), also traverses pipe arrays.
 * Returns null if no metadata is found.
 */
export function getSchemaMetadata(schema: AnySchema, pipe: boolean = true): SchemaMetadata | null {
	const result: SchemaMetadata = {};
	const visited = new WeakSet<object>();

	function walk(value: unknown) {
		if (!value || typeof value !== "object") {
			return;
		}

		if (visited.has(value as object)) {
			return;
		}

		visited.add(value as object);

		const obj = value as Record<string, unknown>;

		if (obj.type === "metadata" && obj.metadata) {
			Object.assign(result, obj.metadata);
		}

		if (obj.metadata && typeof obj.metadata === "object" && "type" in obj.metadata && obj.metadata?.type) {
			return;
		}

		if (obj.pipe && Array.isArray(obj.pipe) && pipe) {
			for (const item of obj.pipe) {
				walk(item);
			}
		}

		if (obj.type === "array" || obj.type === "object") {
			return;
		}

		for (const child of Object.values(obj)) {
			if (Array.isArray(child)) {
				for (const item of child) {
					walk(item);
				}
			} else {
				walk(child);
			}
		}
	}

	walk(schema);
	walk(unwrapSchema(schema));

	return Object.keys(result).length ? result : null;
}

/**
 * Creates a fixed-value schema for a given key in an object schema map.
 * Wraps the schema with valibot's `value` pipe action (if fixedValue is provided) to enforce a constant value,
 * and marks the schema as disabled via metadata so it cannot be edited.
 * The resulting schema is wrapped in optional so it validates even when absent.
 */
export function fixed<K extends string, T extends Record<K, AnySchema>>(from: T, key: K, fixedValue?: v.InferOutput<T[K]>): AnySchema {
	const schema = from[key];

	if (fixedValue) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return v.optional(v.pipe(schema, v.value(fixedValue as any) as any, metadata({ disabled: true })), fixedValue);
	}

	return v.optional(v.pipe(schema, metadata({ disabled: true })), fixedValue);
}

export type SchemaFn<
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>> = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
> = (context: ProjectContents) => T;

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

/**
 * Traverses an HJSON object tree guided by valibot schemas to collect all sprite data entries.
 * For each object node that has name (string), x (number), y (number) properties and a matching
 * file (via findFileWithName), it records the sprite's name, file path, mirror flag, and position paths.
 * Recursively visits nested objects and arrays, building dot-separated paths.
 * Returns an array of all collected SpriteData objects.
 */
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
			if ((currentSchema as unknown as { type: string }).type !== "array") return;
			for (let i = 0; i < value.length; i++) {
				visit(value[i], getArrayItemSchema(currentSchema, i), `${currentPath}[${i}]`);
			}
		}
	}

	visit(node.valueOf(), schema, "");

	return result;
}

/**
 * Memoizes a function based on the last arguments. Only caches the most recent call.
 * If called again with the exact same arguments (same length and strict equality per element),
 * returns the previous result without executing the function.
 * Useful for expensive one-shot computations where inputs rarely change.
 */
export function cached<TArgs extends readonly unknown[], TResult>(fn: (...args: TArgs) => TResult): (...args: TArgs) => TResult {
	let lastArgs: TArgs | null = null;
	let lastResult: TResult;

	return (...args: TArgs): TResult => {
		if (lastArgs && lastArgs.length === args.length && args.every((arg, i) => arg === lastArgs![i])) {
			return lastResult;
		}

		lastResult = fn(...args);
		lastArgs = args;

		return lastResult;
	};
}

export const CachedSchema = cached;

/**
 * Searches for a named entry across all content categories in a ProjectContents context.
 * Strips the project name prefix from the search key and the compared entries.
 * Checks items, blocks, liquids, sectors, statuses, and units in order.
 * Returns the first matching entry or null if not found.
 */
export function findContent(name: string, context: ProjectContents) {
	name = name.replace(context.name + "-", "");

	const find = (name: string, items: readonly { name: string }[]) => {
		return items.find((entry) => entry.name.replaceAll(context.name + "-", "") === name);
	};

	const item = find(name, context.items);

	if (item) {
		return item;
	}

	const block = find(name, context.blocks);
	if (block) {
		return block;
	}

	const liquid = find(name, context.liquids);
	if (liquid) {
		return liquid;
	}

	const sector = find(name, context.sectors);
	if (sector) {
		return sector;
	}

	const status = find(name, context.statuses);
	if (status) {
		return status;
	}

	const unit = find(name, context.units);
	if (unit) {
		return unit;
	}

	return null;
}
