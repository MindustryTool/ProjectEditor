import { FieldControl, Field } from "#/components/editor/right/field/Field";
import React, { useCallback } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { InputGroup, InputGroupButton, InputGroupInput } from "#/components/ui/input-group";
import { RotateCcw } from "lucide-react";

export const NumberField = React.memo(function NumberField({
	name,
	value,
	onChange,
	jsonPath,
	path,
	defaultValue,
	metadata,
}: SchemaRendererProps) {
	const numValue = typeof value === "number" ? value : "";
	const isDefault = value === undefined || numValue === defaultValue;

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newVal = Number(event.currentTarget.value);
			const isNan = Number.isNaN(newVal);

			if (isNan || event.target.value === "") {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}

			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, newVal));
		},
		[onChange, jsonPath],
	);

	const handleReset = useCallback(() => {
		onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
	}, [onChange, jsonPath]);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl>
				<InputGroup>
					<InputGroupInput key={name} defaultValue={numValue} onChange={handleChange} placeholder={defaultValue?.toString()} />
					{!isDefault && ( 
						<InputGroupButton onClick={handleReset}>
							<RotateCcw />
						</InputGroupButton>
					)}
				</InputGroup>
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
