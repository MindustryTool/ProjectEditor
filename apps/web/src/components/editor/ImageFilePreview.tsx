import { cn, getImageUrl } from "#/lib/utils";
import { useFile } from "@project/core";
import { resolveContentSprite } from "@project/utils";
import { File } from "lucide-react";
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
				return <File className={className} />;
			}
		}

		if (!resolvedPath?.endsWith(".png")) {
			throw new Error(`ImageFilePreview only supports png file: ${resolvedPath}`);
		}
	}

	return <Image path={resolvedPath} className={className} showSize={showSize} fallback={fallback} />;
}

function Image({ path, className, showSize = true, fallback }: ImageFilePreviewProps) {
	const { data } = useFile(path);
	const [size, setSize] = useState({ width: 0, height: 0 });
	const [error, setError] = useState(false);

	if (data === null) {
		return <div className={cn("relative flex justify-center items-center h-full w-full", className)}>{fallback}</div>;
	}

	const objectUrl = getImageUrl(data);

	if (error) {
		return <div className={cn("relative flex justify-center items-center h-full w-full", className)}>{fallback}</div>;
	}

	return (
		<div className={cn("relative flex justify-center items-center h-full w-full overflow-hidden", className)}>
			<img
				src={objectUrl}
				alt={path}
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
				onError={() => setError(true)}
			/>
			{showSize && (
				<div className="absolute bottom-0.5 backdrop-blur-xs backdrop-brightness-75 p-0.5 right-0.5 text-xs text-muted-foreground">
					{size.width}x{size.height}
				</div>
			)}
		</div>
	);
}
