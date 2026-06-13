import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import { hasNullableWrapper } from "@project/schema";
import React, { useCallback } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";

export const NumberField = React.memo(function NumberField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
	metadata,
}: SchemaRendererProps) {
	const numValue = typeof value === "number" ? value : "";

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newVal = event.currentTarget.valueAsNumber;
			const isNullable = hasNullableWrapper(entrySchema);
			const isNan = Number.isNaN(newVal);

			if (isNan || !isNullable) {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}

			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, newVal));
		},
		[onChange, jsonPath, entrySchema],
	);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl>
				<Input key={name} value={numValue} onChange={handleChange} type="number" placeholder={defaultValue?.toString()} />
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
