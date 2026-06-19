import type { PartPositionData } from "@project/schema";
import { PreviewContainer } from "./PreviewContainer";

export function PartPreview({
	sprite,
	hidden,
	onToggleVisibility,
	isSelected,
}: {
	sprite: PartPositionData;
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
				[part] {sprite.name ?? ""}
			</span>
			{sprite.mirror && (
				<span className="text-xs text-muted-foreground">mirror</span>
			)}
			<div className="text-muted-foreground text-xs">part</div>
		</PreviewContainer>
	);
}
