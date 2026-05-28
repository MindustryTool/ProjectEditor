import { useFileContent, useFileContentImageUrl } from "@project/state";
import { resolveContentSprite } from "@project/utils";
import { useState } from "react";

export interface ImageFilePreviewProps {
	path: string;
	showSize?: boolean;
}

export function ImageFilePreview({ path, showSize = true }: ImageFilePreviewProps) {
	let resolvedPath: string | null = path;

	if (path.endsWith(".json")) {
		resolvedPath = resolveContentSprite(path);
		if (!resolvedPath) {
			throw new Error(`Invalid content path: ${path}`);
		}
	}

	if (!resolvedPath?.endsWith(".png")) {
		throw new Error(`ImageFilePreview only supports png file: ${resolvedPath}`);
	}

	const { data } = useFileContent(resolvedPath);
	const objectUrl = useFileContentImageUrl(data);
	const [size, setSize] = useState({ width: 0, height: 0 });

	if (objectUrl === null) {
		return <div className="flex h-full w-full" />;
	}

	return (
		<div className="relative flex justify-center items-center h-full w-full flex-col">
			<img
				src={objectUrl}
				alt={resolvedPath}
				onLoad={(e) => {
					const img = e.currentTarget;

					if (!showSize) {
						return;
					}

					setSize({
						width: img.naturalWidth,
						height: img.naturalHeight,
					});
				}}
			/>
			{showSize && (
				<div className="absolute bottom-0.5 backdrop-blur-xs backdrop-brightness-75 p-0.5 right-0.5 text-xs text-muted-foreground">
					{size.width}x{size.height}
				</div>
			)}
		</div>
	);
}
