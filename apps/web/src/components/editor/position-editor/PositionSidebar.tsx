import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import type { PositionData } from "@project/schema";
import { useCallback, useState } from "react";

export function PositionSidebar({ sprites }: { sprites: PositionData[] }) {
	return (
		<div className="p-2 h-full flex flex-col overflow-y-auto gap-2">
			{sprites.map((sprite) => (
				<PositionPreview key={sprite.position.x.path} sprite={sprite} />
			))}
		</div>
	);
}

function PositionPreview({ sprite }: { sprite: PositionData }) {
	const [size, setSize] = useState([0, 0]);
	const handleSize = useCallback((width: number, height: number) => setSize([width, height]), []);

	const scrollTo = (id: string) =>
		requestAnimationFrame(() => {
			let current = "";
			for (const segment of id.split(".")) {
				current += segment;
				const element = document.getElementById(current);
				if (element) {
					element.scrollIntoView({
						behavior: "smooth",
					});
					element.focus();
				}
				current += ".";
			}
		});

	const label = `[${sprite.type}] ${sprite.type === "sprite" ? sprite.name : ""}`;
	const extra = sprite.type === "engine" ? ` r=${sprite.radius.value} rot=${sprite.rotation.value}` : sprite.type === "sprite" ? "" : "";

	return (
		<div
			className="w-full border p-8 rounded bg-card relative flex items-center justify-center"
			onClick={() => scrollTo(sprite.position.x.path)}
		>
			<span className="absolute top-1 left-1 text-xs text-muted-foreground">
				{label} ({size[0]}x{size[1]})
			</span>
			{sprite.type === "sprite" ? (
				<ImageFilePreview className="object-contain" path={sprite.path} onSize={handleSize} />
			) : (
				<div className="text-muted-foreground text-sm">
					{sprite.type}
					{extra}
				</div>
			)}
			<div className="absolute bottom-0.5 backdrop-blur-xs backdrop-brightness-75 p-0.5 left-0.5 text-xs text-muted-foreground">
				x={sprite.position.x.value}, y={sprite.position.y.value}
			</div>
		</div>
	);
}
