import type { PositionData } from "@project/schema";
import { SpritePreview } from "./SpritePreview";
import { EnginePreview } from "./EnginePreview";
import { ShootPreview } from "./ShootPreview";
import { PartPreview } from "./PartPreview";
import { DrawRegionPreview } from "./DrawRegionPreview";
import { HitboxPreview } from "./HitboxPreview";

export function PositionPreview({
	sprite,
	hidden,
	onToggleVisibility,
	isSelected,
}: {
	sprite: PositionData;
	hidden?: boolean;
	onToggleVisibility?: () => void;
	isSelected?: boolean;
}) {
	switch (sprite.type) {
		case "sprite":
			return (
				<SpritePreview sprite={sprite} hidden={hidden} onToggleVisibility={onToggleVisibility} isSelected={isSelected} />
			);
		case "engine":
			return (
				<EnginePreview sprite={sprite} hidden={hidden} onToggleVisibility={onToggleVisibility} isSelected={isSelected} />
			);
		case "shoot":
			return (
				<ShootPreview sprite={sprite} hidden={hidden} onToggleVisibility={onToggleVisibility} isSelected={isSelected} />
			);
		case "part":
			return <PartPreview sprite={sprite} hidden={hidden} onToggleVisibility={onToggleVisibility} isSelected={isSelected} />;
		case "draw-region":
			return (
				<DrawRegionPreview
					sprite={sprite}
					hidden={hidden}
					onToggleVisibility={onToggleVisibility}
					isSelected={isSelected}
				/>
			);
		case "hitbox":
			return (
				<HitboxPreview
					sprite={sprite}
					hidden={hidden}
					onToggleVisibility={onToggleVisibility}
					isSelected={isSelected}
				/>
			);
		default:
			return (
				<div className={`w-full border p-8 rounded bg-card relative flex items-center justify-center ${isSelected ? "ring-2 ring-primary" : ""}`}>
					<span className="text-xs text-muted-foreground">[{sprite.type}]</span>
				</div>
			);
	}
}
