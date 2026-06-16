import { FieldsRenderer } from "#/components/editor/right/FieldsRenderer";
import { LiquidHjsonSchema } from "@project/schema";

interface LiquidPanelProps {
	path: string;
}

export function LiquidPanel({ path }: LiquidPanelProps) {
	return <FieldsRenderer path={path} schema={LiquidHjsonSchema} />;
}
