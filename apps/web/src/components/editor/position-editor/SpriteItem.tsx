import type { PositionData } from "@project/schema";
import { HJSON } from "@project/hjson";
import { useMemo } from "react";
import { PositionImage } from "./PositionImage";
import { EnginePositionPlaceholder, PositionPlaceholder } from "./PositionPlaceholder";
import { HitboxItem } from "./HitboxItem";
import { WaveTrailItem } from "./WaveTrailItem";

export function SpriteItem({
	region,
	write,
	onSelect,
	selectedKey,
}: {
	region: PositionData;
	write: (data: string | ((prev: string | null) => string)) => string;
	onSelect?: (key: string) => void;
	selectedKey?: string | null;
}) {
	const patch = useMemo(() => HJSON.patch(write), [write]);
	const handleDrag = (x: number, y: number) => {
		const px = Math.round(x * 10000) / 10000;
		const py = Math.round(y * 10000) / 10000;
		patch(region.position.x.path, (node, original, key) => node.patchValue(original, key, px));
		patch(region.position.y.path, (node, original, key) => node.patchValue(original, key, py));
	};

	const key = region.position.x.path;
	const isSelected = selectedKey === key;

	switch (region.type) {
		case "sprite":
			return (
				<PositionImage
					key={key}
					path={region.path}
					x={region.position.x.value * 4}
					y={-region.position.y.value * 4}
					mirror={region.mirror}
					onDrag={handleDrag}
					onSelect={onSelect}
					selectKey={key}
					isSelected={isSelected}
				/>
			);
		case "engine":
			return (
				<EnginePositionPlaceholder
					key={key}
					region={region}
					onDrag={handleDrag}
					onSelect={onSelect}
					isSelected={isSelected}
				/>
			);
		case "wave-trail":
			return (
				<WaveTrailItem
					key={key}
					region={region}
					write={write}
					onSelect={onSelect}
					isSelected={isSelected}
				/>
			);
		case "hitbox":
			return (
				<HitboxItem
					key={key}
					region={region}
					write={write}
					onSelect={onSelect}
					isSelected={isSelected}
				/>
			);
		default:
			return (
				<PositionPlaceholder
					key={key}
					region={region}
					onDrag={handleDrag}
					onSelect={onSelect}
					isSelected={isSelected}
				/>
			);
	}
}
