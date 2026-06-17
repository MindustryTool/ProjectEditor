import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { Input } from "#/components/ui/input";
import React, { useCallback } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { EMPTY_ARRAY } from "#/lib/utils";
import { FieldLabel } from "#/components/ui/field";

export const BarrelsField = React.memo(function BarrelsField({ name, value, onChange, jsonPath, path, metadata }: SchemaRendererProps) {
	const array = Array.isArray(value) ? value : EMPTY_ARRAY;

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
			const newValue = [array[0] ?? 0, array[1] ?? 0, array[2] ?? 0];
			const numValue = Number(event.currentTarget.value);
			const isValidNumber = !Number.isNaN(numValue) && String(numValue) === event.currentTarget.value;

			newValue[index] = isValidNumber ? numValue : event.currentTarget.value;

			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, newValue));
		},
		[array, jsonPath, onChange],
	);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl className="flex flex-wrap gap-2">
				<div className="space-y-1 flex-1">
					<FieldLabel>X</FieldLabel>
					<Input value={array[0] ?? 0} onChange={(event) => handleChange(event, 0)} />
				</div>
				<div className="space-y-1 flex-1">
					<FieldLabel>Y</FieldLabel>
					<Input value={array[1] ?? 0} onChange={(event) => handleChange(event, 1)} />
				</div>
				<div className="space-y-1 flex-1">
					<FieldLabel>Rotation</FieldLabel>
					<Input value={array[2] ?? 0} onChange={(event) => handleChange(event, 2)} />
				</div>
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
