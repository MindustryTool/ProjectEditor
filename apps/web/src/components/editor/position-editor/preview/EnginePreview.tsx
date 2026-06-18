import type { EnginePositionData } from "@project/schema";
import type { PositionEditHandler } from "./PositionPreview";
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
			<span className="absolute top-1 left-1 text-xs text-muted-foreground">[engine]</span>
			<div className="text-muted-foreground text-sm">
				r={sprite.radius.value} rot={sprite.rotation.value}
			</div>
		</PreviewContainer>
	);
}
