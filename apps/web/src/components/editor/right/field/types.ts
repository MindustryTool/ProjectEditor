import type { HjsonNode } from "@project/hjson";
import type { AnySchema, SchemaMetadata, Type } from "@project/schema";

export type SchemaRendererProps = {
	name: string;
	path: string;
	value: unknown;
	entrySchema: AnySchema;
	jsonPath: string;
	defaultValue: unknown;
	metadata: SchemaMetadata | null;
	nested?: boolean;
	onChange: (jsonPath: string, updater: (parent: HjsonNode, original: string, key: string | number, root: HjsonNode) => string) => void;
	getRenderer: (type: Type) => SchemaRenderer | undefined;
};

export type SchemaRenderer = React.ComponentType<SchemaRendererProps>;

export function handleNumber(event: React.ChangeEvent<HTMLInputElement>) {
	const numValue = Number(event.currentTarget.value);
	const isValidNumber = !Number.isNaN(numValue) && String(numValue) === event.currentTarget.value.replace(/^0+/, "");

	return isValidNumber ? numValue : event.currentTarget.value;
}
