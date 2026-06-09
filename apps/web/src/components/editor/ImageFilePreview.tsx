import { cn, getImageUrl } from "#/lib/utils";
import { useFile, useProjectSession } from "@project/core";
import { hasContentSprite } from "@project/utils";
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
	const isContentSprite = hasContentSprite(path);

	if (isContentSprite) {
		return <ContentImageFilePreview path={path} className={className} onSize={onSize} fallback={fallback} {...props} />;
	}

	if (!path.endsWith(".png")) {
		return <File className={className} />
	}

	return <Image path={path} className={className} onSize={onSize} fallback={fallback} {...props} />;
});

export const ContentImageFilePreview = React.memo(function ContentImageFilePreview({
	path,
	className,
	onSize,
	fallback,
	...props
}: ImageFilePreviewProps & React.ComponentProps<"img">) {
	const spritePath = useProjectSession((s) => s.treeSnapshot.findContentSpritePath(path));

	if (!spritePath) {
		return <File className={className} />
	}

	return <Image path={spritePath} className={className} onSize={onSize} fallback={fallback} {...props} />;
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
