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
		<div className="flex justify-center items-center h-full w-full flex-col">
			<img
                className="mt-auto"
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
			<div className="mt-auto text-xs text-muted-foreground">{size.width}x{size.height}</div>
		</div>
	);
}
