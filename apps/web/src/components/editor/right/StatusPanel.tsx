import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { StatusHjsonSchema } from "@project/schema";

interface StatusPanelProps {
	path: string;
}

export function StatusPanel({ path }: StatusPanelProps) {
	return <FieldsRenderer path={path} schema={StatusHjsonSchema} />;
}
