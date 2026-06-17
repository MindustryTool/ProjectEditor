import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { Checkbox } from "#/components/ui/checkbox";
import React, { useCallback } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";

export const BooleanField = React.memo(function BooleanField({
	name,
	value,
	onChange,
	jsonPath,
	path,
	defaultValue,
	metadata,
}: SchemaRendererProps) {
	const checked = typeof value === "boolean" ? value : Boolean(defaultValue);

	const handleChange = useCallback(
		(val: boolean) => {
			if (val === defaultValue) {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}
			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, val));
		},
		[onChange, jsonPath, defaultValue],
	);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<FieldControl className="flex-row flex items-center gap-1 mt-2">
				<Checkbox key={name} checked={checked} onCheckedChange={handleChange} />
				<SchemaLabel name={name} metadata={metadata} />
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
