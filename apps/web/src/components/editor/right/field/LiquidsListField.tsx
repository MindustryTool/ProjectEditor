import { ContentImage } from "#/components/editor/ContentImage";
import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { getSchemaMetadata, unwrapSchema } from "@project/schema";
import React, { useMemo } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";

export const LiquidsListField = React.memo(function LiquidsListField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
}: SchemaRendererProps) {
	const stringValue = typeof value === "string" ? value : ((defaultValue ?? "") as string);
	const context = useProjectContext();
	const unwrappedSchema = unwrapSchema(entrySchema);
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	if ("options" in unwrappedSchema && Array.isArray(unwrappedSchema.options)) {
		const options = unwrappedSchema.options
			.map((v) => String(v))
			.map((v) => context.contents.liquids.find((l) => l.name === v))
			.filter(Boolean)
			.map((option) => option!);

		return (
			<Field jsonPath={jsonPath} metadata={metadata}>
				<SchemaLabel name={name} metadata={metadata} />
				<FieldControl>
					<Select
						key={name}
						value={stringValue}
						onValueChange={(nextValue) => onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, nextValue))}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="None" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectGroup className="grid grid-cols-4">
								{options.map((option) => (
									<SelectItem key={option.name} value={option.name}>
										<ContentImage className="size-5" entry={option} />
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</FieldControl>
				<SchemaDescription metadata={metadata} />
				<FieldIssue path={path} jsonPath={jsonPath} />
			</Field>
		);
	}

	throw new Error(`Unknown option ${value}, this should not happen`);
});
