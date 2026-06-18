import { usePath } from "#/hooks/use-path";
import { Button } from "#/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PositionPreview, type PositionEditHandler } from "./preview/PositionPreview";
import { updatePositionData } from "./utils";
import type { PositionData } from "@project/schema";

export function PositionSidebar({
	sprites,
	path,
	data,
	write,
	hiddenSprites,
	onToggleSprite,
}: {
	sprites: PositionData[];
	path: string;
	data: string | null | undefined;
	write: (data: string | ((prev: string | null) => string)) => string;
	hiddenSprites: Set<string>;
	onToggleSprite: (key: string) => void;
}) {
	const [, setPath] = usePath();

	const handlePositionChange: PositionEditHandler = (xPath, yPath, x, y) => {
		if (!data) return;
		const result = updatePositionData(data, xPath, yPath, x, y);
		if (result) {
			write(result);
		}
	};

	return (
		<div className="p-2 h-full flex flex-col gap-2">
			<Button
				variant="outline"
				size="sm"
				className="shrink-0"
				onClick={() => setPath({ path, type: "text", jsonPath: null })}
			>
				<ArrowLeft className="h-4 w-4 mr-1" />
				Back to text editor
			</Button>
			<div className="flex-1 overflow-y-auto flex flex-col gap-2">
				{sprites.map((sprite) => (
					<PositionPreview
						key={sprite.position.x.path}
						sprite={sprite}
						onPositionChange={handlePositionChange}
						hidden={hiddenSprites.has(sprite.position.x.path)}
						onToggleVisibility={() => onToggleSprite(sprite.position.x.path)}
					/>
				))}
			</div>
		</div>
	);
}
