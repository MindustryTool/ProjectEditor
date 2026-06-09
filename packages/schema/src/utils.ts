import type { HjsonObjectNode } from "@project/hjson";
import * as v from "valibot";
import type { ProjectContents } from "@project/types";

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
	"texture",
	"textures",
	"item-requirement",
	"union",
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

function getSchemaType(schema: AnySchema, value: unknown): { type: Type; schema: AnySchema } {
	const s = schema as unknown as { type: string; pipe?: AnySchema[]; kind: string };

	if (s.pipe && s.pipe.length > 0) {
		for (let i = s.pipe.length - 1; i >= 0; i--) {
			const { type } = detectSchemaType(s.pipe[i] as AnySchema, value);
			if (type === "never") {
				continue;
			}

			return { type, schema: s.pipe[i] as AnySchema };
		}
		console.warn({ unknownTypeInPipe: s.type });
		return { type: "never", schema };
	}

	if (s.kind !== "schema") {
		return { type: "never", schema };
	}

	if (s.type === "string") return { type: "string", schema };
	if (s.type === "number") return { type: "number", schema };
	if (s.type === "boolean") return { type: "boolean", schema };
	if (s.type === "object") return { type: "object", schema };
	if (s.type === "array") return { type: "array", schema };
	if (s.type === "picklist") return { type: "picklist", schema };
	if (s.type === "never") return { type: "never", schema };
	if (s.type === "union") return { type: "union", schema };

	if (s.kind === "schema") {
		console.warn({ unknownType: s.type });
	}

	return { type: "never", schema };
}

export function detectSchemaType(rawSchema: AnySchema, value: unknown): { type: Type; schema: AnySchema } {
	const unwrapped = unwrapSchema(rawSchema) as unknown as {
		kind: string;
		type: string;
		pipe?: AnySchema[] | Array<{ type: string }>;
		getter?: (val: unknown) => AnySchema;
		wrapped?: AnySchema;
	} & AnySchema;

	let metadataType = getTypeFromMetadata(unwrapped);

	if (metadataType) {
		return { type: metadataType, schema: unwrapped };
	}

	if (unwrapped.type === "lazy" && unwrapped.getter) {
		return detectSchemaType(unwrapped.getter(value), value);
	}

	metadataType = getTypeFromMetadata(unwrapped);

	if (metadataType) {
		return { type: metadataType, schema: unwrapped };
	}

	return getSchemaType(unwrapped, value);
}

export function getDefaults(schema: AnySchema, value: unknown): unknown {
	const s = schema as unknown as { type: string; getter?: (val: unknown) => AnySchema };

	if (s.type === "lazy" && s.getter) {
		return getDefaults(s.getter(value), value);
	}

	return v.getDefaults(schema);
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

	if (Array.isArray(s.pipe)) {
		for (let i = s.pipe.length - 1; i >= 0; i--) {
			const inner = s.pipe[i] as AnySchema | v.MetadataAction<unknown, Record<string, unknown>>;

			if (inner.kind === "metadata") {
				continue;
			}

			if (inner.type === "object" || inner.type === "array" || inner.type === "union") {
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

export function getSchemaEntries(schema: AnySchema): [string, AnySchema][] {
	schema = unwrapSchema(schema);
	const s = schema as unknown as { type: string; entries?: Record<string, AnySchema>; pipe?: AnySchema[] };

	if (s.type === "object" && s.entries) {
		const raw = Object.entries(s.entries) as [string, AnySchema][];
		const catMap = new Map<string, [string, AnySchema][]>();
		const seen = new Set<string>();
		const result: [string, AnySchema][] = [];

		for (const [key, value] of raw) {
			const cat = getSchemaMetadata(value)?.category;
			if (cat) {
				let group = catMap.get(cat);
				if (!group) {
					group = [];
					catMap.set(cat, group);
				}
				group.push([key, value]);
			}
		}

		for (const [key, value] of raw) {
			const cat = getSchemaMetadata(value)?.category;
			if (cat) {
				if (!seen.has(cat)) {
					seen.add(cat);
					result.push(...catMap.get(cat)!);
				}
			} else {
				result.push([key, value]);
			}
		}

		return result;
	}

	if (Array.isArray(s.pipe) && s.pipe.length > 0) {
		return getSchemaEntries(s.pipe[0] as AnySchema);
	}

	return [];
}

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
	category?: string;
	multiline?: boolean;
	visibleWhen?: {
		field: string;
		value: unknown;
	};
	disabled?: boolean;
};

export function metadata<T>(meta: SchemaMetadata): v.MetadataAction<T, SchemaMetadata> {
	return v.metadata(meta);
}

export function getSchemaMetadata(schema: AnySchema): SchemaMetadata | null {
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

		if (obj.type === "array" || obj.type === "object" || obj.type === "union") {
			return;
		}

		for (const child of Object.values(obj)) {
			if (Array.isArray(child)) {
				for (const item of child) walk(item);
			} else {
				walk(child);
			}
		}
	}

	walk(schema);
	walk(unwrapSchema(schema));

	return Object.keys(result).length ? result : null;
}

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
