import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import { hasNullableWrapper } from "@project/schema";
import { HJSON } from "@project/hjson";
import React from "react";
import * as v from "valibot";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { removeByJsonPath } from "./util";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";
import { getSchemaMetadata } from "@project/schema";

export const NumberField = React.memo(function NumberField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const numValue = typeof value === "number" ? value : String(value);

	function handleChange(newVal: number) {
		const isDefault = newVal === v.getDefault(entrySchema);
		const isNullable = hasNullableWrapper(entrySchema);

		if (Number.isNaN(newVal) || (isDefault && !isNullable)) {
			onChange(jsonPath, (parent, key, original) => removeByJsonPath(parent, key, original));
			return;
		}

		onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(newVal)));
	}

	return (
		<Field jsonPath={jsonPath}>
			<FieldLabel>
				<SchemaLabel name={name} entrySchema={getSchemaMetadata(entrySchema)} />
			</FieldLabel>
			<FieldControl>
				<Input key={name} value={numValue} onChange={(v) => handleChange(v.currentTarget.valueAsNumber)} type="number" />
			</FieldControl>
			<SchemaDescription entrySchema={getSchemaMetadata(entrySchema)} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
