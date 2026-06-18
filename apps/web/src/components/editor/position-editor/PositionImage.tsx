import { getImageUrl } from "#/lib/utils";
import { useFile } from "@project/core";
import type Konva from "konva";
import { useCallback, useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva";
import { applyOutline } from "#/components/editor/position-editor/utils";

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

	const handleDragMove = useCallback((event: Konva.KonvaEventObject<DragEvent>) => {
		event.cancelBubble = true;
		setLocalX(event.target.x());
		setLocalY(event.target.y());
	}, []);

	const handleDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const x = Math.round((event.target.x() / 4) * 100) / 100;
			const y = Math.round((event.target.y() / 4) * 100) / 100;

			if (!onDrag) return;

			onDrag(x, -y);
		},
		[onDrag],
	);

	const mirrorHandleDragMove = useCallback((event: Konva.KonvaEventObject<DragEvent>) => {
		event.cancelBubble = true;
		setLocalX(-event.target.x());
		setLocalY(event.target.y());
	}, []);

	const mirrorHandleDragEnd = useCallback(
		(event: Konva.KonvaEventObject<DragEvent>) => {
			event.cancelBubble = true;
			const x = Math.round((event.target.x() / 4) * 100) / 100;
			const y = Math.round((event.target.y() / 4) * 100) / 100;

			if (!onDrag) return;

			onDrag(-x, -y);
		},
		[onDrag],
	);

	if (!image) return null;

	return (
		<>
			<KonvaImage
				draggable={!!onDrag}
				onDragMove={handleDragMove}
				onDragEnd={handleDragEnd}
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
					onDragMove={mirrorHandleDragMove}
					onDragEnd={mirrorHandleDragEnd}
				/>
			)}
		</>
	);
}
