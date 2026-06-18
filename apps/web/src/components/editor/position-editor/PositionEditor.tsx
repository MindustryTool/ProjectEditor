import { useCanvasInteraction } from "#/components/editor/position-editor/use-canvas-interaction";
import { Spinner } from "#/components/ui/spinner";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "#/components/ui/resizable";
import { useFileString, useProjectSession } from "@project/core";
import { HJSON } from "@project/hjson";
import { collectUnitPositions, type PositionData } from "@project/schema";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { updatePositionData } from "#/components/editor/position-editor/utils";
import { PositionImage } from "./PositionImage";
import { EnginePositionPlaceholder, PositionPlaceholder, ShootPositionPlaceholder } from "./PositionPlaceholder";

export function PositionEditor({ path }: { path: string }) {
	return (
		<div className="w-full h-full overflow-hidden relative flex border rounded mb-1.5">
			<PositionCanvas path={path} />
		</div>
	);
}

function PositionCanvas({ path }: { path: string }) {
	const canvasRef = useRef<HTMLDivElement>(null);
	const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const el = canvasRef.current;
		if (!el) return;
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			setCanvasDimensions({
				width: entry.contentRect.width,
				height: entry.contentRect.height,
			});
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const { data, isLoading, write } = useFileString(path);
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const baseSprite = useMemo(() => treeSnapshot.findContentSpritePath(path), [path, treeSnapshot]);

	const { stageRef, posRef, scaleRef, handleWheel, handleDragEnd } = useCanvasInteraction(canvasDimensions.width, canvasDimensions.height);

	const { sprites, error } = useMemo(() => {
		if (isLoading) return { sprites: [] as PositionData[], error: null };

		if (!data) {
			return { sprites: [] as PositionData[], error: null as string | null };
		}

		try {
			const node = HJSON.parseWithCache(data);

			if (!node.isObject()) {
				return { sprites: [], error: "Not an object" };
			}

			return {
				sprites: collectUnitPositions(
					(filename) => treeSnapshot.getEntries().find((item) => item.name === filename)?.path,
					node,
				),
				error: null,
			};
		} catch (e) {
			console.error(e);
			return { sprites: [], error: String(e) };
		}
	}, [data, treeSnapshot, isLoading]);

	return (
		<ResizablePanelGroup orientation="horizontal" className="flex-1">
			<ResizablePanel defaultSize="75%" minSize="50%">
				<div ref={canvasRef} className="h-full relative">
					{error && (
						<div className="absolute top-1 left-1 text-red-400/70 font-mono text-xs text-ellipsis w-full text-nowrap overflow-hidden">
							{error}
						</div>
					)}
					{isLoading && (
						<div className="flex w-full h-full items-center justify-center">
							<Spinner />
						</div>
					)}
					<CoordsDisplay x={posRef.current.x} y={posRef.current.y} />
					<Stage
						className="h-full w-full"
						ref={stageRef}
						width={canvasDimensions.width}
						height={canvasDimensions.height}
						draggable
						offsetX={-canvasDimensions.width / 2}
						offsetY={-canvasDimensions.height / 2}
						onWheel={handleWheel}
						onDragEnd={handleDragEnd}
						scaleX={scaleRef.current}
						scaleY={scaleRef.current}
						x={posRef.current.x}
						y={posRef.current.y}
					>
						<Layer>
							{baseSprite && <PositionImage path={baseSprite} x={0} y={0} mirror={false} />}
							{sprites.map((region) => {
								const handleDrag = (x: number, y: number) => {
									if (!data) {
										throw new Error("No data");
									}

									const result = updatePositionData(data, region.position.x.path, region.position.y.path, x, y);

									if (result) {
										write(result);
									}
								};

								switch (region.type) {
									case "sprite":
										return (
											<PositionImage
												key={region.position.x.path}
												path={region.path}
												x={region.position.x.value * 4}
												y={-region.position.y.value * 4}
												mirror={region.mirror}
												onDrag={handleDrag}
											/>
										);
									case "engine":
										return (
											<EnginePositionPlaceholder
												key={region.position.x.path}
												region={region}
												onDrag={handleDrag}
											/>
										);
									case "shoot":
										return (
											<ShootPositionPlaceholder
												key={region.position.x.path}
												region={region}
												onDrag={handleDrag}
											/>
										);
									default:
										return (
											<PositionPlaceholder
												key={region.position.x.path}
												region={region}
												onDrag={handleDrag}
											/>
										);
								}
							})}
						</Layer>
					</Stage>
				</div>
			</ResizablePanel>
			{sprites.length > 0 && (
				<>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="25%" minSize="15%" maxSize="40%">
						<PositionSidebar sprites={sprites} />
					</ResizablePanel>
				</>
			)}
		</ResizablePanelGroup>
	);
}

function CoordsDisplay({ x, y }: { x: number; y: number }) {
	return (
		<div className="absolute top-1 left-1 text-muted-foreground text-xs">
			({Math.round(x / 4)}, {Math.round(y / 4)})
		</div>
	);
}

function PositionSidebar({ sprites }: { sprites: PositionData[] }) {
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
	const extra =
		sprite.type === "engine" ? ` r=${sprite.radius.value} rot=${sprite.rotation.value}` :
		sprite.type === "sprite" ? "" :
		"";

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
					{sprite.type}{extra}
				</div>
			)}
			<div className="absolute bottom-0.5 backdrop-blur-xs backdrop-brightness-75 p-0.5 left-0.5 text-xs text-muted-foreground">
				x={sprite.position.x.value}, y={sprite.position.y.value}
			</div>
		</div>
	);
}
