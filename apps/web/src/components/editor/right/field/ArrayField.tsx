import { Button } from "#/components/ui/button";
import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { getArrayItemSchema, getSchemaMetadata, unwrapSchema, type AnySchema } from "@project/schema";
import { HJSON } from "@project/hjson";
import { Plus, X } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import * as v from "valibot";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { SchemaArrayItemEditor } from "./SchemaArrayItemEditor";
import type { SchemaRendererProps } from "#/components/editor/right/field/renderer";
import { Separator } from "#/components/ui/separator";
import { schemaRenderers } from "#/components/editor/right/field/renderer";

export const ArrayField = React.memo(function ArrayField({ path, name, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	const arrayValue = Array.isArray(value) ? value : undefined;
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	const handleAdd = useCallback(() => {
		if (!arrayValue) {
			return;
		}

		const nextItemSchema = getArrayItemSchema(entrySchema, arrayValue.length);

		let defaultValue: unknown = v.getDefaults(nextItemSchema);
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

		onChange(jsonPath, (parent, key, original) => {
			const arr = parent.get(key);
			if (!arr.isArray()) throw new Error(`expected array at ${jsonPath}`);
			return arr.insertElement(original, arrayValue.length, HJSON.stringify(defaultValue));
		});
	}, [arrayValue, entrySchema, onChange, jsonPath]);

	if (!arrayValue) {
		return null;
	}

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<FieldLabel>
				<SchemaLabel name={name} metadata={metadata} />
			</FieldLabel>
			<SchemaDescription metadata={metadata} />
			<FieldControl>
				<div className="flex flex-col gap-2 border p-2 rounded-md border-dashed">
					{arrayValue.map((el, index) => (
						<ArrayElement
							key={index}
							index={index}
							value={el}
							itemSchema={entrySchema}
							onChange={onChange}
							jsonPath={jsonPath}
							path={path}
						/>
					))}
					<Button type="button" variant="outline" size="sm" onClick={handleAdd}>
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
}: {
	path: string;
	index: number;
	value: unknown;
	itemSchema: AnySchema;
	onChange: Parameters<typeof ArrayField>[0]["onChange"];
	jsonPath: string;
}) {
	const currentItemSchema = getArrayItemSchema(itemSchema, index);
	const entryJsonPath = jsonPath ? `${jsonPath}[${index}]` : `[${index}]`;

	const handleRemove = useCallback(() => {
		onChange(jsonPath, (parent, key, original) => {
			const arr = parent.get(key);
			if (!arr.isArray()) throw new Error(`expected array at ${jsonPath}`);
			return arr.removeElement(original, index);
		});
	}, [onChange, jsonPath, index]);

	return (
		<div key={index} className="flex flex-col gap-2 relative border p-2 rounded-md">
			<div className="w-full flex items-center justify-between">
				<p className="font-semibold">{index + 1}</p>
				<Button size="sm" className="text-destructive" variant="ghost" onClick={handleRemove}>
					<X />
				</Button>
			</div>
			<Separator />
			<SchemaArrayItemEditor path={path} value={value} itemSchema={currentItemSchema} onChange={onChange} jsonPath={entryJsonPath} />
		</div>
	);
}

schemaRenderers.set("array", ArrayField);
