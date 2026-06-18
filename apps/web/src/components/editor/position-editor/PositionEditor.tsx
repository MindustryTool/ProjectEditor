import { PositionCanvas } from "./PositionCanvas";

export function PositionEditor({ path }: { path: string }) {
	return (
		<div className="w-full h-full overflow-hidden relative flex border rounded mb-1.5">
			<PositionCanvas path={path} />
		</div>
	);
}
