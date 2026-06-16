import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { BlockHjsonSchema } from "@project/schema";

interface BlockPanelProps {
	path: string;
}

export function BlockPanel({ path }: BlockPanelProps) {
	return <FieldsRenderer path={path} schema={BlockHjsonSchema} />;
}
