import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormLabel } from "#/components/ui/form";
import { useFileString, useProjectSession, selectCurrentJsonPath } from "@project/core";
import type { HjsonNode } from "@project/hjson";
import { HJSON } from "@project/hjson";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	resolveSchema,
	detectSchemaType,
	getSchemaEntries,
	getSchemaFromPath,
	type AnySchema,
	type SchemaFn,
	getDefaults,
	type SchemaMetadata,
	getSchemaMetadata,
} from "@project/schema";

import { getRenderer } from "#/components/editor/right/field/registry";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { Search, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
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
	const [filters, setFilters] = useState<Record<string, string>>({});
	const { contents } = useProjectContext();
	const fileName = useFileName();
	const scrollTopRef = useRef<Map<string | null, number>>(new Map());
	const scrollRef = useRef<HTMLDivElement>(null);
	const currentJsonPath = useProjectSession(selectCurrentJsonPath);
	const setCurrentJsonPath = useProjectSession((s) => s.setCurrentJsonPath);

	const onChange = useCallback(
		(jsonPath: string, updater: (node: HjsonNode, original: string, key: string | number, root: HjsonNode) => string) => {
			return HJSON.patch(write)(jsonPath, updater);
		},
		[write],
	);

	const filter = filters[currentJsonPath || ""] || "";
	const setFilter = useCallback(
		(val: string) => {
			setFilters((prev) => ({ ...prev, [currentJsonPath || ""]: val }));
		},
		[currentJsonPath],
	);

	const handleScroll = useCallback(
		(event: React.UIEvent) => {
			if (event.currentTarget.scrollTop + event.currentTarget.clientHeight >= event.currentTarget.scrollHeight - 300) {
				setRender((prev) => prev + 30);
			}
			scrollTopRef.current.set(currentJsonPath, event.currentTarget.scrollTop);
		},
		[currentJsonPath],
	);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollTopRef.current.get(currentJsonPath) || 0;
		}
	}, [currentJsonPath]);

	const result = useMemo(() => {
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

		return {
			activeValues,
			breadcrumbSegments,
			filtered,
			activeDefaults,
		};
	}, [contents, currentJsonPath, data, filter, isLoading, render, schema]);

	if (result === null) {
		return null;
	}

	if (typeof result === "string") {
		return result;
	}

	const { activeValues, breadcrumbSegments, filtered, activeDefaults } = result;

	return (
		<div className="space-y-4 h-full w-full overflow-y-auto relative pb-6" onScroll={handleScroll} ref={scrollRef}>
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
					<div className="px-2 flex flex-col gap-6">
						{filtered.map(([name, entrySchema]) => {
							const metadata = getSchemaMetadata(entrySchema);

							if (metadata?.visibleWhen) {
								const conditionValue = activeValues[metadata.visibleWhen.field] ?? activeDefaults[metadata.visibleWhen.field];
								if (conditionValue !== metadata.visibleWhen.value) {
									return null;
								}
							}

							return (
								<Child
									key={name}
									name={name}
									entrySchema={entrySchema}
									path={path}
									onChange={onChange}
									value={activeValues[name]}
									defaultValue={activeDefaults[name]}
									metadata={metadata}
									jsonPathBase={currentJsonPath ?? ""}
								/>
							);
						})}
					</div>
				</ErrorBoundary>
			</Suspense>
		</div>
	);
});

const Child = React.memo(function Child({
	name,
	entrySchema,
	value,
	path,
	onChange,
	defaultValue,
	jsonPathBase,
	metadata,
}: {
	name: string;
	entrySchema: AnySchema;
	value: unknown;
	defaultValue: unknown;
	path: string;
	onChange: SchemaRendererProps["onChange"];
	metadata: SchemaMetadata | null;
	jsonPathBase: string;
}) {
	const key = name + path;
	const { type, schema } = useMemo(() => detectSchemaType(entrySchema, value), [entrySchema, value]);

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
			value={value}
			onChange={onChange}
			entrySchema={schema}
			jsonPath={fullJsonPath}
			getRenderer={getRenderer}
			defaultValue={defaultValue}
			metadata={metadata}
		/>
	);
});
