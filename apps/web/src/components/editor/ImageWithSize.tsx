import { memo, useCallback, useState } from "react";
import { ImageFilePreview } from "#/components/editor/ImageFilePreview";

export const ImageWithSize = memo(function ImageWithSize({ path }: { path: string }) {
	const [size, setSize] = useState([0, 0]);
	const handleSize = useCallback((width: number, height: number) => setSize([width, height]), []);

	return (
		<div className="relative flex justify-center items-center h-full w-full overflow-hidden">
			<ImageFilePreview path={path} onSize={handleSize} />
			<div className="absolute bottom-0.5 backdrop-blur-xs backdrop-brightness-75 p-0.5 right-0.5 text-xs text-muted-foreground">
				{size[0]}x{size[1]}
			</div>
		</div>
	);
});
