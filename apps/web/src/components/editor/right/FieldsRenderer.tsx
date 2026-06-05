import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormLabel } from "#/components/ui/form";
import { useFileString } from "@project/core";
import { HJSON, HjsonNode } from "@project/hjson";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { schemaRenderers } from "./field";
import React, { useCallback } from "react";
import { resolveSchema, detectSchemaType, getSchemaEntries, getSchemaMetadata, type AnySchema, type SchemaFn } from "@project/schema";
import * as v from "valibot";

export type SchemaRendererProps = {
	name: string;
	path: string;
	value: unknown;
	entrySchema: AnySchema;
	jsonPath: string;
	onChange: (jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => void;
};

export type SchemaRenderer = React.ComponentType<SchemaRendererProps>;

interface FieldsRendererProps {
	path: string;
	schema: AnySchema | SchemaFn;
}

export const FieldsRenderer = React.memo(function FieldsRenderer({ path, schema }: FieldsRendererProps) {
	const { data, isLoading, write } = useFileString(path);
	const { contents } = useProjectContext();

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
		console.error("Error parsing JSON:", error);
		return null;
	}

	if (!node.isObject()) {
		return null;
	}

	const resolvedSchema = resolveSchema(typeof schema === "function" ? schema(contents) : schema, node.valueOf());
	const entries = getSchemaEntries(resolvedSchema);

	return (
		<ErrorBoundary>
			{entries.map(([name, entrySchema]) => {
				const key = name + path;
				const childNode = node.get(name);
				const value = childNode.isMissing() ? v.getDefaults(entrySchema) : childNode.valueOf();
				const type = detectSchemaType(entrySchema, value);

				const Renderer = schemaRenderers[type];

				if (Renderer === undefined) {
					return (
						<FormControl>
							<FormLabel>{name}</FormLabel>
							<span key={key} className="text-yellow-400 text-sm">
								Unknown field type {type}
							</span>
						</FormControl>
					);
				}

				const metadata = getSchemaMetadata(entrySchema);

				if (metadata?.visibleWhen) {
					const refNode = node.get(metadata.visibleWhen.field);
					if (refNode.isMissing()) return null;
					if (refNode.isValue() && refNode.valueOf() !== metadata.visibleWhen.value) return null;
				}

				return (
					<Renderer //
						key={key}
						path={path}
						name={name}
						value={value}
						onChange={onChange}
						entrySchema={entrySchema}
						jsonPath={name}
					/>
				);
			})}
		</ErrorBoundary>
	);
});
