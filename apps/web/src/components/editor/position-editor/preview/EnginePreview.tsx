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
			<span className="text-xs text-muted-foreground">
				[engine] x={sprite.position.x.value} y={sprite.position.y.value} radius={sprite.radius.value} rotation={sprite.rotation.value}
			</span>
		</PreviewContainer>
	);
}
