import type { HjsonNode } from "@project/hjson";
import type { AnySchema, Type } from "@project/schema";

export type SchemaRendererProps = {
	name: string;
	path: string;
	value: unknown;
	entrySchema: AnySchema;
	jsonPath: string;
	onChange: (jsonPath: string, updater: (parent: HjsonNode, key: string, original: string, root: HjsonNode) => string) => void;
	getRenderer: (type: Type) => SchemaRenderer | undefined;
};

export type SchemaRenderer = React.ComponentType<SchemaRendererProps>;

