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
	const openPath = `object-open-${jsonPath}`;

	const resolvedValues = useMemo(() => (value && typeof value === "object" ? value : {}), [value]) as Record<string, unknown>;
	const isOpen = useProjectSession(selectIsExpanded(openPath));
	const setOpen = useProjectSession((s) => s.setExpanded);
	const entries = getSchemaEntries(resolveSchema(entrySchema, resolvedValues));

    const defaults = getDefaults(entrySchema, resolvedValues, true) as Record<string, unknown>;
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
						path={path}
						entrySchema={entrySchema}
						values={resolvedValues}
						defaults={defaults}
						jsonPath={jsonPath}
						onChange={onChange}
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
							values={resolvedValues}
                            defaults={defaults}
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
	path,
	jsonPath,
	values,
	defaults,
	onChange,
	getRenderer,
}: {
	name: string;
	entrySchema: AnySchema;
	path: string;
	jsonPath: string;
	values: Record<string, unknown>;
	defaults: Record<string, unknown>;
	onChange: SchemaRendererProps["onChange"];
	getRenderer: SchemaRendererProps["getRenderer"];
}) {
	const key = name;
	const childValue = values[name];
	const defaultValue = defaults[name];
	const { type, schema } = detectSchemaType(entrySchema, childValue);
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);

    if (metadata?.visibleWhen) {
        const conditionValue = values[metadata.visibleWhen.field] ?? defaults[metadata.visibleWhen.field];
        if (conditionValue !== metadata.visibleWhen.value) {
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
