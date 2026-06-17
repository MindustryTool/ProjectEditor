import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { hasNullableWrapper } from "@project/schema";
import React, { useCallback } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";

export const BarrelsField = React.memo(function BarrelsField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
	metadata,
}: SchemaRendererProps) {
	const stringValue = typeof value === "string" ? value : String(value ? JSON.stringify(value) : defaultValue || "");

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const newVal = event.currentTarget.value;
			const isDefault = newVal === defaultValue;
			const isNullable = hasNullableWrapper(entrySchema);

			if (newVal === "" || (isDefault && !isNullable)) {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}
			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, newVal));
		},
		[defaultValue, entrySchema, jsonPath, onChange],
	);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl>
				{metadata?.multiline ? (
					<Textarea key={name} value={stringValue} onChange={handleChange} />
				) : (
					<Input key={name} value={stringValue} onChange={handleChange} />
				)}
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
