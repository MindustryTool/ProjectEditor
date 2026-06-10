import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormLabel } from "#/components/ui/form";
import { useFileString } from "@project/core";
import type { HjsonNode } from "@project/hjson";
import { HJSON } from "@project/hjson";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
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
	const formatRef = useRef<NodeJS.Timeout>(null);

	const onChange = useCallback(
		(jsonPath: string, updater: (node: HjsonNode, original: string, key: string | number, root: HjsonNode) => string) => {
			const result = write((content: string | null) => {
				if (content === null) {
					throw new Error("Attempting to write into unloaded file");
				}

				let root = HJSON.parseWithCache(content);

				const segments = jsonPath
					.split(/[.\]\[]/)
					.filter((s) => s.trim().length > 0)
					.map((s) => {
						const num = Number(s);
						return Number.isInteger(num) && String(num) === s ? num : s;
					});

				if (segments.length === 0) {
					throw new Error(`jsonPath is empty: ${jsonPath}`);
				}

				if (segments.length === 1) {
					return updater(root, content, segments[0]!, root);
				}

				while (true) {
					let parent = root;
					let modified = false;

					for (let i = 0; i < segments.length - 1; i++) {
						const currentKey = segments[i]!;
						const nextKey = segments[i + 1]!;

						const child = parent.get(currentKey);

						const container = typeof nextKey === "number" ? [] : {};

						if (child.isMissing()) {
							if (parent.isObject() && typeof currentKey === "string") {
								content = parent.insertField(content!, currentKey, container);
							} else if (parent.isArray() && typeof currentKey === "number") {
								content = parent.insertElement(content!, currentKey, container);
							} else {
								throw new Error(`Invalid key '${currentKey}' for parent type '${parent.constructor.name}'`);
							}

							root = HJSON.parseWithCache(content);
							modified = true;
							break;
						}

						if (child.isValue() && i < segments.length - 1) {
							if (parent.isObject() && typeof currentKey === "string") {
								content = parent.patchValue(content!, currentKey, container);
							} else if (parent.isArray() && typeof currentKey === "number") {
								content = parent.patchValue(content!, currentKey, container);
							} else {
								throw new Error(`Cannot replace value node at '${segments.slice(0, i + 1).join(".")}'`);
							}

							root = HJSON.parseWithCache(content);
							modified = true;
							break;
						}

						parent = child;
					}

					if (modified) {
						continue;
					}

					const key = segments[segments.length - 1]!;

					return updater(parent, content, key, root);
				}
			});

			if (formatRef.current) {
				clearTimeout(formatRef.current);
				formatRef.current = null;
			}

			formatRef.current = setTimeout(() => {
				const formatted = HJSON.format(result);
				if (formatted !== result) {
					write(formatted);
				}
			}, 3000);
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
		const value = childNode.isMissing() ? defaultValue : childNode.valueOf();
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
