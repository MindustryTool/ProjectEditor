import type { PositionData } from "@project/schema";
import { SpritePreview } from "./SpritePreview";
import { EnginePreview } from "./EnginePreview";
import { ShootPreview } from "./ShootPreview";
import { PartPreview } from "./PartPreview";
import { DrawRegionPreview } from "./DrawRegionPreview";

export type PositionEditHandler = (xPath: string, yPath: string, x: number, y: number) => void;

export function PositionPreview({
	sprite,
	onPositionChange,
	hidden,
	onToggleVisibility,
}: {
	sprite: PositionData;
	onPositionChange?: PositionEditHandler;
	hidden?: boolean;
	onToggleVisibility?: () => void;
}) {
	switch (sprite.type) {
		case "sprite":
			return <SpritePreview sprite={sprite} onPositionChange={onPositionChange} hidden={hidden} onToggleVisibility={onToggleVisibility} />;
		case "engine":
			return <EnginePreview sprite={sprite} onPositionChange={onPositionChange} hidden={hidden} onToggleVisibility={onToggleVisibility} />;
		case "shoot":
			return <ShootPreview sprite={sprite} onPositionChange={onPositionChange} hidden={hidden} onToggleVisibility={onToggleVisibility} />;
		case "part":
			return <PartPreview sprite={sprite} onPositionChange={onPositionChange} hidden={hidden} onToggleVisibility={onToggleVisibility} />;
		case "draw-region":
			return <DrawRegionPreview sprite={sprite} onPositionChange={onPositionChange} hidden={hidden} onToggleVisibility={onToggleVisibility} />;
		default:
			return (
				<div className="w-full border p-8 rounded bg-card relative flex items-center justify-center">
					<span className="text-xs text-muted-foreground">[{sprite.type}]</span>
				</div>
			);
	}
}
