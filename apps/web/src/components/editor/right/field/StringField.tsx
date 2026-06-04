import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { hasNullableWrapper } from "@project/schema";
import { HJSON } from "@project/hjson";
import React from "react";
import * as v from "valibot";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { removeByJsonPath } from "./util";
import { getSchemaMetadata } from "@project/schema";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";

export const StringField = React.memo(function StringField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const stringValue = typeof value === "string" ? value : String(value);
	const metadata = getSchemaMetadata(entrySchema);

	function handleChange(newVal: string) {
		const isDefault = newVal === v.getDefault(entrySchema);
		const isNullable = hasNullableWrapper(entrySchema);

		if (newVal === "" || (isDefault && !isNullable)) {
			onChange(jsonPath, (parent, key, original) => removeByJsonPath(parent, key, original));
			return;
		}
		onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(newVal)));
	}

	return (
		<Field>
			<FieldLabel>
				<SchemaLabel name={name} entrySchema={entrySchema} />
			</FieldLabel>
			<FieldControl>
				{metadata?.multiline ? (
					<Textarea key={name} value={stringValue} onChange={(v) => handleChange(v.currentTarget.value)} />
				) : (
					<Input key={name} value={stringValue} onChange={(v) => handleChange(v.currentTarget.value)} />
				)}
			</FieldControl>
			<SchemaDescription entrySchema={entrySchema} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
