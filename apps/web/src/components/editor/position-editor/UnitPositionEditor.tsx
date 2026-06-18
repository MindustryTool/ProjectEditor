import { PositionEditor } from "#/components/editor/position-editor/PositionEditor";
import { UnitHjsonSchema } from "@project/schema";

export function UnitPositionEditor({ striped }: { striped: string }) {
	return <PositionEditor path={striped} schema={UnitHjsonSchema} />;
}
