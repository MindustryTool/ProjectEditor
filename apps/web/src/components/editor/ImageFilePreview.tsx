import { cn, getImageUrl } from "#/lib/utils";
import { useFile } from "@project/core";
import { resolveContentSprite } from "@project/utils";
import { File } from "lucide-react";
import React, { useMemo, useState, type ReactNode } from "react";

export interface ImageFilePreviewProps {
	path: string;
	className?: string;
	fallback?: ReactNode;
	onSize?: (width: number, height: number) => void;
}

export const ImageFilePreview = React.memo(function ImageFilePreview({
	path,
	className,
	onSize,
	fallback,
	...props
}: ImageFilePreviewProps & React.ComponentProps<"img">) {
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

	return <Image path={resolvedPath} className={className} onSize={onSize} fallback={fallback} {...props} />;
});

const Image = React.memo(function Image({
	path,
	className,
	onSize,
	fallback,
	...props
}: ImageFilePreviewProps & React.ComponentProps<"img">) {
	const result = useFile(path);
	const data = result.data;
	const [error, setError] = useState(false);

	const objectUrl = useMemo(() => (data ? getImageUrl(data) : null), [data]);

	if (objectUrl === null) {
		return <div className={cn("relative flex justify-center items-center h-full w-full", className)}>{fallback}</div>;
	}

	if (error) {
		return <div className={cn("relative flex justify-center items-center h-full w-full border rounded-md", className)}>{fallback}</div>;
	}

	return (
		<img
			className={cn("object-contain", className)}
			src={objectUrl}
			alt={path}
			loading="lazy"
			onLoad={(e) => {
				const img = e.currentTarget;

				onSize?.(img.naturalWidth, img.naturalHeight);
			}}
			onError={() => setError(true)}
			{...props}
		/>
	);
});
