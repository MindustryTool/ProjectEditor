import type { PositionData } from "@project/schema";
import { updatePositionData } from "#/components/editor/position-editor/utils";
import { PositionImage } from "./PositionImage";
import { EnginePositionPlaceholder, PositionPlaceholder } from "./PositionPlaceholder";

export function SpriteItem({ region, write }: { region: PositionData; write: (data: string | ((prev: string | null) => string)) => string }) {
	const handleDrag = (x: number, y: number) => {
		write((prev) => updatePositionData(prev ?? "", region.position.x.path, region.position.y.path, x, y) ?? prev ?? "");
	};

	switch (region.type) {
		case "sprite":
			return (
				<PositionImage
					key={region.position.x.path}
					path={region.path}
					x={region.position.x.value * 4}
					y={-region.position.y.value * 4}
					mirror={region.mirror}
					onDrag={handleDrag}
				/>
			);
		case "engine":
			return <EnginePositionPlaceholder key={region.position.x.path} region={region} onDrag={handleDrag} />;
		default:
			return <PositionPlaceholder key={region.position.x.path} region={region} onDrag={handleDrag} />;
	}
}
