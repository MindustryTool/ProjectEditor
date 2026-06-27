import type { HitboxPositionData } from "@project/schema";
import { PreviewContainer } from "./PreviewContainer";

export function HitboxPreview({
	sprite,
	hidden,
	onToggleVisibility,
	isSelected,
}: {
	sprite: HitboxPositionData;
	hidden?: boolean;
	onToggleVisibility?: () => void;
	isSelected?: boolean;
}) {
	return (
		<PreviewContainer
			hidden={hidden}
			onToggleVisibility={onToggleVisibility}
			isSelected={isSelected}
		>
			<span className="text-xs text-muted-foreground">
				[hitbox] size={sprite.size.value}
			</span>
		</PreviewContainer>
	);
}
