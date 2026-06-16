import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { ItemHjsonSchema } from "@project/schema";

interface ItemPanelProps {
	path: string;
}

export function ItemPanel({ path }: ItemPanelProps) {
	return <FieldsRenderer path={path} schema={ItemHjsonSchema} />;
}
