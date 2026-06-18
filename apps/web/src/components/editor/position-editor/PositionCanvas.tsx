import { useCanvasInteraction } from "#/components/editor/position-editor/use-canvas-interaction";
import { Spinner } from "#/components/ui/spinner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "#/components/ui/resizable";
import { useFileString, useProjectSession } from "@project/core";
import { HJSON } from "@project/hjson";
import { collectUnitPositions, type PositionData } from "@project/schema";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { PositionImage } from "./PositionImage";
import { CoordsDisplay } from "./CoordsDisplay";
import { SpriteItem } from "./SpriteItem";
import { ShootItem } from "./ShootItem";
import { PositionSidebar } from "./PositionSidebar";

export function PositionCanvas({ path }: { path: string }) {
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

			const findFileName = (filename: string) => treeSnapshot.getEntries().find((item) => item.name === filename)?.path;
			const all = collectUnitPositions(findFileName, node);

			all.sort((a, b) => {
				if (a.type === "shoot" && b.type !== "shoot") return 1;
				if (a.type !== "shoot" && b.type === "shoot") return -1;
				return 0;
			});

			return {
				sprites: all,
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
						<Layer imageSmoothingEnabled={false}>
							{baseSprite && <PositionImage path={baseSprite} x={0} y={0} mirror={false} />}
							{sprites.map((region) =>
								region.type === "shoot" ? (
									<ShootItem key={region.position.x.path} region={region} write={write} />
								) : (
									<SpriteItem key={region.position.x.path} region={region} write={write} />
								),
							)}
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
