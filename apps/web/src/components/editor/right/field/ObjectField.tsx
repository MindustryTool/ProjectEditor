import { FieldControl } from "#/components/editor/right/field/Field";
import { getSchemaMetadata, getSchemaEntries, resolveSchema, detectSchemaType, getDefaults } from "@project/schema";
import React, { useCallback, useMemo } from "react";
import type { AnySchema } from "@project/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "#/components/ui/button";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { cn } from "#/lib/utils";
import { selectIsExpanded, useProjectSession } from "@project/core";
import { ErrorBoundary } from "#/components/ui/error-boundary";
import { ErrorDisplay } from "#/components/ui/error-display";

export const ObjectField = React.memo(function ObjectField({
	name,
	path,
	value,
	onChange,
	entrySchema,
	jsonPath,
	getRenderer,
	nested,
	metadata,
}: SchemaRendererProps) {
	const resolvedValue = useMemo(() => (value && typeof value === "object" ? value : {}), [value]);
	const openPath = `object-open-${jsonPath}`;

	const isOpen = useProjectSession(selectIsExpanded(openPath));
	const setOpen = useProjectSession((s) => s.setExpanded);
	const entries = getSchemaEntries(resolveSchema(entrySchema, resolvedValue));

	const handleOpen = useCallback((open: boolean) => setOpen(openPath, open), [openPath, setOpen]);

	if (entries.length < 4) {
		return (
			<div
				className={cn("grid gap-6 mt-2", {
					"border-border p-2 border rounded-md bg-muted/50": !nested,
				})}
			>
				{entries.map(([name, entrySchema]) => (
					<Child
						key={name}
						name={name}
						entrySchema={entrySchema}
						value={resolvedValue}
						path={path}
						onChange={onChange}
						jsonPath={jsonPath}
						getRenderer={getRenderer}
					/>
				))}
			</div>
		);
	}

	return (
		<Collapsible id={jsonPath} open={isOpen} onOpenChange={handleOpen}>
			<CollapsibleTrigger asChild>
				<Button className="flex justify-between items-center w-full">
					<SchemaLabel name={name} metadata={metadata} />
					<ChevronDown className="size-5 mr-1" />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div
					className={cn("grid gap-6 mt-2", {
						"border-border p-2 border rounded-md bg-muted/50": !nested,
					})}
				>
					{entries.map(([name, entrySchema]) => (
						<Child
							key={name}
							name={name}
							entrySchema={entrySchema}
							value={resolvedValue}
							path={path}
							onChange={onChange}
							jsonPath={jsonPath}
							getRenderer={getRenderer}
						/>
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
});

function Child({
	name,
	entrySchema,
	value,
	path,
	jsonPath,
	onChange,
	getRenderer,
}: {
	name: string;
	entrySchema: AnySchema;
	value: unknown;
	path: string;
	onChange: SchemaRendererProps["onChange"];
	jsonPath: string;
	getRenderer: SchemaRendererProps["getRenderer"];
}) {
	const key = name;
	const childValue = (value as Record<string, unknown>)?.[name];
	const defaultValue = getDefaults(entrySchema, childValue);
	const { type, schema } = detectSchemaType(entrySchema, childValue);
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

	if (metadata?.visibleWhen && typeof value === "object" && value !== null) {
		const refValue = (value as Record<string, unknown>)[metadata.visibleWhen.field];
		if (refValue === undefined || refValue !== metadata.visibleWhen.value) {
			return null;
		}
	}

	const Renderer = getRenderer(type);

	if (Renderer === undefined) {
		return (
			<FieldControl key={key}>
				<SchemaLabel name={name} metadata={metadata} />
				<span className="text-red-400 text-sm">Unknown field type '{type}'</span>
			</FieldControl>
		);
	}

	return (
		<ErrorBoundary
			key={key}
			fallback={({ error, reset }) => (
				<FieldControl key={key}>
					<SchemaLabel name={name} metadata={metadata} />
					<ErrorDisplay message={error.message} onRetry={reset} />
				</FieldControl>
			)}
		>
			<Renderer
				path={path}
				name={name}
				value={childValue}
				onChange={onChange}
				entrySchema={schema}
				jsonPath={jsonPath ? `${jsonPath}.${name}` : name}
				getRenderer={getRenderer}
				defaultValue={defaultValue}
				metadata={metadata}
			/>
		</ErrorBoundary>
	);
}
