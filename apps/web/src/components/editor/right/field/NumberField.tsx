import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import { hasNullableWrapper } from "@project/schema";
import { HJSON } from "@project/hjson";
import React, { useCallback, useMemo } from "react";
import * as v from "valibot";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { removeByJsonPath } from "./util";
import type { SchemaRendererProps } from "#/components/editor/right/field/renderer";
import { getSchemaMetadata } from "@project/schema";
import { schemaRenderers } from "#/components/editor/right/field/renderer";

export const NumberField = React.memo(function NumberField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const numValue = typeof value === "number" ? value : String(value);
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newVal = event.currentTarget.valueAsNumber;
			const isDefault = newVal === v.getDefault(entrySchema);
			const isNullable = hasNullableWrapper(entrySchema);

			if (Number.isNaN(newVal) || (isDefault && !isNullable)) {
				onChange(jsonPath, (parent, key, original) => removeByJsonPath(parent, key, original));
				return;
			}

			onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(newVal)));
		},
		[onChange, jsonPath, entrySchema],
	);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<FieldLabel>
				<SchemaLabel name={name} metadata={metadata} />
			</FieldLabel>
			<FieldControl>
				<Input key={name} value={numValue} onChange={handleChange} type="number" />
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});

schemaRenderers.set("number", NumberField);
