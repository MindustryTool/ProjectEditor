import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import type { SpritePositionData } from "@project/schema";
import { useCallback, useState } from "react";
import { PreviewContainer } from "./PreviewContainer";

export function SpritePreview({
	sprite,
	hidden,
	onToggleVisibility,
	isSelected,
}: {
	sprite: SpritePositionData;
	hidden?: boolean;
	onToggleVisibility?: () => void;
	isSelected?: boolean;
}) {
	const [size, setSize] = useState([0, 0]);
	const handleSize = useCallback((width: number, height: number) => setSize([width, height]), []);

	return (
		<PreviewContainer
			hidden={hidden}
			onToggleVisibility={onToggleVisibility}
			isSelected={isSelected}
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
