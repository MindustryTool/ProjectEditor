import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormLabel } from "#/components/ui/form";
import { useFileString } from "@project/core";
import { HJSON, HjsonNode } from "@project/hjson";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { resolveSchema, detectSchemaType, getSchemaEntries, getSchemaMetadata, type AnySchema, type SchemaFn } from "@project/schema";
import * as v from "valibot";

import { FieldCategory } from "#/components/editor/right/field/FieldCategory";
import { getRenderer } from "#/components/editor/right/field/registry";

interface FieldsRendererProps {
	path: string;
	schema: AnySchema | SchemaFn;
}

export const FieldsRenderer = React.memo(function FieldsRenderer({ path, schema }: FieldsRendererProps) {
	const { data, isLoading, write } = useFileString(path);
	const { contents } = useProjectContext();
	const [render, setRender] = useState(30);

	const onChange = useCallback(
		(jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => {
			write((content: string | null) => {
				if (content === null) {
					throw new Error("Attempting to write into unloaded file");
				}

				const root = HJSON.parseWithCache(content);
				const splitAt = Math.max(jsonPath.lastIndexOf("."), jsonPath.lastIndexOf("["));
				if (splitAt === -1) {
					return updater(root, jsonPath, content, root);
				}

				const parentPath = jsonPath.slice(0, splitAt);
				const key = jsonPath.slice(splitAt + 1).replace(/]$/, "");
				const parentInfo = root.path(parentPath);

				if (!parentInfo) {
					throw new Error(`parent path not found: ${parentPath}`);
				}

				const parent = parentInfo.value;

				if (!(parent instanceof HjsonNode)) {
					throw new Error(`expected node at ${parentPath}`);
				}

				return updater(parent, key, content, root);
			});
		},
		[write],
	);

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

	return (
		<Suspense>
			<ErrorBoundary>
				<Child entries={entries} node={node} path={path} onChange={onChange} render={render} setRender={setRender} />
			</ErrorBoundary>
		</Suspense>
	);
});

function Child({
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
	onChange: (jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => void;
	render: number;
	setRender: (callback: (render: number) => number) => void;
}) {
	const endRef = React.useRef<HTMLDivElement>(null);
	const elements: React.ReactNode[] = [];
	let lastCategory: string | undefined;
	let count = 0;

	for (const [name, entrySchema] of entries) {
		const key = name + path;
		const childNode = node.get(name);
		const value = childNode.isMissing() ? v.getDefaults(entrySchema) : childNode.valueOf();
		const { type, schema } = detectSchemaType(entrySchema, value);
		const metadata = getSchemaMetadata(entrySchema);

		if (count > render) break;

		count++;

		if (metadata?.visibleWhen) {
			const refNode = node.get(metadata.visibleWhen.field);
			if (refNode.isMissing()) continue;
			if (refNode.isValue() && refNode.valueOf() !== metadata.visibleWhen.value) continue;
		}

		if (metadata?.category && metadata.category !== lastCategory) {
			elements.push(<FieldCategory key={`cat-${metadata.category}`} category={metadata.category} />);
			lastCategory = metadata.category;
		}

		const Renderer = getRenderer(type);

		if (Renderer === undefined) {
			elements.push(
				<FormControl key={key}>
					<FormLabel>{name}</FormLabel>
					<span className="text-yellow-400 text-sm">Unknown field type {type}</span>
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
				/>,
			);
		}
	}

	useEffect(() => {
		const element = endRef.current;
		if (!element) return;

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
