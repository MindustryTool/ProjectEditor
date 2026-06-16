import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormLabel } from "#/components/ui/form";
import { useFileString, useProjectSession, selectCurrentJsonPath } from "@project/core";
import type { HjsonNode } from "@project/hjson";
import { HJSON } from "@project/hjson";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
	resolveSchema,
	detectSchemaType,
	getSchemaEntries,
	getSchemaMetadata,
	getSchemaFromPath,
	type AnySchema,
	type SchemaFn,
	getDefaults,
} from "@project/schema";

import { getRenderer } from "#/components/editor/right/field/registry";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { Search, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "usehooks-ts";
import { cn, levenshtein } from "#/lib/utils";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { useFileName } from "#/hooks/use-path";

interface FieldsRendererProps {
	path: string;
	schema: AnySchema | SchemaFn;
}

export const FieldsRenderer = React.memo(function FieldsRenderer({ path, schema }: FieldsRendererProps) {
	const { t } = useTranslation();
	const { data, isLoading, write } = useFileString(path);
	const [render, setRender] = useState(30);
	const [filter, setFilter] = useLocalStorage("property-filter", "");
	const { contents } = useProjectContext();
	const endRef = React.useRef<HTMLDivElement>(null);
	const currentJsonPath = useProjectSession(selectCurrentJsonPath);
	const setCurrentJsonPath = useProjectSession((s) => s.setCurrentJsonPath);
	const fileName = useFileName();

	const onChange = useCallback(
		(jsonPath: string, updater: (node: HjsonNode, original: string, key: string | number, root: HjsonNode) => string) => {
			return HJSON.patch(write)(jsonPath, updater);
		},
		[write],
	);

	useEffect(() => {
		setFilter("");
	}, [setFilter, currentJsonPath]);

	useEffect(() => {
		const element = endRef.current;

		if (!element) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setRender((prev) => prev + 30);
				}
			},
			{
				root: null,
				threshold: 0.00001,
			},
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [setRender]);

	if (isLoading || data === null) {
		return null;
	}

	let node = null;
	try {
		node = HJSON.parseWithCache(data);
	} catch (error) {
		return String(error);
	}

	if (!node.isObject()) {
		return null;
	}

	const values = node.valueOf() as Record<string, unknown>;
	if (!values || typeof values !== "object") {
		return null;
	}

	const rootSchema = typeof schema === "function" ? schema(contents) : schema;
	const resolvedRoot = resolveSchema(rootSchema, values);

	const resolved = currentJsonPath !== null ? getSchemaFromPath(currentJsonPath, resolvedRoot, values) : null;
	const activeSchema = resolved?.schema !== undefined ? resolveSchema(resolved.schema, resolved.value) : resolvedRoot;
	const activeValues = (resolved?.value as Record<string, unknown>) ?? values;
	const entries = getSchemaEntries(activeSchema);
	const filtered = (filter ? levenshtein(entries, ([name]) => name, filter, 10) : entries).slice(0, render);
	const activeDefaults = getDefaults(activeSchema, activeValues, true) as Record<string, unknown>;

	const breadcrumbSegments = currentJsonPath !== null ? currentJsonPath.split(".") : [];

	return (
		<div className="space-y-4 h-full w-full overflow-y-auto relative">
			<Suspense>
				<ErrorBoundary>
					{breadcrumbSegments.length > 0 && (
						<div className="flex items-center gap-1 text-sm flex-wrap sticky top-0 bg-card z-50 border-b p-2">
							<button className="h-auto py-0.5 text-muted-foreground hover:text-foreground" onClick={() => setCurrentJsonPath(null)}>
								Root
							</button>
							{breadcrumbSegments.map((segment, index) => {
								const prefix = breadcrumbSegments.slice(0, index + 1).join(".");
								return (
									<React.Fragment key={prefix}>
										<ChevronRight
											className={cn("size-3 text-muted-foreground", {
												"text-foreground": index === breadcrumbSegments.length - 1,
											})}
										/>
										<button
											className={cn("h-auto py-0.5 text-muted-foreground hover:text-foreground", {
												"text-foreground": index === breadcrumbSegments.length - 1,
											})}
											onClick={() => setCurrentJsonPath(prefix)}
										>
											{segment}
										</button>
									</React.Fragment>
								);
							})}
						</div>
					)}
					{fileName !== null && <div className="text-lg font-bold px-2">{fileName}</div>}
					<div className="grid gap-2 px-2">
						<span className="first-letter:uppercase flex items-center gap-2 text-sm leading-none font-medium select-none">
							{t("editor.search")}
						</span>
						<InputGroup>
							<InputGroupAddon>
								<Search className="size-4" />
							</InputGroupAddon>
							<InputGroupInput //
								value={filter}
								onChange={(e) => {
									setFilter(e.target.value);
									setRender(30);
								}}
								placeholder={t("editor.search")}
							/>
						</InputGroup>
					</div>
					<div className="px-2 space-y-6">
						{filtered.map(([name, entrySchema]) => (
							<Child
								key={name}
								name={name}
								entrySchema={entrySchema}
								path={path}
								onChange={onChange}
								values={activeValues}
								defaults={activeDefaults}
								jsonPathBase={currentJsonPath ?? ""}
							/>
						))}
						<div className="end w-full invisible h-2" ref={endRef}></div>
					</div>
				</ErrorBoundary>
			</Suspense>
		</div>
	);
});

function Child({
	name,
	entrySchema,
	values,
	path,
	onChange,
	defaults,
	jsonPathBase,
}: {
	name: string;
	entrySchema: AnySchema;
	values: Record<string, unknown>;
	defaults: Record<string, unknown>;
	path: string;
	onChange: SchemaRendererProps["onChange"];
	jsonPathBase: string;
}) {
	const key = name + path;
	const childValue = values[name];
	const { type, schema } = detectSchemaType(entrySchema, childValue);
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);
	const defaultValue = defaults[name];

	if (metadata?.visibleWhen) {
		const conditionValue = values[metadata.visibleWhen.field] ?? defaults[metadata.visibleWhen.field];
		if (conditionValue !== metadata.visibleWhen.value) {
			return null;
		}
	}

	const Renderer = getRenderer(type);

	if (Renderer === undefined) {
		return (
			<FormControl key={key}>
				<FormLabel>{name}</FormLabel>
				<span className="text-yellow-400 text-sm">Unknown field type '{type}'</span>
			</FormControl>
		);
	}

	const fullJsonPath = jsonPathBase ? `${jsonPathBase}.${name}` : name;

	return (
		<Renderer
			key={key}
			path={path}
			name={name}
			value={childValue}
			onChange={onChange}
			entrySchema={schema}
			jsonPath={fullJsonPath}
			getRenderer={getRenderer}
			defaultValue={defaultValue}
			metadata={metadata}
		/>
	);
}
