import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Checkbox } from "#/components/ui/checkbox";
import React, { useCallback, useMemo } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { getSchemaMetadata, hasNullableWrapper } from "@project/schema";
import { HJSON } from "@project/hjson";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";

export const BooleanField = React.memo(function BooleanField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
}: SchemaRendererProps) {
	const checked = typeof value === "boolean" ? value : Boolean(defaultValue);
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	const handleChange = useCallback(
		(val: boolean) => {
			if (val === defaultValue && !hasNullableWrapper(entrySchema)) {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}
			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, HJSON.stringify(val)));
		},
		[onChange, jsonPath, entrySchema, defaultValue],
	);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<FieldControl className="flex-row flex gap-1">
				<Checkbox key={name} checked={checked} onCheckedChange={handleChange} />
				<FieldLabel>
					<SchemaLabel name={name} metadata={metadata} />
				</FieldLabel>
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
