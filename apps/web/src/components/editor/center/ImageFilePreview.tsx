import { useFileContent, useFileContentImageUrl } from "@project/state";
import { useState } from "react";

export function ImageFilePreview({ path }: { path: string }) {
	const { data } = useFileContent(path);
	const objectUrl = useFileContentImageUrl(data);
	const [size, setSize] = useState({ width: 0, height: 0 });

	if (objectUrl === null) {
		return <div className="flex h-full w-full" />;
	}

	return (
		<div className="relative flex justify-center items-center h-full w-full flex-col">
			<img
				src={objectUrl}
				alt={path}
				onLoad={(e) => {
					const img = e.currentTarget;

					setSize({
						width: img.naturalWidth,
						height: img.naturalHeight,
					});
				}}
			/>
			<div className="absolute bottom-0.5 backdrop-blur-xs backdrop-brightness-75 p-0.5 right-0.5 text-xs text-muted-foreground">{size.width}x{size.height}</div>
		</div>
	);
}
