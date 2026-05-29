import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface PanelProps {
	header?: ReactNode;
	children: ReactNode;
	className?: string;
}

export function Panel({ header, children, className }: PanelProps) {
	return (
		<div className={cn("flex flex-col h-full max-h-full pt-2 pb-20 flex-1", className)}>
			{header && (
				<div className="flex items-center py-1 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
					{header}
				</div>
			)}
			<div className="flex-1 overflow-y-auto h-full flex px-4 flex-col">{children}</div>
		</div>
	);
}
