import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface SplitViewProps {
	left: ReactNode;
	center?: ReactNode;
	right?: ReactNode;
	defaultLeftWidth?: number;
	defaultRightWidth?: number;
	minPanelWidth?: number;
	className?: string;
}

export function SplitView({
	left,
	center,
	right,
	defaultLeftWidth = 260,
	defaultRightWidth = 260,
	minPanelWidth = 200,
	className,
}: SplitViewProps) {
	const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
	const [rightWidth, setRightWidth] = useState(defaultRightWidth);
	const containerRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{
		type: "left" | "right";
		startX: number;
		startWidth: number;
	} | null>(null);

	const onMouseDown = useCallback(
		(type: "left" | "right") => (e: React.MouseEvent) => {
			e.preventDefault();
			const startWidth = type === "left" ? leftWidth : rightWidth;
			dragRef.current = { type, startX: e.clientX, startWidth };
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";
		},
		[leftWidth, rightWidth],
	);

	const onMouseMove = useCallback(
		(e: MouseEvent) => {
			const drag = dragRef.current;
			if (!drag || !containerRef.current) return;

			const containerRect = containerRef.current.getBoundingClientRect();
			const delta = e.clientX - drag.startX;

			if (drag.type === "left") {
				const newWidth = Math.max(minPanelWidth, drag.startWidth + delta);
				const maxWidth = containerRect.width - rightWidth - minPanelWidth;
				setLeftWidth(Math.min(newWidth, maxWidth));
			} else {
				const newWidth = Math.max(minPanelWidth, drag.startWidth - delta);
				const maxWidth = containerRect.width - leftWidth - minPanelWidth;
				setRightWidth(Math.min(newWidth, maxWidth));
			}
		},
		[minPanelWidth, leftWidth, rightWidth],
	);

	const onMouseUp = useCallback(() => {
		dragRef.current = null;
		document.body.style.cursor = "";
		document.body.style.userSelect = "";
	}, []);

	useEffect(() => {
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [onMouseMove, onMouseUp]);

	const showCenter = center !== undefined
	const showRight = right !== undefined

	return (
		<div ref={containerRef} className={cn("flex min-h-0 flex-1 overflow-hidden w-full", className)}>
			<div style={{ width: showCenter ? leftWidth : undefined, minWidth: showCenter ? minPanelWidth : undefined }} className={cn("shrink-0 border-r bg-muted", !showCenter && "flex-1")}>
				{left}
			</div>

			{showCenter && (
				<div
					className="group flex w-1.5 shrink-0 cursor-col-resize items-center justify-center transition-colors hover:bg-accent active:bg-accent bg-background"
					onMouseDown={onMouseDown("left")}
				>
					<div className="h-8 w-0.5 rounded-full bg-muted-foreground opacity-0 transition-opacity group-hover:opacity-60" />
				</div>
			)}

			{showCenter && (
				<div className="flex flex-1 overflow-hidden bg-background w-full items-center justify-center">{center}</div>
			)}

			{showRight && (
				<div
					className="group flex w-1.5 shrink-0 cursor-col-resize items-center justify-center transition-colors hover:bg-accent active:bg-accent bg-background"
					onMouseDown={onMouseDown("right")}
				>
					<div className="h-8 w-0.5 rounded-full bg-muted-foreground opacity-0 transition-opacity group-hover:opacity-60" />
				</div>
			)}

			{showRight && (
				<div style={{ width: rightWidth, minWidth: minPanelWidth }} className="shrink-0 border-l bg-muted">
					{right}
				</div>
			)}
		</div>
	);
}
