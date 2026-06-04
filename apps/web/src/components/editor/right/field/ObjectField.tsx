import { FormControl, FormLabel } from "#/components/ui/form";
import { getSchemaMetadata, getSchemaEntries, resolveSchema, detectSchemaType } from "@project/schema";
import React from "react";
import * as v from "valibot";
import { SchemaLabel } from "./SchemaLabel";
import { schemaRenderers } from "./index";
import type { SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";
import type { AnySchema } from "@project/schema";

export const ObjectField = React.memo(function ObjectField({ name, path, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	if (typeof value !== "object" || value === null) {
		return null;
	}

	const entries = getSchemaEntries(resolveSchema(entrySchema, value));

	return (
		<div className="pl-4 border-l-2 border-border grid gap-6">
			{name}
			{entries.map(([name, childSchema]) => {
				const key = name;
				const childValue = (value as Record<string, unknown>)?.[name];
				const type = detectSchemaType(childSchema, childValue);
				const metadata = getSchemaMetadata(childSchema);

				if (metadata?.visibleWhen && typeof value === "object" && value !== null) {
					const refValue = (value as Record<string, unknown>)[metadata.visibleWhen.field];
					if (refValue === undefined || refValue !== metadata.visibleWhen.value) return null;
				}

				const Renderer = schemaRenderers[type];

				if (Renderer === undefined) {
					return (
						<FormControl key={key}>
							<FormLabel>
								<SchemaLabel name={name} entrySchema={childSchema as AnySchema} />
							</FormLabel>
							<span className="text-red-400 text-sm">Unknown field type {type}</span>
						</FormControl>
					);
				}

				return (
					<Renderer
						key={key}
						path={path}
						name={name}
						value={childValue ?? v.getDefault(childSchema)}
						onChange={onChange}
						entrySchema={childSchema as AnySchema}
						jsonPath={jsonPath ? `${jsonPath}.${name}` : name}
					/>
				);
			})}
		</div>
	);
});
