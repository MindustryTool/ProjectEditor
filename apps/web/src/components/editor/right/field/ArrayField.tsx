import { Button } from "#/components/ui/button";
import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { detectSchemaType, getArrayItemSchema, getDefaults, getSchemaMetadata, unwrapSchema, type AnySchema } from "@project/schema";

import { Plus, Trash2 } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { EMPTY_ARRAY } from "#/lib/utils";

export const ArrayField = React.memo(function ArrayField({
	path,
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	getRenderer,
	defaultValue,
}: SchemaRendererProps) {
	const arrayValue: unknown[] = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : EMPTY_ARRAY;
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	const handleAdd = useCallback(() => {
		if (!arrayValue) {
			return;
		}

		const nextItemSchema = getArrayItemSchema(entrySchema, arrayValue.length);

		let defaultValue: unknown = getDefaults(nextItemSchema, arrayValue?.[arrayValue.length]);

		if (defaultValue === undefined) {
			const typeDefault = unwrapSchema(nextItemSchema);
			if (typeDefault.type === "object") {
				defaultValue = {};
			} else if (typeDefault.type === "array") {
				defaultValue = [];
			} else {
				defaultValue = typeDefault.type;
			}
		}

		onChange(jsonPath, (parent, original, key) => {
			if (parent.get(key).isMissing()) {
				return parent.patchValue(original, key, [defaultValue]);
			}

			return parent.get(key).arrayNode().insertElement(original, arrayValue.length, defaultValue);
		});
	}, [arrayValue, entrySchema, onChange, jsonPath]);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<SchemaDescription metadata={metadata} />
			<FieldControl>
				<div className="flex flex-col gap-2 border p-2 rounded-md border-dashed">
					{arrayValue.map((el, index) => (
						<ArrayElement
							name={name}
							key={index}
							index={index}
							value={el}
							itemSchema={getArrayItemSchema(entrySchema, index)}
							onChange={onChange}
							jsonPath={jsonPath}
							path={path}
							getRenderer={getRenderer}
						/>
					))}
					<Button type="button" size="sm" onClick={handleAdd}>
						<Plus /> Add
					</Button>
				</div>
			</FieldControl>
		</Field>
	);
});

function ArrayElement({
	index,
	value,
	itemSchema,
	onChange,
	jsonPath,
	path,
	getRenderer,
}: {
	name: string;
	path: string;
	index: number;
	value: unknown;
	itemSchema: AnySchema;
	onChange: Parameters<typeof ArrayField>[0]["onChange"];
	jsonPath: string;
	getRenderer: Parameters<typeof ArrayField>[0]["getRenderer"];
}) {
	const entryJsonPath = jsonPath ? `${jsonPath}[${index}]` : `[${index}]`;

	const handleRemove = useCallback(
		() => onChange(jsonPath, (parent, original, key) => parent.get(key).patchRemove(original, index)),
		[onChange, jsonPath, index],
	);

	const { type, schema } = useMemo(() => detectSchemaType(itemSchema, value), [itemSchema, value]);
	const defaultValue = getDefaults(schema, value);

	const Renderer = getRenderer(type);

	if (Renderer === undefined) {
		return <span className="text-red-400 text-sm">Unknown field type '{type}'</span>;
	}

	return (
		<div key={index} className="flex flex-col gap-2 relative border p-2 rounded-md">
			<Renderer
				key={entryJsonPath}
				name={`${index + 1}`}
				path={path}
				value={value}
				onChange={onChange}
				entrySchema={schema}
				jsonPath={entryJsonPath}
				getRenderer={getRenderer}
				defaultValue={defaultValue}
				nested
			/>
			<Button className="text-destructive w-full" variant="destructive" onClick={handleRemove}>
				<Trash2 />
			</Button>
		</div>
	);
}
