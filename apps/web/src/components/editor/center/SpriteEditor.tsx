import { useContainerDimensions } from "#/components/editor/center/use-container-dimensions";
import { useCanvasInteraction } from "#/components/editor/center/use-canvas-interaction";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { Spinner } from "#/components/ui/spinner";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { useFileString, useProjectSession } from "@project/core";
import { HJSON } from "@project/hjson";
import { type AnySchema, type SchemaFn } from "@project/schema";
import { resolveContentSprite } from "@project/utils";
import { useMemo, useState } from "react";
import { Layer, Stage } from "react-konva";
import { collectSpriteData, updateSpritePosition, type SpriteData } from "#/components/editor/center/sprite-utils";
import { SpriteImage } from "./SpriteImage";

export function SpriteEditor({ path, schema }: { path: string; schema: AnySchema | SchemaFn }) {
	const { containerRef, dimensions } = useContainerDimensions();

	return (
		<div ref={containerRef} className="w-full h-full overflow-hidden relative flex">
			{dimensions.width > 0 && <SpriteCanvas path={path} schema={schema} dimensions={dimensions} />}
		</div>
	);
}

function SpriteCanvas({
	path,
	schema,
	dimensions,
}: {
	path: string;
	schema: AnySchema | SchemaFn;
	dimensions: { width: number; height: number };
}) {
	const { contents } = useProjectContext();
	const { data, isLoading, write } = useFileString(path);
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const baseSprite = useMemo(() => resolveContentSprite(path), [path]);

	const { stageRef, posRef, scaleRef, handleWheel, handleDragEnd } = useCanvasInteraction();

	const { sprites, error } = useMemo(() => {
		if (!data) return { sprites: [] as SpriteData[], error: "No data" as string | null };
		try {
			const node = HJSON.parseWithCache(data);
			if (!node.isObject()) return { sprites: [], error: "Not an object" };
			const resolvedSchema = typeof schema === "function" ? schema(contents) : schema;
			return { sprites: collectSpriteData(treeSnapshot, node, resolvedSchema), error: null };
		} catch (e) {
			console.error(e);
			return { sprites: [], error: String(e) };
		}
	}, [data, schema, contents, treeSnapshot]);

	if (isLoading) {
		return (
			<div className="flex w-full h-full justify-center items-center">
				<Spinner />
			</div>
		);
	}

	if (!data || error) {
		return <div>{error ?? "No data"}</div>;
	}

	return (
		<>
			<CoordsDisplay x={posRef.current.x} y={posRef.current.y} />
			<Stage
				className="h-full w-full"
				ref={stageRef}
				width={dimensions.width - 200}
				height={dimensions.height}
				draggable
				offsetX={-dimensions.width / 2}
				offsetY={-dimensions.height / 2}
				onWheel={handleWheel}
				onDragEnd={handleDragEnd}
				scaleX={scaleRef.current}
				scaleY={scaleRef.current}
				x={posRef.current.x}
				y={posRef.current.y}
			>
				<Layer>
					{baseSprite && <SpriteImage path={baseSprite} x={0} y={0} mirror={false} />}
					{sprites.map((sprite) => (
						<SpriteImage
							key={sprite.position.x.path}
							path={sprite.path}
							x={sprite.position.x.value * 4}
							y={-sprite.position.y.value * 4}
							mirror={sprite.mirror}
							onDrag={(x, y) => {
								const result = updateSpritePosition(data, sprite.position.x.path, sprite.position.y.path, x, y);
								if (result) write(result);
							}}
						/>
					))}
				</Layer>
			</Stage>
			<SpriteSidebar sprites={sprites} />
		</>
	);
}

function CoordsDisplay({ x, y }: { x: number; y: number }) {
	return (
		<div className="absolute top-1 left-1 text-muted-foreground text-xs">
			{Math.round(x)}x{Math.round(y)}
		</div>
	);
}

function SpriteSidebar({ sprites }: { sprites: SpriteData[] }) {
	return (
		<div className="pl-2 border-l max-w-sm h-full flex flex-col overflow-y-auto min-w-40 gap-2">
			{sprites.map((sprite) => (
				<SpritePreview key={sprite.position.x.path} sprite={sprite} />
			))}
		</div>
	);
}

function SpritePreview({ sprite }: { sprite: SpriteData }) {
	const [size, setSize] = useState([0, 0]);

	return (
		<div className="w-full border p-8 rounded-md bg-card relative">
			<span className="absolute top-1 left-1 text-xs text-muted-foreground">{sprite.name}</span>
			<ImageFilePreview path={sprite.path} onSize={(width, height) => setSize([width, height])} />
			<div className="absolute bottom-0.5 backdrop-blur-xs backdrop-brightness-75 p-0.5 right-0.5 text-xs text-muted-foreground">
				{size[0]}x{size[1]}
			</div>
		</div>
	);
}
