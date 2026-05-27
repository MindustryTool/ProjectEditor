import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface PanelProps {
	header?: ReactNode;
	children: ReactNode;
	className?: string;
}

export function Panel({ header, children, className }: PanelProps) {
	return (
		<div className={cn("flex flex-col h-full", className)}>
			{header && (
				<div className="flex items-center px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">{header}</div>
			)}
			<div className="flex-1 overflow-y-auto p-4">{children}</div>
		</div>
	);
}
