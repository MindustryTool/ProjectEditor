import type { DrawPositionData } from "@project/schema";
import { PreviewContainer } from "./PreviewContainer";

export function DrawRegionPreview({
	sprite,
	hidden,
	onToggleVisibility,
	isSelected,
}: {
	sprite: DrawPositionData;
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
				[draw-region] {sprite.name ?? ""} {sprite.suffix ?? ""}
			</span>
			<div className="text-muted-foreground text-sm">draw-region</div>
		</PreviewContainer>
	);
}
