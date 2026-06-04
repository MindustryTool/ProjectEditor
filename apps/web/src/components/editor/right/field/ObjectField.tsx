import { FieldControl, FieldLabel } from "#/components/editor/right/field/Field";
import { getSchemaMetadata, getSchemaEntries, resolveSchema, detectSchemaType } from "@project/schema";
import React from "react";
import * as v from "valibot";
import { SchemaLabel } from "./SchemaLabel";
import { schemaRenderers } from "./index";
import { useFieldsRenderer, type SchemaRendererProps } from "#/components/editor/right/FieldsRenderer";
import type { AnySchema } from "@project/schema";
import { Button } from "#/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "#/components/ui/separator";

export const ObjectField = React.memo(function ObjectField({ name, path, value, onChange, entrySchema, jsonPath }: SchemaRendererProps) {
	const { current, enter, pop } = useFieldsRenderer();

	if (typeof value !== "object" || value === null) {
		return null;
	}

	if (current === null || current.entrySchema !== entrySchema) {
		return (
			<Button className="justify-between w-full" onClick={() => enter({ name, path, value, onChange, entrySchema, jsonPath })}>
				<span className="font-semibold">{name}</span>
				<ChevronRight />
			</Button>
		);
	}

	const entries = getSchemaEntries(resolveSchema(entrySchema, value));

	return (
		<div className="border-border grid gap-6">
			<Button className="w-full justify-start items-center" onClick={pop}>
				<ChevronLeft />
				<span>{current ? jsonPath : name}</span>
			</Button>
			<Separator />
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
								<SchemaLabel name={name} entrySchema={childSchema as AnySchema} />
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
