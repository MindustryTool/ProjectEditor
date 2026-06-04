import { ErrorBoundary } from "#/components/ui/error-boundary";
import { FormControl, FormLabel } from "#/components/ui/form";
import { useFileString } from "@project/core";
import { HJSON, HjsonNode } from "@project/hjson";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { schemaRenderers } from "./field";
import React, { useCallback, useMemo, useState } from "react";
import {
	resolveSchema,
	detectSchemaType,
	getSchemaEntries,
	getSchemaMetadata,
	type AnySchema,
	type SchemaFn,
} from "@project/schema";
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

type FieldsRendererContextType = {
	tabs: SchemaRendererProps[];
	current: SchemaRendererProps | null;
	enter: (tab: SchemaRendererProps) => void;
	pop: () => void;
};

const FieldsRendererContext = React.createContext<FieldsRendererContextType>({
	tabs: [],
	current: null,
	enter: () => {},
	pop: () => {},
});

export const useFieldsRenderer = () => React.useContext(FieldsRendererContext);

export const FieldsRenderer = React.memo(function FieldsRenderer({ path, schema }: FieldsRendererProps) {
	const { data, isLoading, write } = useFileString(path);
	const { contents } = useProjectContext();
	const [tabs, setTabs] = useState<SchemaRendererProps[]>([]);

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

	const context = useMemo(
		() => ({
			tabs,
			current: tabs[tabs.length - 1] || null,
			enter: (tab: SchemaRendererProps) => setTabs([...tabs, tab]),
			pop: () => setTabs(tabs.slice(0, -1)),
		}),
		[tabs, setTabs],
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

	if (tabs.length > 0) {
		const lastTab = tabs[tabs.length - 1]!;
		const { name, value, jsonPath, entrySchema, onChange } = lastTab;
		const type = detectSchemaType(entrySchema, value);

		const Renderer = schemaRenderers[type];

		if (Renderer === undefined) {
			return (
				<FormControl>
					<FormLabel>{name}</FormLabel>
					<span key={name} className="text-yellow-400 text-sm">
						Unknown field type {type}
					</span>
				</FormControl>
			);
		}

		return (
			<FieldsRendererContext.Provider value={context}>
				<Renderer //
					key={name + path}
					path={path}
					name={name}
					value={value}
					onChange={onChange}
					entrySchema={entrySchema}
					jsonPath={jsonPath}
				/>
			</FieldsRendererContext.Provider>
		);
	}

	const resolvedSchema = resolveSchema(typeof schema === "function" ? schema(contents) : schema, node.valueOf());
	const entries = getSchemaEntries(resolvedSchema);

	return (
		<ErrorBoundary>
			<FieldsRendererContext.Provider value={context}>
				{entries.map(([name, entrySchema]) => {
					const key = name + path;
					const childNode = node.get(name);
					const value = childNode.isMissing() ? v.getDefault(entrySchema) : childNode.valueOf();
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
			</FieldsRendererContext.Provider>
		</ErrorBoundary>
	);
});
