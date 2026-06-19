import { useCanvasInteraction } from "#/components/editor/position-editor/use-canvas-interaction";
import { Spinner } from "#/components/ui/spinner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "#/components/ui/resizable";
import { useFileString, useProjectSession } from "@project/core";
import { HJSON } from "@project/hjson";
import { collectUnitPositions, type PositionData } from "@project/schema";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { PositionImage } from "./PositionImage";
import { CoordsDisplay } from "./CoordsDisplay";
import { SpriteItem } from "./SpriteItem";
import { ShootItem } from "./ShootItem";
import { PositionSidebar } from "./PositionSidebar";
import { PositionFloatingInput } from "./PositionFloatingInput";
import { updatePositionData } from "./utils";
import type { PositionEditHandler } from "./preview/types";
import { useIsDesktop } from "#/hooks/use-is-desktop";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "#/components/ui/button";

export function PositionCanvas({ path }: { path: string }) {
	const canvasRef = useRef<HTMLDivElement>(null);
	const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
	const [hiddenSprites, setHiddenSprites] = useState<Set<string>>(new Set());
	const [selectedPath, setSelectedPath] = useState<string | null>(null);
	const [isDesktop] = useIsDesktop();

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

	const selectedData = useMemo(() => {
		if (!selectedPath) return null;
		return sprites.find((s) => s.position.x.path === selectedPath) ?? null;
	}, [selectedPath, sprites]);

	const handleSelect = useCallback((key: string | null) => {
		setSelectedPath(key);
	}, []);

	const handleFloatingChange: PositionEditHandler = useCallback(
		(xPath, yPath, x, y) => {
			if (!data) return;
			const result = updatePositionData(data, xPath, yPath, x, y);
			if (result) {
				write(result);
			}
		},
		[data, write],
	);

	const toggleSprite = useCallback((key: string) => {
		setHiddenSprites((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	}, []);

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
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								handleSelect(null);
							}
						}}
						onTap={(e) => {
							if (e.target === e.currentTarget) {
								handleSelect(null);
							}
						}}
					>
						<Layer imageSmoothingEnabled={false}>
							{baseSprite && <PositionImage path={baseSprite} x={0} y={0} mirror={false} />}
							{sprites.map((region) => {
								const key = region.position.x.path;
								if (hiddenSprites.has(key)) return null;
								return region.type === "shoot" ? (
									<ShootItem key={key} region={region} write={write} onSelect={handleSelect} isSelected={selectedPath === key} />
								) : (
									<SpriteItem key={key} region={region} write={write} onSelect={handleSelect} selectedKey={selectedPath === key ? key : null} />
								);
							})}
						</Layer>
					</Stage>
					{selectedData && (() => {
						const stage = stageRef.current;
						if (!stage) return null;
						const scale = scaleRef.current;
						const stagePos = stage.position();
						const konvaX = selectedData.position.x.value * 4;
						const konvaY = -(selectedData.position.y.value * 4);
						const fp = {
							x: (konvaX + canvasDimensions.width / 2) * scale + stagePos.x,
							y: (konvaY + canvasDimensions.height / 2) * scale + stagePos.y,
						};
						return (
							<PositionFloatingInput
								position={selectedData.position}
								onPositionChange={handleFloatingChange}
								floatingPos={fp}
								containerWidth={canvasDimensions.width}
							/>
						);
					})()}
					{!isDesktop && (
						<div className="absolute top-0 left-0 right-0">
							<Collapsible className="space-y-2">
								<CollapsibleTrigger asChild>
									<Button className="sticky top-0 m-2 bg-card border border-border">
										<ChevronDown className="size-4" />
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent className="bg-background p-2 pt-0">
									<PositionSidebar
										sprites={sprites}
										path={path}
										hiddenSprites={hiddenSprites}
										onToggleSprite={toggleSprite}
										selectedPath={selectedPath}
									/>
								</CollapsibleContent>
							</Collapsible>
						</div>
					)}
				</div>
			</ResizablePanel>
			{sprites.length > 0 && isDesktop && (
				<>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="25%" minSize="15%" maxSize="40%" className="p-2">
						<PositionSidebar
							sprites={sprites}
							path={path}
							hiddenSprites={hiddenSprites}
							onToggleSprite={toggleSprite}
							selectedPath={selectedPath}
						/>
					</ResizablePanel>
				</>
			)}
		</ResizablePanelGroup>
	);
}
