import { FieldControl, Field, FieldLabel } from "#/components/editor/right/field/Field";
import { Checkbox } from "#/components/ui/checkbox";
import React, { useCallback, useMemo } from "react";
import * as v from "valibot";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { removeByJsonPath } from "./util";
import { getSchemaMetadata, hasNullableWrapper } from "@project/schema";
import { HJSON } from "@project/hjson";
import type { SchemaRendererProps } from "#/components/editor/right/field/renderer";
import { schemaRenderers } from "#/components/editor/right/field/renderer";

export const BooleanField = React.memo(function BooleanField({ name, value, onChange, entrySchema, jsonPath, path }: SchemaRendererProps) {
	const checked = typeof value === "boolean" ? value : v.getDefault(entrySchema);
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	const handleChange = useCallback(
		(val: boolean) => {
			if (val === v.getDefault(entrySchema) && !hasNullableWrapper(entrySchema)) {
				onChange(jsonPath, (parent, key, original) => removeByJsonPath(parent, key, original));
				return;
			}
			onChange(jsonPath, (parent, key, original) => parent.objectNode(key).patchField(original, key, HJSON.stringify(val)));
		},
		[onChange, jsonPath, entrySchema],
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

schemaRenderers.set("boolean", BooleanField);
