import { Children, createContext, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

// --- Context ---

interface SplitViewContextValue {
	leftWidth: number;
	rightWidth: number;
	minPanelWidth: number;
	childCount: number;
	startResize: (type: "left" | "right") => (e: React.MouseEvent) => void;
}

const SplitViewContext = createContext<SplitViewContextValue | null>(null);

function useSplitView() {
	const ctx = useContext(SplitViewContext);
	if (!ctx) throw new Error("SplitView compound components must be used within <SplitView>");
	return ctx;
}

// --- Root ---

interface SplitViewProps {
	defaultLeftWidth?: number;
	defaultRightWidth?: number;
	minPanelWidth?: number;
	className?: string;
	children: ReactNode;
}

function SplitView({ defaultLeftWidth = 260, defaultRightWidth = 260, minPanelWidth = 200, className, children }: SplitViewProps) {
	const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
	const [rightWidth, setRightWidth] = useState(defaultRightWidth);
	const containerRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{
		type: "left" | "right";
		startX: number;
		startWidth: number;
	} | null>(null);

	const startResize = useCallback(
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

	const childCount = Children.toArray(children).length;

	const contextValue = useMemo(
		() => ({ leftWidth, rightWidth, minPanelWidth, childCount, startResize }),
		[leftWidth, rightWidth, minPanelWidth, childCount, startResize],
	);

	return (
		<SplitViewContext.Provider value={contextValue}>
			<div ref={containerRef} className={cn("flex min-h-0 flex-1 overflow-hidden w-full", className)}>
				{children}
			</div>
		</SplitViewContext.Provider>
	);
}

// --- Left Panel ---

function SplitViewLeft({ className, children }: { className?: string; children: ReactNode }) {
	const { leftWidth, minPanelWidth, childCount } = useSplitView();
	const showHandle = childCount > 1;
	return (
		<>
			<div
				data-slot="split-view-left"
				style={{
					width: showHandle ? leftWidth : undefined,
					minWidth: showHandle ? minPanelWidth : undefined,
				}}
				className={cn("shrink-0 border-r bg-card", !showHandle && "flex-1", className)}
			>
				<Suspense>{children}</Suspense>
			</div>
			{showHandle && <SplitViewResizeHandle type="left" />}
		</>
	);
}

// --- Center Panel ---

function SplitViewCenter({ className, children }: { className?: string; children: ReactNode }) {
	const { childCount } = useSplitView();
	const showHandle = childCount > 2;
	return (
		<>
			<div data-slot="split-view-center" className={cn("flex flex-1 overflow-hidden bg-background", className)}>
				<Suspense>{children}</Suspense>
			</div>
			{showHandle && <SplitViewResizeHandle type="right" />}
		</>
	);
}

// --- Right Panel ---

function SplitViewRight({ className, children }: { className?: string; children: ReactNode }) {
	const { rightWidth, minPanelWidth } = useSplitView();
	return (
		<div
			data-slot="split-view-right"
			style={{ width: rightWidth, minWidth: minPanelWidth }}
			className={cn("shrink-0 border-l bg-card", className)}
		>
			<Suspense>{children}</Suspense>
		</div>
	);
}

// --- Resize Handle (internal) ---

function SplitViewResizeHandle({ type }: { type: "left" | "right" }) {
	const { startResize } = useSplitView();
	return (
		<div
			data-slot="split-view-resize-handle"
			className="group flex w-1.5 shrink-0 cursor-col-resize items-center justify-center transition-colors hover:bg-accent active:bg-accent bg-background"
			onMouseDown={startResize(type)}
		>
			<div className="h-8 w-0.5 rounded-full bg-card-foreground opacity-0 transition-opacity group-hover:opacity-60" />
		</div>
	);
}

export { SplitView, SplitViewLeft, SplitViewCenter, SplitViewRight };
