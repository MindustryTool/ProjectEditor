import { PositionEditor } from "#/components/editor/position-editor/PositionEditor";

export function UnitPositionEditor({ striped }: { striped: string }) {
	return <PositionEditor path={striped} />;
}
