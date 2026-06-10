import { FieldControl } from "#/components/editor/right/field/Field";
import { getSchemaMetadata, getSchemaEntries, resolveSchema, detectSchemaType, getDefaults } from "@project/schema";
import React, { useMemo } from "react";
import type { AnySchema } from "@project/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "#/components/ui/button";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import { FieldCategory } from "#/components/editor/right/field/FieldCategory";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { cn } from "#/lib/utils";

export const ObjectField = React.memo(function ObjectField({
	name,
	path,
	value,
	onChange,
	entrySchema,
	jsonPath,
	getRenderer,
	nested,
}: SchemaRendererProps) {
	const resolvedValue = useMemo(() => (value && typeof value === "object" ? value : {}), [value]);

	const entries = getSchemaEntries(resolveSchema(entrySchema, resolvedValue));

	if (entries.length < 5) {
		return (
			<Children entries={entries} value={resolvedValue} path={path} onChange={onChange} jsonPath={jsonPath} getRenderer={getRenderer} />
		);
	}

	return (
		<Collapsible id={jsonPath}>
			<CollapsibleTrigger asChild>
				<Button className="flex justify-between items-center w-full">
					<SchemaLabel name={name} metadata={getSchemaMetadata(entrySchema)} />
					<ChevronDown className="size-5 mr-1" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div
					className={cn("grid gap-6 mt-2", {
						"border-border p-2 border rounded-md bg-muted/50": !nested,
					})}
				>
					<Children
						entries={entries}
						value={resolvedValue}
						path={path}
						onChange={onChange}
						jsonPath={jsonPath}
						getRenderer={getRenderer}
					/>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
});

function Children({
	entries,
	value,
	path,
	jsonPath,
	onChange,
	getRenderer,
}: {
	entries: [string, AnySchema][];
	value: unknown;
	path: string;
	onChange: SchemaRendererProps["onChange"];
	jsonPath: string;
	getRenderer: SchemaRendererProps["getRenderer"];
}) {
	const elements: React.ReactNode[] = [];
	let lastCategory: string | undefined;

	for (const [name, childSchema] of entries) {
		const key = name;
		const childValue = (value as Record<string, unknown>)?.[name];
		const defaultValue = getDefaults(childSchema, childValue);
		const { type, schema } = detectSchemaType(childSchema, childValue);
		const metadata = getSchemaMetadata(childSchema);

		if (metadata?.visibleWhen && typeof value === "object" && value !== null) {
			const refValue = (value as Record<string, unknown>)[metadata.visibleWhen.field];
			if (refValue === undefined || refValue !== metadata.visibleWhen.value) continue;
		}

		if (metadata?.category && metadata.category !== lastCategory) {
			elements.push(<FieldCategory key={`cat-${metadata.category}`} category={metadata.category} />);
			lastCategory = metadata.category;
		}

		const Renderer = getRenderer(type);

		if (Renderer === undefined) {
			elements.push(
				<FieldControl key={key}>
					<SchemaLabel name={name} metadata={metadata} />
					<span className="text-red-400 text-sm">Unknown field type '{type}'</span>
				</FieldControl>,
			);
		} else {
			elements.push(
				<Renderer
					key={key}
					path={path}
					name={name}
					value={childValue ?? defaultValue}
					onChange={onChange}
					entrySchema={schema}
					jsonPath={jsonPath ? `${jsonPath}.${name}` : name}
					getRenderer={getRenderer}
					defaultValue={defaultValue}
				/>,
			);
		}
	}

	return elements;
}
