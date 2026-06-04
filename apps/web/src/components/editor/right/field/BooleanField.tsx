import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
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
		<Field>
			<FieldControl className="flex-row flex gap-1">
				<Checkbox key={name} checked={checked} onCheckedChange={(val) => handleChange(val === true)} />
				<FieldLabel>
					<SchemaLabel name={name} entrySchema={entrySchema} />
				</FieldLabel>
			</FieldControl>
			<SchemaDescription entrySchema={entrySchema} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
