import type { EnginePositionData } from "@project/schema";
import type { PositionEditHandler } from "./types";
import { usePositionEdit } from "./usePositionEdit";
import { PreviewContainer } from "./PreviewContainer";
import { PositionInputs } from "./PositionInputs";

export function EnginePreview({
	sprite,
	onPositionChange,
	hidden,
	onToggleVisibility,
}: {
	sprite: EnginePositionData;
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
			<div className="text-muted-foreground text-xs">
				r={sprite.radius.value} rot={sprite.rotation.value}
			</div>
		</PreviewContainer>
	);
}
