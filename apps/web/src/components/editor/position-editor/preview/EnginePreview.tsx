import type { EnginePositionData } from "@project/schema";
import { PreviewContainer } from "./PreviewContainer";

export function EnginePreview({
	sprite,
	hidden,
	onToggleVisibility,
	isSelected,
}: {
	sprite: EnginePositionData;
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
			<div className="text-muted-foreground text-xs">
				r={sprite.radius.value} rot={sprite.rotation.value}
			</div>
		</PreviewContainer>
	);
}
