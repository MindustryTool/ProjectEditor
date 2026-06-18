import type { DrawPositionData } from "@project/schema";
import type { PositionEditHandler } from "./types";
import { usePositionEdit } from "./usePositionEdit";
import { PreviewContainer } from "./PreviewContainer";
import { PositionInputs } from "./PositionInputs";

export function DrawRegionPreview({
	sprite,
	onPositionChange,
	hidden,
	onToggleVisibility,
}: {
	sprite: DrawPositionData;
	onPositionChange?: PositionEditHandler;
	hidden?: boolean;
	onToggleVisibility?: () => void;
}) {
	const posEdit = usePositionEdit(sprite.position, onPositionChange);

	return (
		<PreviewContainer
			hidden={hidden}
			onToggleVisibility={onToggleVisibility}
			onClick={() => posEdit.scrollTo(sprite.position.x.path)}
			footer={<PositionInputs {...posEdit} />}
		>
			<span className="absolute top-1 left-1 text-xs text-muted-foreground">
				[draw-region] {sprite.name ?? ""} {sprite.suffix ?? ""}
			</span>
			<div className="text-muted-foreground text-sm">draw-region</div>
		</PreviewContainer>
	);
}
