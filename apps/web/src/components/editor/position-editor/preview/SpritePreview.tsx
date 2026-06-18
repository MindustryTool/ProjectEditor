import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import type { SpritePositionData } from "@project/schema";
import { useCallback, useState } from "react";
import type { PositionEditHandler } from "./types";
import { usePositionEdit } from "./usePositionEdit";
import { PreviewContainer } from "./PreviewContainer";
import { PositionInputs } from "./PositionInputs";

export function SpritePreview({
	sprite,
	onPositionChange,
	hidden,
	onToggleVisibility,
}: {
	sprite: SpritePositionData;
	onPositionChange?: PositionEditHandler;
	hidden?: boolean;
	onToggleVisibility?: () => void;
}) {
	const [size, setSize] = useState([0, 0]);
	const handleSize = useCallback((width: number, height: number) => setSize([width, height]), []);
	const posEdit = usePositionEdit(sprite.position, onPositionChange);

	return (
		<PreviewContainer
			hidden={hidden}
			onToggleVisibility={onToggleVisibility}
			onClick={() => posEdit.scrollTo(sprite.position.x.path)}
			footer={<PositionInputs {...posEdit} />}
		>
			<span className="text-xs text-muted-foreground flex gap-1">
				<span>
					{size[0]}x{size[1]}
				</span>
				{sprite.mirror && <span className="text-xs text-muted-foreground">mirror</span>}
			</span>
			<ImageFilePreview className="object-contain w-fit m-auto py-4" path={sprite.path} onSize={handleSize} />
		</PreviewContainer>
	);
}
