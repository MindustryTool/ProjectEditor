import { detectSchemaType } from "@project/schema";
import React, { useMemo } from "react";
import type { HjsonNode } from "@project/hjson";
import type { AnySchema, Type } from "@project/schema";
import type { SchemaRenderer } from "#/components/editor/right/field/types";

export interface SchemaArrayItemEditorProps {
	path: string;
	value: unknown;
	itemSchema: AnySchema;
	onChange: (jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => void;
	jsonPath: string;
	getRenderer: (type: Type) => SchemaRenderer | undefined;
}

export const SchemaArrayItemEditor = React.memo(function SchemaArrayItemEditor({
	path,
	value,
	itemSchema,
	onChange,
	jsonPath,
	getRenderer,
}: SchemaArrayItemEditorProps) {
	const type = useMemo(() => detectSchemaType(itemSchema, value), [itemSchema, value]);

	const Renderer = getRenderer(type);

	if (Renderer === undefined) {
		return <span className="text-red-400 text-sm">Unknown field type {jsonPath}</span>;
	}

	return (
		<Renderer
			key={jsonPath}
			path={path}
			name={jsonPath}
			value={value}
			onChange={onChange}
			entrySchema={itemSchema}
			jsonPath={jsonPath}
			getRenderer={getRenderer}
		/>
	);
});
