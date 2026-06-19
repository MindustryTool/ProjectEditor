import type { ShootPositionData } from "@project/schema";
import { PreviewContainer } from "./PreviewContainer";

export function ShootPreview({
	sprite,
	hidden,
	onToggleVisibility,
	isSelected,
}: {
	sprite: ShootPositionData;
	hidden?: boolean;
	onToggleVisibility?: () => void;
	isSelected?: boolean;
}) {
	const name = sprite.weaponName;
	return (
		<PreviewContainer
			hidden={hidden}
			onToggleVisibility={onToggleVisibility}
			isSelected={isSelected}
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
