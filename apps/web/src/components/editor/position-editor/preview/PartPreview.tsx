import type { PartPositionData } from "@project/schema";
import type { PositionEditHandler } from "./types";
import { usePositionEdit } from "./usePositionEdit";
import { PreviewContainer } from "./PreviewContainer";
import { PositionInputs } from "./PositionInputs";

export function PartPreview({
	sprite,
	onPositionChange,
	hidden,
	onToggleVisibility,
}: {
	sprite: PartPositionData;
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
				[part] {sprite.name ?? ""}
			</span>
			{sprite.mirror && (
				<span className="absolute top-1 right-8 text-xs text-muted-foreground">mirror</span>
			)}
			<div className="text-muted-foreground text-sm">part</div>
		</PreviewContainer>
	);
}
