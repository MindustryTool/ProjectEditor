import { usePath } from "#/hooks/use-path";
import { Button } from "#/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { PositionData } from "@project/schema";
import { PositionPreview } from "#/components/editor/position-editor/preview";

export function PositionSidebar({
	sprites,
	path,
	hiddenSprites,
	onToggleSprite,
	selectedPath,
}: {
	sprites: PositionData[];
	path: string;
	hiddenSprites: Set<string>;
	onToggleSprite: (key: string) => void;
	selectedPath?: string | null;
}) {
	const [, setPath] = usePath();

	return (
		<div className="h-full flex flex-col gap-2">
			<Button variant="outline" size="sm" className="shrink-0" onClick={() => setPath({ path, type: "text", jsonPath: null })}>
				<ArrowLeft className="h-4 w-4 mr-1" />
				Back to text editor
			</Button>
			<div className="flex-1 overflow-y-auto flex flex-col gap-2">
				{sprites.map((sprite) => (
					<PositionPreview
						key={sprite.position.x.path}
						sprite={sprite}
						hidden={hiddenSprites.has(sprite.position.x.path)}
						onToggleVisibility={() => onToggleSprite(sprite.position.x.path)}
						isSelected={selectedPath === sprite.position.x.path}
					/>
				))}
			</div>
		</div>
	);
}
