import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { HJSON } from "@project/hjson";
import { unwrapSchema } from "@project/schema";
import React from "react";
import * as v from "valibot";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";

export const PickListField = React.memo(function PickListField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const stringValue = typeof value === "string" ? value : ((v.getDefault(entrySchema) ?? "") as string);
	const unwrappedSchema = unwrapSchema(entrySchema);

	if ("options" in unwrappedSchema && Array.isArray(unwrappedSchema.options)) {
		const options = unwrappedSchema.options.map((v) => String(v));

		return (
			<FormField>
				<FormLabel>
					<SchemaLabel name={name} entrySchema={entrySchema} />
				</FormLabel>
				<FormControl>
					<Select
						key={name}
						value={stringValue}
						onValueChange={(nextValue) =>
							onChange(jsonPath, (parent, key, original) =>
								parent.objectNode(key).patchField(original, key, HJSON.stringify(nextValue)),
							)
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="None (empty file)" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectGroup>
								{options.map((option) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</FormControl>
				<SchemaDescription entrySchema={entrySchema} />
				<FieldIssue path={path} jsonPath={jsonPath} />
			</FormField>
		);
	}

	throw new Error(`Unknown option ${value}, this should not happen`);
});
