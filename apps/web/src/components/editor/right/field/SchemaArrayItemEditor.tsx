import { Input } from "#/components/ui/input";
import { detectSchemaType } from "@project/schema";
import { HJSON } from "@project/hjson";
import React from "react";
import * as v from "valibot";
import { schemaRenderers } from "./index";
import type { HjsonNode } from "@project/hjson";
import type { AnySchema } from "@project/schema";

export interface SchemaArrayItemEditorProps {
	path: string;
	value: unknown;
	itemSchema: AnySchema;
	onChange: (jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => void;
	jsonPath: string;
}

export const SchemaArrayItemEditor = React.memo(function SchemaArrayItemEditor({
	path,
	value,
	itemSchema,
	onChange,
	jsonPath,
}: SchemaArrayItemEditorProps) {
	const type = detectSchemaType(itemSchema, value);

	if (type === "string") {
		const stringValue = typeof value === "string" ? value : v.getDefault(itemSchema);
		return (
			<Input
				value={stringValue}
				onChange={(e) =>
					onChange(jsonPath, (parent, key, original) => {
						if (!parent.isArray()) throw new Error(`expected array at ${jsonPath}`);
						return parent.patchElement(original, Number(key), HJSON.stringify(e.currentTarget.value));
					})
				}
				placeholder="mod-name"
				className="flex-1"
			/>
		);
	}

	const Renderer = schemaRenderers[type];
	const name = String(type);

	if (Renderer === undefined) {
		return <span className="text-red-400 text-sm">Unknown field type {name}</span>;
	}

	return <Renderer key={name} path={path} name={name} value={value} onChange={onChange} entrySchema={itemSchema} jsonPath={jsonPath} />;
});
