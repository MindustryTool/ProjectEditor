import { Button } from "#/components/ui/button";
import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { getArrayItemSchema, unwrapSchema } from "@project/schema";
import { HJSON } from "@project/hjson";
import { Plus, X } from "lucide-react";
import React from "react";
import * as v from "valibot";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { SchemaArrayItemEditor } from "./SchemaArrayItemEditor";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";

export const ArrayField = React.memo(function ArrayField({ path, name, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	const arrayValue = Array.isArray(value) ? value : undefined;

	if (!arrayValue) {
		onChange(jsonPath, () => HJSON.stringify(v.getDefault(entrySchema) ?? []));
		return null;
	}

	const itemSchema = getArrayItemSchema(entrySchema);

	if (!itemSchema) {
		throw new Error("Array schema must have item schema: " + entrySchema);
	}

	const handleRemove = (index: number) => {
		onChange(jsonPath, (parent, key, original) => {
			const arr = parent.get(key);
			if (!arr.isArray()) throw new Error(`expected array at ${jsonPath}`);
			return arr.removeElement(original, index);
		});
	};

	const handleAdd = () => {
		const nextItemSchema = getArrayItemSchema(entrySchema, arrayValue.length) ?? itemSchema;

		let defaultValue: unknown = v.getDefault(nextItemSchema);
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
	};

	return (
		<Field jsonPath={jsonPath}>
			<FieldLabel>
				<SchemaLabel name={name} entrySchema={entrySchema} />
			</FieldLabel>
			<SchemaDescription entrySchema={entrySchema} />
			<FieldControl>
				<div className="flex flex-col gap-2 border p-2 rounded-md border-dashed">
					{arrayValue.map((el, index) => {
						const currentItemSchema = getArrayItemSchema(entrySchema, index) ?? itemSchema;
						const entryJsonPath = jsonPath ? `${jsonPath}[${index}]` : `[${index}]`;

						return (
							<div key={index} className="flex flex-col gap-2 relative border p-2 rounded-md">
								<p className="font-semibold">{index + 1}</p>
								<SchemaArrayItemEditor
									path={path}
									value={el}
									itemSchema={currentItemSchema}
									onChange={onChange}
									jsonPath={entryJsonPath}
								/>
								<Button
									size="sm"
									className="absolute top-1 right-1 text-destructive"
									variant="ghost"
									onClick={() => handleRemove(index)}
								>
									<X />
								</Button>
							</div>
						);
					})}
					<Button type="button" variant="outline" size="sm" onClick={handleAdd}>
						<Plus /> Add
					</Button>
				</div>
			</FieldControl>
		</Field>
	);
});
