import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { Checkbox } from "#/components/ui/checkbox";
import React from "react";
import * as v from "valibot";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { removeByJsonPath } from "./util";
import { hasNullishWrapper } from "@project/schema";
import { HJSON } from "@project/hjson";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";

export const BooleanField = React.memo(function BooleanField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const checked = typeof value === "boolean" ? value : v.getDefault(entrySchema);

	function handleChange(val: boolean) {
		if (val === v.getDefault(entrySchema) && !hasNullishWrapper(entrySchema)) {
			onChange(jsonPath, (parent, key, original) => removeByJsonPath(parent, key, original));
			return;
		}
		onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(val)));
	}

	return (
		<FormField>
			<FormControl className="flex-row flex gap-1">
				<Checkbox key={name} checked={checked} onCheckedChange={(val) => handleChange(val === true)} />
				<FormLabel>
					<SchemaLabel name={name} entrySchema={entrySchema} />
				</FormLabel>
			</FormControl>
			<SchemaDescription entrySchema={entrySchema} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</FormField>
	);
});
