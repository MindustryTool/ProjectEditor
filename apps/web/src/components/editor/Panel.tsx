import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

interface PanelProps {
	children: ReactNode;
	className?: string;
}

export function Panel({ children, className }: PanelProps) {
	return <div className={cn("flex flex-col h-full w-full overflow-y-auto p-2", className)}>{children}</div>;
}
