import { useEffect, useRef, useState } from "react";

export function useContainerDimensions() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!containerRef.current) return;

		setDimensions({
			width: containerRef.current.offsetWidth,
			height: containerRef.current.offsetHeight,
		});

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setDimensions({
					width: entry.contentRect.width,
					height: entry.contentRect.height,
				});
			}
		});

		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	return { containerRef, dimensions };
}
