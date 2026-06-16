import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { SectorHjsonSchema } from "@project/schema";

interface SectorPanelProps {
	path: string;
}

export function SectorPanel({ path }: SectorPanelProps) {
	return <FieldsRenderer path={path} schema={SectorHjsonSchema} />;
}
