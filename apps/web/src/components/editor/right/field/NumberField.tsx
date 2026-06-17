import { FieldControl, Field } from "#/components/editor/right/field/Field";
import React, { useCallback } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { handleNumber, type SchemaRendererProps } from "#/components/editor/right/field/types";
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
	const numValue = value === undefined ? "" : typeof value === "number" ? value : typeof value === "string" ? value : "";
	const isDefault = value === undefined || numValue === defaultValue;

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = handleNumber(event);

			if (event.currentTarget.value === "") {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}

			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, newValue));
		},
		[onChange, jsonPath],
	);

	const handleBlur = useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			const numValue = Number(event.target.value);
			const isDefault = numValue === defaultValue;

			if (isDefault) {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}
		},
		[defaultValue, jsonPath, onChange],
	);

	const handleReset = useCallback(() => {
		onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
	}, [onChange, jsonPath]);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl>
				<InputGroup>
					<InputGroupInput
						key={name}
						value={numValue}
						onChange={handleChange}
						onBlur={handleBlur}
						placeholder={defaultValue?.toString()}
					/>
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
