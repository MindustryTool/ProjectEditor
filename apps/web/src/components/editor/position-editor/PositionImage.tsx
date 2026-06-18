import { getImageUrl } from "#/lib/utils";
import { useFile } from "@project/core";
import type Konva from "konva";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image as KonvaImage, Rect } from "react-konva";
import { applyOutline } from "#/components/editor/position-editor/utils";

function computeNonTransparentBounds(imageData: ImageData) {
	const data = imageData.data;
	const w = imageData.width;
	const h = imageData.height;
	let minX = w, minY = h, maxX = 0, maxY = 0;

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			if (data[(y * w + x) * 4 + 3]! > 0) {
				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (x > maxX) maxX = x;
				if (y > maxY) maxY = y;
			}
		}
	}

	if (minX > maxX || minY > maxY) {
		return { x: 0, y: 0, width: w, height: h };
	}

	return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function PositionImage({
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
	const [imagePixelData, setImagePixelData] = useState<ImageData | null>(null);
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
			const rawData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			applyOutline(rawData);
			ctx.putImageData(rawData, 0, 0);

			const outlined = new window.Image();
			outlined.src = canvas.toDataURL();
			outlined.onload = () => {
				setImage(outlined);
				setImagePixelData(rawData);
			};
		};
	}, [data]);

	const hitBounds = useMemo(() => {
		if (!imagePixelData) return null;
		return computeNonTransparentBounds(imagePixelData);
	}, [imagePixelData]);

	const hitRectOffX = useMemo(() => {
		if (!hitBounds || !image) return 0;
		return hitBounds.x - image.width / 2;
	}, [hitBounds, image]);

	const hitRectOffY = useMemo(() => {
		if (!hitBounds || !image) return 0;
		return hitBounds.y - image.height / 2;
	}, [hitBounds, image]);

	const handleDragMove = useCallback((event: Konva.KonvaEventObject<DragEvent>) => {
		event.cancelBubble = true;
		setLocalX(event.target.x() - hitRectOffX);
		setLocalY(event.target.y() - hitRectOffY);
	}, [hitRectOffX, hitRectOffY]);

	const handleDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const dragX = Math.round(((event.target.x() - hitRectOffX) / 4) * 100) / 100;
			const dragY = Math.round(((event.target.y() - hitRectOffY) / 4) * 100) / 100;
			if (!onDrag) return;
			onDrag(dragX, -dragY);
		},
		[onDrag, hitRectOffX, hitRectOffY],
	);

	const mirrorHandleDragMove = useCallback((event: Konva.KonvaEventObject<DragEvent>) => {
		event.cancelBubble = true;
		setLocalX(-event.target.x() + hitRectOffX);
		setLocalY(event.target.y() - hitRectOffY);
	}, [hitRectOffX, hitRectOffY]);

	const mirrorHandleDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const dragX = Math.round(((event.target.x() - hitRectOffX) / 4) * 100) / 100;
			const dragY = Math.round(((event.target.y() - hitRectOffY) / 4) * 100) / 100;
			if (!onDrag) return;
			onDrag(-dragX, -dragY);
		},
		[onDrag, hitRectOffX, hitRectOffY],
	);

	if (!image) return null;

	const hitW = hitBounds?.width ?? image.width;
	const hitH = hitBounds?.height ?? image.height;

	return (
		<>
			<KonvaImage
				listening={false}
				image={image}
				x={localX}
				y={localY}
				offsetX={image.width / 2}
				offsetY={image.height / 2}
			/>
			<Rect
				x={localX + hitRectOffX}
				y={localY + hitRectOffY}
				width={hitW}
				height={hitH}
				fill="transparent"
				strokeEnabled={false}
				draggable={!!onDrag}
				onDragMove={handleDragMove}
				onDragEnd={handleDragEnd}
			/>
			{mirror && (
				<>
					<KonvaImage
						scaleX={-1}
						listening={false}
						image={image}
						x={-localX}
						y={localY}
						offsetX={image.width / 2}
						offsetY={image.height / 2}
					/>
					<Rect
						x={-localX + hitRectOffX}
						y={localY + hitRectOffY}
						width={hitW}
						height={hitH}
						fill="transparent"
						strokeEnabled={false}
						draggable={!!onDrag}
						onDragMove={mirrorHandleDragMove}
						onDragEnd={mirrorHandleDragEnd}
					/>
				</>
			)}
		</>
	);
}
