import { FieldControl, FieldLabel } from "#/components/editor/right/field/Field";
import { getSchemaMetadata, getSchemaEntries, resolveSchema, detectSchemaType } from "@project/schema";
import React from "react";
import * as v from "valibot";
import { SchemaLabel } from "./SchemaLabel";
import { schemaRenderers } from "./index";
import { type SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";
import type { AnySchema } from "@project/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "#/components/ui/button";

export const ObjectField = React.memo(function ObjectField({ name, path, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	if (typeof value !== "object" || value === null) {
		return null;
	}

	const entries = getSchemaEntries(resolveSchema(entrySchema, value));

	return (
		<Collapsible>
			<CollapsibleTrigger asChild>
				<Button className="flex justify-between items-center w-full">
					<SchemaLabel name={name} entrySchema={getSchemaMetadata(entrySchema)} />
					<ChevronDown className="size-5 mr-1" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="border-border grid gap-6 mt-2 p-2 border rounded-md">
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
								<FieldControl key={key}>
									<FieldLabel>
										<SchemaLabel name={name} entrySchema={getSchemaMetadata(childSchema as AnySchema)} />
									</FieldLabel>
									<span className="text-red-400 text-sm">Unknown field type {type}</span>
								</FieldControl>
							);
						}

						return (
							<Renderer
								key={key}
								path={path}
								name={name}
								value={childValue ?? v.getDefaults(childSchema)}
								onChange={onChange}
								entrySchema={childSchema as AnySchema}
								jsonPath={jsonPath ? `${jsonPath}.${name}` : name}
							/>
						);
					})}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
});
