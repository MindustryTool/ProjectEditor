import { cn, getImageUrl } from "#/lib/utils";
import { useFile } from "@project/state";
import { resolveContentSprite } from "@project/utils";
import { useState, type ReactNode } from "react";

export interface ImageFilePreviewProps {
	path: string;
	showSize?: boolean;
	className?: string;
	fallback?: ReactNode;
}

export function ImageFilePreview({ path, className, showSize = true, fallback }: ImageFilePreviewProps) {
	let resolvedPath: string | null = path;

	if (!path.endsWith(".png")) {
		if (path.endsWith(".json")) {
			resolvedPath = resolveContentSprite(path);
			if (!resolvedPath) {
				throw new Error(`Invalid content path: ${path}`);
			}
		}

		if (!resolvedPath?.endsWith(".png")) {
			throw new Error(`ImageFilePreview only supports png file: ${resolvedPath}`);
		}
	}

	const { data } = useFile(resolvedPath);
	const [size, setSize] = useState({ width: 0, height: 0 });

	if (data === null) {
		return <div className={cn("relative flex justify-center items-center h-full w-full", className)}>{fallback}</div>;
	}

	const objectUrl = getImageUrl(data);

	return (
		<div className={cn("relative flex justify-center items-center h-full w-full overflow-hidden", className)}>
			<img
				src={objectUrl}
				alt={resolvedPath}
				loading="lazy"
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
