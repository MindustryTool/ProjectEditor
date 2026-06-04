import { Button } from "#/components/ui/button";
import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { getArrayItemSchema } from "@project/schema";
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
		const serialized = nextItemSchema ? HJSON.stringify(v.getDefault(nextItemSchema)) : '""';
		onChange(jsonPath, (parent, key, original) => {
			const arr = parent.get(key);
			if (!arr.isArray()) throw new Error(`expected array at ${jsonPath}`);
			return arr.insertElement(original, arrayValue.length, serialized);
		});
	};

	return (
		<Collapsible>
			<Field jsonPath={jsonPath}>
				<CollapsibleTrigger asChild>
					<Button className="w-full" variant="outline">
						<FieldLabel>
							<SchemaLabel name={name} entrySchema={entrySchema} />
						</FieldLabel>
					</Button>
				</CollapsibleTrigger>
				<SchemaDescription entrySchema={entrySchema} />
				<CollapsibleContent>
					<FieldControl>
						<div className="flex flex-col gap-2">
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
				</CollapsibleContent>
			</Field>
		</Collapsible>
	);
});
