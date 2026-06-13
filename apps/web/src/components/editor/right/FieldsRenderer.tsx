import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormLabel } from "#/components/ui/form";
import { useFileString } from "@project/core";
import type { HjsonNode } from "@project/hjson";
import { HJSON } from "@project/hjson";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import {
	resolveSchema,
	detectSchemaType,
	getSchemaEntries,
	getSchemaMetadata,
	type AnySchema,
	type SchemaFn,
	getDefaults,
} from "@project/schema";

import { FieldCategory } from "#/components/editor/right/field/FieldCategory";
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
	const { data, isLoading, write } = useFileString(path);
	const { contents } = useProjectContext();
	const [render, setRender] = useState(30);
	const [filter, setFilter] = useLocalStorage("property-filter", "");
	const { t } = useTranslation();

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

	const resolvedSchema = resolveSchema(typeof schema === "function" ? schema(contents) : schema, node.valueOf());
	const entries = getSchemaEntries(resolvedSchema);
	const filtered = filter ? levenshtein(entries, ([name]) => name, filter, 10) : entries;

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
				<Children
					entries={filtered} //
					node={node}
					path={path}
					onChange={onChange}
					render={render}
					setRender={setRender}
				/>
			</ErrorBoundary>
		</Suspense>
	);
});

function Children({
	entries,
	node,
	path,
	onChange,
	render,
	setRender,
}: {
	entries: [string, AnySchema][];
	node: HjsonNode;
	path: string;
	onChange: SchemaRendererProps["onChange"];
	render: number;
	setRender: (callback: (render: number) => number) => void;
}) {
	const endRef = React.useRef<HTMLDivElement>(null);
	const elements: React.ReactNode[] = [];
	const seen = new Set<string>();
	let lastCategory: string | undefined;

	for (const [name, entrySchema] of entries.slice(0, render)) {
		const key = name + path;
		const childNode = node.get(name);
		const defaultValue = getDefaults(entrySchema, childNode.valueOf());
		const value = childNode.isMissing() ? undefined : childNode.valueOf();
		const { type, schema } = detectSchemaType(entrySchema, value);
		const metadata = getSchemaMetadata(entrySchema);

		if (metadata?.visibleWhen) {
			const refNode = node.get(metadata.visibleWhen.field);
			if (refNode.isMissing()) {
				continue;
			}

			if (refNode.isValue() && refNode.valueOf() !== metadata.visibleWhen.value) {
				continue;
			}
		}

		if (metadata?.category && metadata.category !== lastCategory) {
			if (seen.has(metadata.category)) {
				continue;
			}

			seen.add(metadata.category);
			elements.push(<FieldCategory key={`cat-${metadata.category}`} category={metadata.category} />);
			lastCategory = metadata.category;
		}

		const Renderer = getRenderer(type);

		if (Renderer === undefined) {
			elements.push(
				<FormControl key={key}>
					<FormLabel>{name}</FormLabel>
					<span className="text-yellow-400 text-sm">Unknown field type '{type}'</span>
				</FormControl>,
			);
		} else {
			elements.push(
				<Renderer
					key={key}
					path={path}
					name={name}
					value={value}
					onChange={onChange}
					entrySchema={schema}
					jsonPath={name}
					getRenderer={getRenderer}
					defaultValue={defaultValue}
				/>,
			);
		}
	}

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

	return (
		<>
			{elements}
			<div className="end w-full invisible" ref={endRef}></div>
		</>
	);
}
