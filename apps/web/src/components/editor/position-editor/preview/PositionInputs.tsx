import { PositionField } from "./PositionField";

export function PositionInputs({
	editX,
	setEditX,
	editY,
	setEditY,
	commitX,
	commitY,
	handleChangeX,
	handleChangeY,
	position,
}: {
	editX: string;
	setEditX: (v: string) => void;
	editY: string;
	setEditY: (v: string) => void;
	commitX: () => void;
	commitY: () => void;
	handleChangeX: (v: string) => void;
	handleChangeY: (v: string) => void;
	position: { x: { value: number }; y: { value: number } };
}) {
	return (
		<>
			<PositionField
				label="x"
				value={editX}
				onChange={handleChangeX}
				onCommit={commitX}
				onRevert={() => setEditX(String(position.x.value))}
			/>
			<PositionField
				label="y"
				value={editY}
				onChange={handleChangeY}
				onCommit={commitY}
				onRevert={() => setEditY(String(position.y.value))}
			/>
		</>
	);
}
