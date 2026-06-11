import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { Envs, EnvValues, hasNullableWrapper } from "@project/schema";
import React, { useCallback, useMemo } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { getSchemaMetadata } from "@project/schema";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";

export const EnvField = React.memo(function EnvField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
}: SchemaRendererProps) {
	const envValue = typeof value === "number" ? value : EnvValues.includes(defaultValue as number) ? (defaultValue as number) : 0;
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	const handleChange = useCallback(
		(value: string) => {
			const selected = Envs[value as keyof typeof Envs];
			const isDefault = selected === defaultValue;
			const isNullable = hasNullableWrapper(entrySchema);

			if (value === "" || (isDefault && !isNullable)) {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}
			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, selected));
		},
		[defaultValue, entrySchema, jsonPath, onChange],
	);

	const selected = Object.entries(Envs).find(([_key, value]) => value === envValue)?.[0];

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl>
				<Select value={selected} onValueChange={handleChange}>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(Envs).map(([key]) => (
							<SelectItem key={key} value={key}>
								{key}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
