import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { useProjectContext } from "#/components/editor/ProjectProvider";
import { Spinner } from "#/components/ui/spinner";
import { getImageUrl } from "#/lib/utils";
import { type TreeSnapshot, useFile, useFileString, useProjectSession } from "@project/core";
import { HJSON, type HjsonObjectNode } from "@project/hjson";
import { getArrayItemSchema, getSchemaEntries, resolveSchema, type AnySchema, type SchemaFn } from "@project/schema";
import { resolveContentSprite } from "@project/utils";
import type Konva from "konva";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";

export function SpriteEditor({ path, schema }: { path: string; schema: AnySchema | SchemaFn }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!containerRef.current) return;

		setDimensions({
			width: containerRef.current.offsetWidth,
			height: containerRef.current.offsetHeight,
		});

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setDimensions({
					width: entry.contentRect.width,
					height: entry.contentRect.height,
				});
			}
		});

		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div ref={containerRef} className="w-full h-full overflow-hidden relative flex">
			<SpriteRender path={path} schema={schema} dimensions={dimensions} />
		</div>
	);
}

function SpriteRender({
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
	const baseSprite = resolveContentSprite(path);

	const stageRef = useRef<Konva.Stage>(null);
	const scaleRef = useRef(1);
	const posRef = useRef({ x: 0, y: 0 });
	const [, forceRender] = useState(0);

	const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
		e.evt.preventDefault();
		const stage = stageRef.current;
		if (!stage) return;
		const oldScale = scaleRef.current;
		const pointer = stage.getPointerPosition();
		if (!pointer) return;
		const stagePos = posRef.current;

		const mousePointTo = {
			x: (pointer.x - stagePos.x) / oldScale,
			y: (pointer.y - stagePos.y) / oldScale,
		};

		const direction = e.evt.deltaY > 0 ? -1 : 1;
		const newScale = Math.max(0.1, Math.min(10, oldScale * (direction > 0 ? 1.1 : 1 / 1.1)));

		const newPos = {
			x: pointer.x - mousePointTo.x * newScale,
			y: pointer.y - mousePointTo.y * newScale,
		};

		posRef.current = newPos;
		scaleRef.current = newScale;
		stage.position(newPos);
		stage.scale({ x: newScale, y: newScale });
		forceRender((n) => n + 1);
	}, []);

	const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
		posRef.current = { x: e.target.x(), y: e.target.y() };
	}, []);

	if (isLoading) {
		return (
			<div className="flex w-full h-full justify-center items-center">
				<Spinner />
			</div>
		);
	}

	if (!data) {
		return <div>No data???</div>;
	}

	try {
		const node = HJSON.parseWithCache(data);

		if (!node.isObject()) {
			return <div>Error: Not an object</div>;
		}

		const resolvedSchema = typeof schema === "function" ? schema(contents) : schema;
		const sprites = collectSpriteData(treeSnapshot, node, resolvedSchema);

		return (
			<>
				<div className="absolute top-1 left-1 text-muted-foreground text-xs">
					{Math.round(posRef.current.x)}x{Math.round(posRef.current.y)}
				</div>
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
									const result = node.path(sprite.position.x.path)?.replaceValue(data, HJSON.stringify(x));
									if (!result) return;
									const newNode = HJSON.parseWithCache(result);
									const finalResult = newNode.path(sprite.position.y.path)?.replaceValue(result, HJSON.stringify(y));
									if (!finalResult) return;
									write(finalResult);
								}}
							/>
						))}
					</Layer>
				</Stage>
				<div className="pl-2 border-l max-w-sm h-full flex flex-col overflow-y-auto min-w-40 gap-2">
					{sprites.map((sprite) => (
						<ImageFilePreview
							showSize
							key={sprite.position.x.path}
							className="w-full border p-2 rounded-md bg-card"
							path={sprite.path}
						/>
					))}
				</div>
			</>
		);
	} catch (error) {
		console.error(error);
		return <div>Error: {String(error)}</div>;
	}
}

function SpriteImage({
	x,
	y,
	path,
	mirror,
	onDrag,
}: {
	path: string;
	x: number;
	y: number;
	mirror: boolean;
	onDrag?: (x: number, y: number) => void;
}) {
	const { data } = useFile(path);
	const [image, setImage] = useState<HTMLImageElement | null>(null);
	const [localX, setLocalX] = useState(x);
	const [localY, setLocalY] = useState(y);

	useEffect(() => {
		if (!data) return;
		const url = getImageUrl(data);
		const img = new window.Image();
		img.src = url;
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d")!;
			ctx.drawImage(img, 0, 0);
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			applyOutline(imageData);
			ctx.putImageData(imageData, 0, 0);

			const outlined = new window.Image();
			outlined.src = canvas.toDataURL();
			outlined.onload = () => setImage(outlined);
		};
	}, [data]);

	if (!image) return null;

	return (
		<>
			<KonvaImage
				draggable={!!onDrag}
				onDragMove={(event) => {
					event.cancelBubble = true;
					setLocalX(event.target.x());
					setLocalY(event.target.y());
				}}
				onDragEnd={(event) => {
					event.cancelBubble = true;
					const x = Math.round(event.target.x() / 4);
					const y = Math.round(event.target.y() / 4);

					if (!onDrag) return;

					onDrag(x, -y);
				}}
				image={image}
				x={localX}
				y={localY}
				offsetX={image.width / 2}
				offsetY={image.height / 2}
			/>
			{mirror && (
				<KonvaImage
					scaleX={-1}
					image={image}
					x={-localX}
					y={localY}
					offsetX={image.width / 2}
					offsetY={image.height / 2}
					draggable={!!onDrag}
					onDragMove={(event) => {
						event.cancelBubble = true;
						setLocalX(-event.target.x());
						setLocalY(event.target.y());
					}}
					onDragEnd={(event) => {
						event.cancelBubble = true;
						const x = Math.round(event.target.x() / 4);
						const y = Math.round(event.target.y() / 4);

						if (!onDrag) return;

						onDrag(-x, -y);
					}}
				/>
			)}
		</>
	);
}

function applyOutline(imageData: ImageData) {
	const src = imageData.data;
	const { width, height } = imageData;
	const original = new Uint8ClampedArray(src);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const idx = (y * width + x) * 4;
			if (original[idx + 3]! > 0) continue;

			let edge = false;
			for (let dy = -1; dy <= 1 && !edge; dy++) {
				for (let dx = -1; dx <= 1 && !edge; dx++) {
					if (dx === 0 && dy === 0) continue;
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
					if (original[(ny * width + nx) * 4 + 3]! > 0) {
						edge = true;
					}
				}
			}

			if (edge) {
				src[idx] = 0;
				src[idx + 1] = 0;
				src[idx + 2] = 0;
				src[idx + 3] = 255;
			}
		}
	}
}

type SpriteData = {
	path: string;
	mirror: boolean;
	position: {
		x: {
			value: number;
			path: string;
		};
		y: {
			value: number;
			path: string;
		};
	};
};

function collectSpriteData(treeSnapshot: TreeSnapshot, node: HjsonObjectNode, schema: AnySchema): SpriteData[] {
	const result: SpriteData[] = [];

	function visit(value: unknown, currentSchema: AnySchema, currentPath: string) {
		currentSchema = resolveSchema(currentSchema, value);

		if (value && typeof value === "object" && !Array.isArray(value)) {
			const entries = getSchemaEntries(currentSchema);

			const obj = value as Record<string, unknown>;

			const hasName = typeof obj.name === "string";
			const hasX = typeof obj.x === "number";
			const hasY = typeof obj.y === "number";
			const filename = obj.name + ".png";
			const mirror = obj.mirror === true;

			const fileEntry = treeSnapshot.getEntries().find((item) => item.name === filename);

			if (hasName && hasX && hasY && fileEntry) {
				result.push({
					path: fileEntry.path,
					mirror,
					position: {
						x: {
							value: obj.x as number,
							path: currentPath ? `${currentPath}.x` : "x",
						},
						y: {
							value: obj.y as number,
							path: currentPath ? `${currentPath}.y` : "y",
						},
					},
				});
			}

			for (const [key, childSchema] of entries) {
				if (!(key in obj)) continue;

				visit(obj[key], childSchema, currentPath ? `${currentPath}.${key}` : key);
			}

			return;
		}

		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				const itemSchema = getArrayItemSchema(currentSchema, i);
				if (!itemSchema) continue;

				visit(value[i], itemSchema, `${currentPath}[${i}]`);
			}
		}
	}

	visit(node.valueOf(), schema, "");

	return result;
}
