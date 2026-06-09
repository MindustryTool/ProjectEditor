import { FieldControl, FieldLabel } from "#/components/editor/right/field/Field";
import { getSchemaMetadata, getSchemaEntries, resolveSchema, detectSchemaType } from "@project/schema";
import React from "react";
import * as v from "valibot";
import type { HjsonNode } from "@project/hjson";
import { type SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";
import type { AnySchema } from "@project/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "#/components/ui/button";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import { FieldCategory } from "#/components/editor/right/field/FieldCategory";
import { schemaRenderers } from "#/components/editor/right/field/renderer";

export const ObjectField = React.memo(function ObjectField({ name, path, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	if (typeof value !== "object" || value === null) {
		return null;
	}

	const entries = getSchemaEntries(resolveSchema(entrySchema, value));

	return (
		<Collapsible>
			<CollapsibleTrigger asChild>
				<Button className="flex justify-between items-center w-full">
					<SchemaLabel name={name} metadata={getSchemaMetadata(entrySchema)} />
					<ChevronDown className="size-5 mr-1" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="border-border grid gap-6 mt-2 p-2 border rounded-md">
					{buildCategoryObjectFields(entries, value, path, onChange, jsonPath)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
});

function buildCategoryObjectFields(
	entries: [string, AnySchema][],
	value: unknown,
	path: string,
	onChange: (jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => void,
	jsonPath: string,
) {
	const elements: React.ReactNode[] = [];
	let lastCategory: string | undefined;

	for (const [name, childSchema] of entries) {
		const key = name;
		const childValue = (value as Record<string, unknown>)?.[name];
		const type = detectSchemaType(childSchema, childValue);
		const metadata = getSchemaMetadata(childSchema);

		if (metadata?.visibleWhen && typeof value === "object" && value !== null) {
			const refValue = (value as Record<string, unknown>)[metadata.visibleWhen.field];
			if (refValue === undefined || refValue !== metadata.visibleWhen.value) continue;
		}

		if (metadata?.category && metadata.category !== lastCategory) {
			elements.push(<FieldCategory key={`cat-${metadata.category}`} category={metadata.category} />);
			lastCategory = metadata.category;
		}

		const Renderer = schemaRenderers.get(type);

		if (Renderer === undefined) {
			elements.push(
				<FieldControl key={key}>
					<FieldLabel>
						<SchemaLabel name={name} metadata={metadata} />
					</FieldLabel>
					<span className="text-red-400 text-sm">Unknown field type {type}</span>
				</FieldControl>,
			);
		} else {
			elements.push(
				<Renderer
					key={key}
					path={path}
					name={name}
					value={childValue ?? v.getDefaults(childSchema)}
					onChange={onChange}
					entrySchema={childSchema as AnySchema}
					jsonPath={jsonPath ? `${jsonPath}.${name}` : name}
				/>,
			);
		}
	}

	return elements;
}

schemaRenderers.set("object", ObjectField);
