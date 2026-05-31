import type * as v from "valibot";

type AnySchema =
	| v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
	| v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>
	| v.TupleSchema<v.TupleItems, v.ErrorMessage<v.TupleIssue> | undefined>;

export function findUnknownProperties(schema: AnySchema, value: unknown, path = ""): string[] {
	const unknown: string[] = [];

	// Object schema
	if ("entries" in schema) {
		if (typeof value !== "object" || value === null || Array.isArray(value)) {
			return unknown;
		}

		const entries = schema.entries;
		const obj = value as Record<string, unknown>;

		// Check extra keys
		for (const key of Object.keys(obj)) {
			if (!(key in entries)) {
				unknown.push(path ? `${path}.${key}` : key);
			}
		}

		// Recurse known keys
		for (const key in entries) {
			if (key in obj) {
				unknown.push(...findUnknownProperties(entries[key] as AnySchema, obj[key], path ? `${path}.${key}` : key));
			}
		}

		return unknown;
	}

	// Array schema
	if ("item" in schema) {
		if (!Array.isArray(value)) {
			return unknown;
		}

		for (let i = 0; i < value.length; i++) {
			unknown.push(...findUnknownProperties(schema.item as AnySchema, value[i], `${path}[${i}]`));
		}

		return unknown;
	}

	// Tuple schema
	if ("items" in schema) {
		if (!Array.isArray(value)) {
			return unknown;
		}

		for (let i = 0; i < schema.items.length; i++) {
			unknown.push(...findUnknownProperties(schema.items[i] as AnySchema, value[i], `${path}[${i}]`));
		}

		// Extra tuple items
		for (let i = schema.items.length; i < value.length; i++) {
			unknown.push(`${path}[${i}]`);
		}

		return unknown;
	}

	return unknown;
}
