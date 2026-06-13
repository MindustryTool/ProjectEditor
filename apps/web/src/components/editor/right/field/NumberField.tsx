import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import { hasNullableWrapper } from "@project/schema";
import React, { useCallback, useMemo } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { getSchemaMetadata } from "@project/schema";

export const NumberField = React.memo(function NumberField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
}: SchemaRendererProps) {
	const numValue = typeof value === "number" ? value : "";
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

    console.log({ value, defaultValue });

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newVal = event.currentTarget.valueAsNumber;
			const isDefault = newVal === defaultValue;
			const isNullable = hasNullableWrapper(entrySchema);
            const isNan = Number.isNaN(newVal);

			console.log({ newVal, isDefault, isNullable, isNan });

			if (isNan || (isDefault && !isNullable)) {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}

			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, newVal));
		},
		[onChange, jsonPath, entrySchema, defaultValue],
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
