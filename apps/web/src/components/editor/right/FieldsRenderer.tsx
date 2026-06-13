import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormLabel } from "#/components/ui/form";
import { useFileString } from "@project/core";
import type { HjsonNode } from "@project/hjson";
import { HJSON } from "@project/hjson";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
	resolveSchema,
	detectSchemaType,
	getSchemaEntries,
	getSchemaMetadata,
	type AnySchema,
	type SchemaFn,
	getDefaults,
} from "@project/schema";

import { getRenderer } from "#/components/editor/right/field/registry";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "usehooks-ts";
import { levenshtein } from "#/lib/utils";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";

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

	const onChange = useCallback(
		(jsonPath: string, updater: (node: HjsonNode, original: string, key: string | number, root: HjsonNode) => string) => {
			return HJSON.patch(write)(jsonPath, updater);
		},
		[write],
	);

	useEffect(() => {
		if (filter) {
			setRender(30);
		}
	}, [filter]);

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
				threshold: 0.1,
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

	const resolvedSchema = resolveSchema(typeof schema === "function" ? schema(contents) : schema, values)
	const entries = getSchemaEntries(resolvedSchema);
	const filtered = (filter ? levenshtein(entries, ([name]) => name, filter, 10) : entries).slice(0, render);
	const defaults = getDefaults(resolvedSchema, values, true) as Record<string, unknown>;

	return (
		<Suspense>
			<ErrorBoundary>
				<div className="grid gap-2">
					<span className="first-letter:uppercase flex items-center gap-2 text-sm leading-none font-medium select-none">
						{t("editor.search")}
					</span>
					<InputGroup>
						<InputGroupAddon>
							<Search className="size-4" />
						</InputGroupAddon>
						<InputGroupInput //
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							placeholder={t("editor.search")}
						/>
					</InputGroup>
				</div>
				{filtered.map(([name, entrySchema]) => (
					<Child
						key={name}
						name={name}
						entrySchema={entrySchema}
						path={path}
						onChange={onChange}
						values={values}
						defaults={defaults}
					/>
				))}
				<div className="end w-full invisible" ref={endRef}></div>
			</ErrorBoundary>
		</Suspense>
	);
});

function Child({
	name,
	entrySchema,
	values,
	path,
	onChange,
	defaults,
}: {
	name: string;
	entrySchema: AnySchema;
	values: Record<string, unknown>;
	defaults: Record<string, unknown>;
	path: string;
	onChange: SchemaRendererProps["onChange"];
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

	return (
		<Renderer
			key={key}
			path={path}
			name={name}
			value={childValue}
			onChange={onChange}
			entrySchema={schema}
			jsonPath={name}
			getRenderer={getRenderer}
			defaultValue={defaultValue}
			metadata={metadata}
		/>
	);
}
