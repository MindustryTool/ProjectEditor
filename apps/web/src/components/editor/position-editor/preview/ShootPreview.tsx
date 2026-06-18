import type { ShootPositionData } from "@project/schema";
import type { PositionEditHandler } from "./PositionPreview";
import { usePositionEdit } from "./usePositionEdit";
import { PreviewContainer } from "./PreviewContainer";
import { PositionInputs } from "./PositionInputs";

export function ShootPreview({
	sprite,
	onPositionChange,
	hidden,
	onToggleVisibility,
}: {
	sprite: ShootPositionData;
	onPositionChange?: PositionEditHandler;
	hidden?: boolean;
	onToggleVisibility?: () => void;
}) {
	const posEdit = usePositionEdit(sprite.position, onPositionChange);
	const name = sprite.weaponName;
	return (
		<PreviewContainer
			hidden={hidden}
			onToggleVisibility={onToggleVisibility}
			onClick={() => posEdit.scrollTo(sprite.position.x.path)}
			footer={<PositionInputs {...posEdit} />}
		>
			{sprite.mirror && (
				<span className="text-xs text-nowrap text-muted-foreground">mirror</span>
			)}
			<div className="text-muted-foreground text-xs">
				weapon={name}
			</div>
		</PreviewContainer>
	);
}
